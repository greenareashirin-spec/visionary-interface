import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  HardHat, UsersRound, Truck, Coins, FileText, Package, ArrowRight, ArrowUp,
  CloudRain, Cloud, Sun, Moon, CloudSnow, CloudLightning, Wind, CloudFog,
  Search, Bell, ChevronDown, Plus, Sparkles, CheckCircle2, Loader2,
} from "lucide-react";
import landscape from "@/assets/command-landscape.jpg";
import moonPhoto from "@/assets/moon-full.png";
import logoAsset from "@/assets/greenarea-logo.png.asset.json";
import { askOS } from "@/lib/ask-os-store";
import { useErpData, uploadErpFile } from "@/lib/erp-store";
import {
  currentPeriod, greeting, periodOverlay, useLiveWeather,
  type Period, type Weather,
} from "@/lib/weather";

export const Route = createFileRoute("/os")({
  component: CommandCenter,
  head: () => ({
    meta: [
      { title: "Command Center · GreenArea OS" },
      { name: "description", content: "The GreenArea Command Center — a living landscape as your navigation." },
    ],
  }),
});

type Hotspot = {
  id: string; label: string; kpi: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  x: number; y: number; to: string; essential?: boolean;
};

const HOTSPOTS: Hotspot[] = [
  { id: "projects",  label: "Projects",  kpi: "12 Active",    Icon: HardHat,    x: 18, y: 34, to: "/app/projects",  essential: true },
  { id: "employees", label: "Employees", kpi: "18 On site",   Icon: UsersRound, x: 46, y: 26, to: "/app/employees" },
  { id: "finance",   label: "Finance",   kpi: "$128,450",     Icon: Coins,      x: 78, y: 44, to: "/app/dashboard", essential: true },
  { id: "documents", label: "Documents", kpi: "128 Files",    Icon: FileText,   x: 32, y: 62, to: "/app/daily-log" },
  { id: "materials", label: "Materials", kpi: "156 Items",    Icon: Package,    x: 62, y: 68, to: "/app/materials" },
  { id: "fleet",     label: "Fleet",     kpi: "6 Vehicles",   Icon: Truck,      x: 84, y: 74, to: "/app/fleet"     },
];

function CommandCenter() {
  const navigate = useNavigate();
  const [zooming, setZooming] = useState<Hotspot | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const period: Period = currentPeriod(now);
  const live = useLiveWeather();
  const weather: Weather = live.weather;
  const overlay = useMemo(() => periodOverlay(period), [period]);

  const { data: erp } = useErpData();
  const hotspots = useMemo<Hotspot[]>(() => {
    if (!erp) return HOTSPOTS;
    const headline =
      erp.balances.find((b) => b.currency.toUpperCase() === "USD") ??
      [...erp.balances].sort((a, b) => Math.abs(b.net) - Math.abs(a.net))[0];
    const overrides: Record<string, string> = {
      projects: `${erp.projects.length} Projects`,
      employees: `${erp.employees.length} Team`,
      documents: `${erp.totalEntries} Logged`,
    };
    if (headline) {
      overrides.finance = `${headline.net < 0 ? "-" : "+"}$${(Math.abs(headline.net) / 1000).toFixed(1)}K ${headline.currency}`;
    }
    return HOTSPOTS.map((s) => (overrides[s.id] ? { ...s, kpi: overrides[s.id] } : s));
  }, [erp]);

  function flyTo(spot: Hotspot) {
    setZooming(spot);
    setTimeout(() => navigate({ to: spot.to }), 700);
  }


  return (
    <div className="app-dark relative min-h-screen md:h-screen w-screen md:overflow-hidden text-foreground">
      {/* Full-bleed scene */}
      <div
        className={`fixed inset-0 transition-all ease-out ${zooming ? "duration-[700ms]" : "duration-[1200ms]"}`}
        style={{
          transform: zooming
            ? `scale(1.6) translate(${(50 - zooming.x) * 0.5}%, ${(50 - zooming.y) * 0.5}%)`
            : "scale(1.02)",
          filter: zooming ? "blur(6px) brightness(0.75)" : overlay.filter,
        }}
      >
        <img src={landscape} alt="Green Area landscape" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="fixed inset-0 pointer-events-none" style={{ background: overlay.gradient }} />
      <div className="fixed inset-0 pointer-events-none mix-blend-overlay" style={{ background: overlay.tint }} />
      {/* Permanent legibility overlay: top→bottom + vignette */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-black/25 via-black/20 to-black/55" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
      {period === "night" && weather !== "rain" && weather !== "thunder" && weather !== "snow" && <StarsLayer />}
      {period === "night" && weather !== "rain" && weather !== "thunder" && weather !== "snow" && weather !== "fog" && weather !== "sandstorm" && <RealisticMoon now={now} />}
      {weather === "rain" && <RainLayer />}
      {weather === "thunder" && (<><RainLayer /><LightningLayer /></>)}
      {weather === "snow" && <SnowLayer />}
      {weather === "sandstorm" && <SandstormLayer />}
      {weather === "fog" && <FogLayer />}

      {/* Content */}
      <div className={`relative z-10 min-h-screen md:h-screen w-screen flex flex-col transition-opacity duration-500 ${zooming ? "opacity-0" : "opacity-100"}`}>
        <TopBar now={now} weather={weather} period={period} place={live.place} tempC={live.tempC} />

        {/* Greeting */}
        <GreetingHeader period={period} place={live.place} tempC={live.tempC} now={now} />

        {/* Hero region with cards + hotspots (desktop/tablet) */}
        <div className="flex-1 min-h-0 grid grid-cols-12 gap-3 lg:gap-4 px-4 lg:px-5 pt-2 md:pt-3">
          {/* Left column: two stacked cards, hidden on mobile */}
          <aside className="hidden md:flex md:col-span-3 flex-col gap-3 min-h-0">
            <FinancialCard />
            <RecentActivityCard />
          </aside>

          {/* Center: hotspots layer + Ask OS aligned with lower cards */}
          <section className="hidden md:flex md:col-span-6 col-span-12 flex-col min-h-0">
            <div className="relative flex-1 min-h-0">
              {hotspots.map((s) => (
                <HotspotPill key={s.id} spot={s} onClick={() => flyTo(s)} />
              ))}
            </div>
            <CommandBar embedded />
          </section>

          {/* Mobile hotspots: only the essentials, on the photo */}
          <section className="md:hidden col-span-12 relative h-[38vh]">
            {hotspots.filter((s) => s.essential).map((s, i) => (
              <div
                key={s.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: i === 0 ? "28%" : "72%", top: i === 0 ? "45%" : "62%" }}
              >
                <HotspotPill spot={s} onClick={() => flyTo(s)} compact />
              </div>
            ))}
          </section>

          {/* Right column: two stacked cards, hidden on mobile */}
          <aside className="hidden md:flex md:col-span-3 flex-col gap-3 min-h-0">
            <ProjectsOverviewCard />
            <CashflowCard />
          </aside>
        </div>

        {/* Mobile: cards stacked below photo */}
        <div className="md:hidden flex flex-col gap-3 px-4 pt-2 pb-4">
          <FinancialCard />
          <ProjectsOverviewCard />
          <CashflowCard />
          <RecentActivityCard />
        </div>

        {/* Bottom command bar */}
        <CommandBar />
      </div>
    </div>
  );
}

/* ─────────────── Top Bar ─────────────── */
function TopBar({ now, weather, period, place, tempC }: { now: Date; weather: Weather; period: Period; place: string; tempC: number | null }) {
  void now; void place; void tempC;
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <header className="h-14 shrink-0 px-4 lg:px-5 flex items-center justify-between gap-3">
      {/* Left: logo + wordmark */}
      <div className="flex items-center gap-3 min-w-0">
        <img src={logoAsset.url} alt="" className="h-8 w-8 shrink-0" />
        <div className="leading-tight hidden sm:block">
          <p className="font-medium tracking-[0.24em] text-[11px] text-white">GREEN AREA</p>
          <p className="text-[8.5px] uppercase tracking-[0.32em] text-white/55 mt-0.5 flex items-center gap-1.5">
            <WeatherGlyph weather={weather} period={period} />
            <span>Operating System</span>
          </p>
        </div>
      </div>

      {/* Center: search (desktop/tablet) */}
      <div className="hidden md:flex items-center gap-2 rounded-full bg-black/38 backdrop-blur-xl border border-white/10 px-4 py-2 text-xs text-white/70 flex-1 max-w-md mx-2">
        <Search className="h-3.5 w-3.5 opacity-70" />
        <input
          placeholder="Search projects, entries, people…"
          className="bg-transparent outline-none flex-1 placeholder:text-white/45 font-light"
        />
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2">
        {/* Mobile search icon */}
        <button
          onClick={() => setSearchOpen((v) => !v)}
          aria-label="Search"
          className="md:hidden rounded-full p-2 bg-black/38 backdrop-blur-xl border border-white/10 hover:bg-white/15 transition"
        >
          <Search className="h-3.5 w-3.5 text-white/80" />
        </button>
        <WorkspacePill />
        <button
          aria-label="Notifications"
          className="relative rounded-full p-2 hover:bg-white/15 bg-black/38 backdrop-blur-xl border border-white/10 transition"
        >
          <Bell className="h-3.5 w-3.5 text-white/80" />
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-forest text-forest-deep text-[9px] grid place-items-center font-medium">3</span>
        </button>
        <button className="flex items-center gap-1.5 rounded-full pl-1 pr-2 py-1 bg-black/38 backdrop-blur-xl border border-white/10 hover:bg-white/15 transition">
          <span className="h-7 w-7 rounded-full bg-forest/25 border border-forest/30 grid place-items-center text-forest font-medium text-[11px]">GA</span>
          <ChevronDown className="h-3 w-3 text-white/70" />
        </button>
      </div>

      {searchOpen && (
        <div className="md:hidden absolute left-3 right-3 top-14 z-30">
          <div className="flex items-center gap-2 rounded-full bg-black/70 backdrop-blur-xl border border-white/10 px-3.5 py-2">
            <Search className="h-3.5 w-3.5 text-white/70" />
            <input
              autoFocus
              placeholder="Search projects, entries, people…"
              className="bg-transparent outline-none flex-1 text-[12px] text-white placeholder:text-white/45"
            />
          </div>
        </div>
      )}
    </header>
  );
}

function WorkspacePill() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, status, error } = useErpData();
  return (
    <>
      <button
        onClick={() => inputRef.current?.click()}
        className="hidden sm:flex items-center gap-1.5 rounded-full bg-black/38 backdrop-blur-xl border border-white/10 px-2.5 py-1.5 text-[11px] text-white/85 hover:bg-white/15 transition max-w-[230px]"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-forest shadow-[0_0_6px_rgba(120,220,150,0.7)]" />
        <span className="font-medium shrink-0">GreenArea ERP</span>
        {status === "loading" ? (
          <span className="flex items-center gap-1 text-white/70 min-w-0">
            <Loader2 className="h-3 w-3 shrink-0 animate-spin" />
            <span className="truncate">Parsing…</span>
          </span>
        ) : status === "error" ? (
          <span className="truncate text-amber-300 min-w-0">{error ?? "Upload failed"}</span>
        ) : data ? (
          <span className="flex items-center gap-1 text-forest min-w-0">
            <CheckCircle2 className="h-3 w-3 shrink-0" />
            <span className="truncate">{data.totalEntries} entries · {data.projects.length} projects</span>
          </span>
        ) : (
          <span className="text-white/45">· Latest</span>
        )}
        <ChevronDown className="h-3 w-3 text-white/70 ml-0.5 shrink-0" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void uploadErpFile(f);
          e.target.value = "";
        }}
      />
    </>
  );
}

/* ─────────────── Greeting ─────────────── */
function GreetingHeader({ period, place, tempC, now }: { period: Period; place: string; tempC: number | null; now: Date }) {
  const dateStr = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="text-center text-white shrink-0 px-4 pt-3 md:pt-5">
      <p className="text-[9.5px] uppercase tracking-[0.32em] text-white/65">
        {dateStr} · {place}{tempC != null ? ` · ${Math.round(tempC)}°C` : ""}
      </p>
      <h1 className="font-display text-[26px] md:text-[42px] leading-[1.05] mt-1.5 drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
        {greeting(period)}, Ako
      </h1>
      <p className="mt-1 md:mt-2 text-[12px] md:text-[13.5px] italic font-light text-white/75">
        Make each day your masterpiece.
      </p>
    </div>
  );
}

/* ─────────────── Hotspot pill ─────────────── */
function HotspotPill({ spot, onClick, compact }: { spot: Hotspot; onClick: () => void; compact?: boolean }) {
  const { Icon } = spot;
  const style = compact ? undefined : { left: `${spot.x}%`, top: `${spot.y}%` };
  const positional = compact ? "" : "absolute -translate-x-1/2 -translate-y-1/2";
  return (
    <button
      onClick={onClick}
      className={`${positional} group focus:outline-none`}
      style={style}
      aria-label={`${spot.label} — ${spot.kpi}`}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0 -m-2 rounded-full border border-cyan-100/25 animate-ping" style={{ animationDuration: "3s" }} />
      <span className="relative flex items-center gap-2 rounded-full bg-black/45 backdrop-blur-md border border-white/15 pl-2 pr-3 py-1.5 text-white shadow-[0_6px_20px_-6px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:scale-[1.05] group-hover:bg-black/60">
        <span className="h-6 w-6 rounded-full bg-white/10 border border-white/20 grid place-items-center shrink-0">
          <Icon className="h-3 w-3 text-white" strokeWidth={1.6} />
        </span>
        <span className="text-left leading-tight">
          <span className="block text-[8.5px] uppercase tracking-[0.22em] text-white/60">{spot.label}</span>
          <span className="block text-[11px] font-medium text-white">{spot.kpi}</span>
        </span>
      </span>
    </button>
  );
}

/* ─────────────── Bottom Command Bar ─────────────── */
const QUICK_SUGGESTIONS = ["Fuel expenses", "Project status", "Missing receipts", "Today's summary"];

function CommandBar({ embedded = false }: { embedded?: boolean }) {
  const [q, setQ] = useState("");
  function submit(text?: string) {
    const value = (text ?? q).trim();
    if (!value) return;
    askOS(value);
    setQ("");
  }
  return (
    <div className={embedded ? "shrink-0 pt-2" : "md:hidden shrink-0 px-4 pt-2 pb-3"}>
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/45 backdrop-blur-xl px-2 py-1.5 text-white">
          <span className="h-8 w-8 rounded-full bg-forest text-forest-deep grid place-items-center shrink-0">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder="Ask OS anything…"
            className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-white/45 min-w-0"
          />
          <button
            onClick={() => submit()}
            aria-label="Send"
            className="h-8 w-8 rounded-full bg-forest text-forest-deep grid place-items-center hover:brightness-110 transition shrink-0"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
        {/* Chips */}
        <div className="mt-2 flex gap-1.5 overflow-x-auto md:flex-wrap md:justify-center md:overflow-visible no-scrollbar pb-0.5">
          {QUICK_SUGGESTIONS.map((c) => (
            <button
              key={c}
              onClick={() => submit(c)}
              className="shrink-0 text-[10.5px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/75 hover:bg-white/15 hover:text-white transition"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Weather glyph ─────────────── */
function WeatherGlyph({ weather, period }: { weather: Weather; period: Period }) {
  const cls = "h-3 w-3 opacity-80";
  if (weather === "thunder") return <CloudLightning className={cls} />;
  if (weather === "rain") return <CloudRain className={cls} />;
  if (weather === "snow") return <CloudSnow className={cls} />;
  if (weather === "fog") return <CloudFog className={cls} />;
  if (weather === "sandstorm") return <Wind className={cls} />;
  if (weather === "cloudy") return <Cloud className={cls} />;
  if (period === "night") return <Moon className={cls} />;
  return <Sun className={cls} />;
}

/* ─────────────── Rain ─────────────── */
function RainLayer() {
  const drops = Array.from({ length: 60 }, (_, i) => i);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-45 z-[5]">
      {drops.map((i) => {
        const left = (i * 53) % 100;
        const delay = (i * 137) % 2500;
        const dur = 900 + ((i * 71) % 800);
        return (
          <span key={i} className="absolute top-[-10%] w-px h-6 bg-white/60"
            style={{ left: `${left}%`, animation: `rain-fall ${dur}ms linear ${delay}ms infinite`, transform: "rotate(12deg)" }} />
        );
      })}
      <style>{`@keyframes rain-fall { to { transform: translateY(120vh) rotate(12deg); } }`}</style>
    </div>
  );
}

/* ─────────────── Stars ─────────────── */
function StarsLayer() {
  const stars = Array.from({ length: 110 }, (_, i) => {
    const r1 = Math.sin(i * 12.9898) * 43758.5453;
    const r2 = Math.sin(i * 78.233) * 12345.6789;
    const left = ((r1 - Math.floor(r1)) * 100);
    const top = ((r2 - Math.floor(r2)) * 70);
    const size = 0.6 + ((i * 7) % 5) * 0.25;
    const delay = (i * 173) % 5000;
    const baseOpacity = 0.35 + ((i * 19) % 45) / 100;
    return { i, left, top, size, delay, baseOpacity };
  });
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[4]">
      {stars.map((s) => (
        <span
          key={s.i}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, opacity: s.baseOpacity, animation: `star-tw 4s ease-in-out ${s.delay}ms infinite` }}
        />
      ))}
      <style>{`@keyframes star-tw { 0%,100% { opacity: 0.2 } 50% { opacity: 0.75 } }`}</style>
    </div>
  );
}

/* ─────────────── Realistic moon ─────────────── */
function RealisticMoon({ now }: { now: Date }) {
  const REF = Date.UTC(2000, 0, 6, 18, 14) / 1000;
  const SYNODIC = 29.530588853 * 86400;
  const t = now.getTime() / 1000;
  const phase = (((t - REF) % SYNODIC) + SYNODIC) % SYNODIC / SYNODIC;
  const k = Math.cos(2 * Math.PI * phase);
  const waxing = phase < 0.5;
  const R = 50;
  const rx = Math.abs(k) * R;
  const outerSweep = waxing ? 0 : 1;
  const innerSweep = waxing ? (k >= 0 ? 0 : 1) : (k >= 0 ? 1 : 0);
  const shadowPath =
    `M ${R},0 A ${R},${R} 0 1 ${outerSweep} ${R},${2 * R} ` +
    `A ${rx},${R} 0 1 ${innerSweep} ${R},0 Z`;
  return (
    <div className="fixed pointer-events-none z-[5] w-[54px] h-[54px] md:w-[64px] md:h-[64px] lg:w-[84px] lg:h-[84px]" style={{ left: "22%", top: "5%" }} aria-hidden>
      <div className="absolute rounded-full" style={{ inset: "-70%", background: "radial-gradient(circle, rgba(230,232,240,0.18) 0%, rgba(230,232,240,0.05) 40%, transparent 72%)", filter: "blur(12px)" }} />
      <img src={moonPhoto} alt="" draggable={false} className="absolute inset-0 w-full h-full select-none"
        style={{
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 42%, rgba(0,0,0,0.85) 48%, transparent 50%)",
          maskImage: "radial-gradient(circle at 50% 50%, black 42%, rgba(0,0,0,0.85) 48%, transparent 50%)",
          filter: "brightness(1.02) contrast(1.02)",
        }}
      />
      <svg viewBox={`0 0 ${2 * R} ${2 * R}`} className="absolute inset-0 w-full h-full"
        style={{
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 42%, rgba(0,0,0,0.9) 48%, transparent 50%)",
          maskImage: "radial-gradient(circle at 50% 50%, black 42%, rgba(0,0,0,0.9) 48%, transparent 50%)",
        }}>
        <path d={shadowPath} fill="rgba(6,8,14,0.88)" />
      </svg>
    </div>
  );
}

/* ─────────────── Lightning ─────────────── */
function LightningLayer() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[6] bg-white" style={{ animation: "lightning 6s linear infinite", opacity: 0 }}>
      <style>{`@keyframes lightning { 0%,92%,100% { opacity: 0 } 93% { opacity: 0.55 } 94% { opacity: 0.05 } 95% { opacity: 0.45 } 96% { opacity: 0 } }`}</style>
    </div>
  );
}

/* ─────────────── Snow ─────────────── */
function SnowLayer() {
  const flakes = Array.from({ length: 70 }, (_, i) => i);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5] opacity-80">
      {flakes.map((i) => {
        const left = (i * 41) % 100;
        const delay = (i * 191) % 6000;
        const dur = 6000 + ((i * 97) % 5000);
        const size = 2 + ((i * 13) % 4);
        return (
          <span key={i} className="absolute top-[-5%] rounded-full bg-white/85"
            style={{ left: `${left}%`, width: size, height: size, animation: `snow-fall ${dur}ms linear ${delay}ms infinite` }} />
        );
      })}
      <style>{`@keyframes snow-fall { to { transform: translate(20px, 120vh) } }`}</style>
    </div>
  );
}

/* ─────────────── Sandstorm & fog ─────────────── */
function SandstormLayer() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5]">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(200,150,90,0.35), rgba(150,100,60,0.25))", mixBlendMode: "multiply" }} />
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 30% 60%, rgba(230,180,120,0.5), transparent 55%), radial-gradient(circle at 70% 40%, rgba(210,160,100,0.5), transparent 55%)", animation: "sand-drift 14s ease-in-out infinite" }} />
      <style>{`@keyframes sand-drift { 0%,100% { transform: translateX(-3%) } 50% { transform: translateX(3%) } }`}</style>
    </div>
  );
}
function FogLayer() {
  return <div className="fixed inset-0 pointer-events-none z-[5]" style={{ background: "linear-gradient(180deg, rgba(220,225,235,0.15), rgba(200,210,225,0.35) 60%, rgba(180,190,205,0.25))" }} />;
}

/* ─────────────── Cards ─────────────── */
function Card({ title, action, children, fit }: { title: string; action?: React.ReactNode; children: React.ReactNode; fit?: boolean }) {
  return (
    <div className={`rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-4 text-white min-h-0 flex flex-col ${fit ? "md:flex-none md:shrink-0" : "md:flex-1"}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[9px] uppercase tracking-[0.28em] text-white/60">{title}</p>
        {action && <span className="text-[10px] text-white/60">{action}</span>}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 60, h = 18;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const step = w / (data.length - 1);
  const d = data.map((v, i) => `${i === 0 ? "M" : "L"}${i * step},${h - ((v - min) / span) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="opacity-90">
      <path d={d} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FinancialCard() {
  const rows = [
    { code: "USD", val: "$128,450",   pct: "+12.4%", up: true,  data: [20,22,21,25,24,28,30,32,31,34,36,38] },
    { code: "EUR", val: "€84,220",    pct: "+3.2%",  up: true,  data: [40,41,39,42,43,44,43,45,44,46,47,48] },
    { code: "GBP", val: "£62,180",    pct: "-1.1%",  up: false, data: [50,49,51,48,49,47,48,46,47,45,46,44] },
    { code: "IQD", val: "د.ع 184.9m", pct: "+0.6%",  up: true,  data: [30,31,30,32,31,33,32,34,33,34,35,36] },
  ];
  return (
    <Card title="Financial Overview · 30d" fit>
      <ul className="divide-y divide-white/5">
        {rows.map((r) => (
          <li key={r.code} className="py-1.5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] text-white/55">{r.code}</p>
              <p className="text-[12.5px] font-medium truncate">{r.val}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Sparkline data={r.data} color={r.up ? "oklch(0.72 0.14 145)" : "rgb(251 113 133)"} />
              <span className={`text-[10.5px] ${r.up ? "text-forest" : "text-rose-300"}`}>{r.pct}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function RecentActivityCard() {
  const rows = [
    { d: "2m",  t: "Payment received", p: "Riverside Villa",  tone: "forest" as const },
    { d: "18m", t: "Invoice issued",   p: "Karrada Rooftop",  tone: "sand"   as const },
    { d: "1h",  t: "Site log",         p: "Erbil Courtyard",  tone: "forest" as const },
    { d: "2h",  t: "Fuel expense",     p: "Workshop",         tone: "rose"   as const },
  ];
  return (
    <Card title="Recent Activity" action={<button className="flex items-center gap-1 hover:text-white transition">View all <ArrowRight className="h-2.5 w-2.5" /></button>}>
      <ul className="space-y-2">
        {rows.map((r, i) => (
          <li key={i} className="flex items-start gap-2 text-[12px]">
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${r.tone === "forest" ? "bg-forest" : r.tone === "rose" ? "bg-rose-400" : "bg-sand"}`} />
            <div className="flex-1 leading-tight min-w-0">
              <p className="text-white/90 truncate">{r.t}</p>
              <p className="text-[10px] text-white/50 mt-0.5 truncate">{r.p} · {r.d} ago</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ProjectsOverviewCard() {
  const rows = [
    { name: "Riverside Villa", pct: 72, tone: "forest" as const },
    { name: "Karrada Rooftop", pct: 48, tone: "sand"   as const },
    { name: "Erbil Courtyard", pct: 91, tone: "forest" as const },
    { name: "Baghdad Garden",  pct: 22, tone: "rose"   as const },
  ];
  return (
    <Card title="Projects Overview" action="12 active">
      <ul className="space-y-2.5">
        {rows.map((r) => (
          <li key={r.name}>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-white/90 truncate">{r.name}</span>
              <span className="text-white/55 text-[10.5px]">{r.pct}%</span>
            </div>
            <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <div className={`h-full ${r.tone === "forest" ? "bg-forest" : r.tone === "rose" ? "bg-rose-400" : "bg-sand"}`} style={{ width: `${r.pct}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <button className="mt-3 flex items-center gap-1 text-[10px] text-white/60 hover:text-white transition">
        View all projects <ArrowRight className="h-2.5 w-2.5" />
      </button>
    </Card>
  );
}

function CashflowCard() {
  const income = 84200;
  const expense = 52100;
  const net = income - expense;
  const bars = [
    { i: 12, e: 8 }, { i: 15, e: 10 }, { i: 9, e: 11 }, { i: 18, e: 9 },
    { i: 14, e: 12 }, { i: 20, e: 7 }, { i: 11, e: 13 }, { i: 17, e: 9 },
    { i: 13, e: 8 }, { i: 19, e: 11 }, { i: 16, e: 10 }, { i: 22, e: 9 },
  ];
  const max = Math.max(...bars.map((b) => Math.max(b.i, b.e)));
  const fmt = (n: number) => `$${(n / 1000).toFixed(1)}k`;
  return (
    <Card title="Cashflow · 30d">
      <div className="flex flex-col h-full">
        <div>
          <p className="text-[9px] uppercase tracking-[0.24em] text-white/55">Net</p>
          <p className="text-[24px] font-medium text-white leading-none mt-1">{fmt(net)}</p>
        </div>
        <div className="mt-3 h-14 flex items-stretch justify-between gap-[5px]">
          {bars.map((b, i) => (
            <div key={i} className="flex flex-col items-center justify-center h-full">
              {/* income above midline */}
              <div className="h-1/2 w-[3.5px] flex items-end">
                <div className="w-full rounded-t-[2px] bg-forest/90" style={{ height: `${(b.i / max) * 100}%` }} />
              </div>
              <div className="h-px w-full bg-white/12" />
              {/* expense below midline */}
              <div className="h-1/2 w-[3.5px] flex items-start">
                <div className="w-full rounded-b-[2px] bg-rose-400/85" style={{ height: `${(b.e / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <ul className="mt-3 flex items-center justify-between text-[10.5px] text-white/75">
          <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-forest" /> Income <span className="text-white/95 font-medium ml-1">{fmt(income)}</span></li>
          <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-400" /> Expenses <span className="text-white/95 font-medium ml-1">{fmt(expense)}</span></li>
        </ul>
      </div>
    </Card>
  );
}

