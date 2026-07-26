import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Building2, Users, Truck, Wallet, Sparkles, ArrowRight,
  CloudRain, Cloud, Sun, Moon, CloudSnow, CloudLightning, Wind, CloudFog,
  Search, Bell, ChevronDown, UploadCloud, FileSpreadsheet, CheckCircle2, X,
} from "lucide-react";
import landscape from "@/assets/command-landscape.jpg";
import logoAsset from "@/assets/greenarea-logo.png.asset.json";
import {
  currentPeriod, greeting, periodLabel, periodOverlay, useLiveWeather,
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
  id: string; label: string; kpi: string; meta: string; trend: string;
  tone: "forest" | "sand" | "rose";
  Icon: React.ComponentType<{ className?: string }>;
  x: number; y: number; to: string;
};

const HOTSPOTS: Hotspot[] = [
  { id: "projects",  label: "Projects",  kpi: "12 Active",   meta: "7 on track · 3 at risk",  trend: "+2 MoM",     tone: "forest", Icon: Building2, x: 30, y: 42, to: "/app/projects"  },
  { id: "employees", label: "Employees", kpi: "18 On Staff", meta: "12 on site · 2 on leave", trend: "$24.8k pay", tone: "sand",   Icon: Users,     x: 70, y: 38, to: "/app/employees" },
  { id: "finance",   label: "Finance",   kpi: "$128,450",    meta: "In $84.2k · Ex $52.1k",   trend: "+12.4% MoM", tone: "forest", Icon: Wallet,    x: 32, y: 72, to: "/app/dashboard" },
  { id: "fleet",     label: "Fleet",     kpi: "6 Vehicles",  meta: "4 active · 1 in service", trend: "Fuel $1.2k", tone: "sand",   Icon: Truck,     x: 68, y: 68, to: "/app/fleet"     },
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

  function flyTo(spot: Hotspot) {
    setZooming(spot);
    setTimeout(() => navigate({ to: spot.to }), 700);
  }

  return (
    <div className="app-dark relative h-screen w-screen overflow-hidden text-foreground">
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
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/55" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
      {period === "night" && weather !== "rain" && weather !== "thunder" && weather !== "snow" && <StarsLayer />}
      {weather === "rain" && <RainLayer />}
      {weather === "thunder" && (<><RainLayer /><LightningLayer /></>)}
      {weather === "snow" && <SnowLayer />}
      {weather === "sandstorm" && <SandstormLayer />}
      {weather === "fog" && <FogLayer />}

      {/* Content */}
      <div className={`relative z-10 h-screen w-screen flex flex-col transition-opacity duration-500 ${zooming ? "opacity-0" : "opacity-100"}`}>
        <TopBar now={now} weather={weather} period={period} place={live.place} tempC={live.tempC} />

        <div className="flex-1 min-h-0 grid grid-cols-12 gap-3 lg:gap-4 px-4 lg:px-5 pb-4 lg:pb-5 pt-3">
          {/* Left rail */}
          <aside className="hidden md:flex md:col-span-3 flex-col gap-3 min-h-0">
            <FinancialCard />
            <RecentActivityCard />
          </aside>

          {/* Center: greeting + hotspots + Ask OS */}
          <section className="col-span-12 md:col-span-6 flex flex-col min-h-0 gap-3">
            <GreetingHeader period={period} />
            <div className="relative flex-1 min-h-0">
              {HOTSPOTS.map((s) => (
                <HotspotLabel key={s.id} spot={s} onClick={() => flyTo(s)} />
              ))}
            </div>
            <AIAssistantBar />
          </section>

          {/* Right rail */}
          <aside className="hidden md:flex md:col-span-3 flex-col gap-3 min-h-0">
            <ProjectsOverviewCard />
            <AIInsightsCard />
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Top bar ─────────────── */
function TopBar({ now, weather, period }: { now: Date; weather: Weather; period: Period }) {
  const dateStr = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  return (
    <header className="h-14 shrink-0 px-4 lg:px-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <img src={logoAsset.url} alt="" className="h-8 w-8" />
        <div className="leading-tight hidden sm:block">
          <p className="font-medium tracking-[0.2em] text-[12px] text-white">GREEN AREA</p>
          <p className="text-[8.5px] uppercase tracking-[0.32em] text-white/55 mt-0.5 flex items-center gap-1.5">
            <WeatherGlyph weather={weather} period={period} /> {dateStr} · Baghdad
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="hidden md:flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/10 px-3.5 py-1.5 text-xs text-white/70 w-64">
          <Search className="h-3.5 w-3.5 opacity-70" />
          <span className="font-light">Search projects, entries, people…</span>
        </div>
        <UploadERPPill />
        <button className="relative rounded-full p-2 hover:bg-white/10 bg-white/[0.04] border border-white/10 transition" aria-label="Notifications">
          <Bell className="h-3.5 w-3.5 text-white/80" />
          <span className="absolute top-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-forest text-forest-deep text-[9px] grid place-items-center font-medium">3</span>
        </button>
        <button className="flex items-center gap-1.5 rounded-full pl-1 pr-2 py-1 bg-white/[0.04] border border-white/10 hover:bg-white/10 transition">
          <span className="h-7 w-7 rounded-full bg-forest/25 border border-forest/30 grid place-items-center text-forest font-medium text-[11px]">GA</span>
          <ChevronDown className="h-3 w-3 text-white/70" />
        </button>
      </div>
    </header>
  );
}

/* ─────────────── Upload ERP (top bar pill) ─────────────── */
function UploadERPPill() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  function onFiles(list: FileList | null) {
    const f = list?.[0];
    if (!f) return;
    setFile(f);
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); onFiles(e.dataTransfer.files); }}
      className={`hidden md:flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
        dragging ? "border-forest/60 bg-forest/15" : "border-white/10 bg-white/[0.06] hover:bg-white/10"
      }`}
    >
      <span className="h-6 w-6 rounded-full bg-forest/25 border border-forest/30 grid place-items-center shrink-0">
        {file ? <CheckCircle2 className="h-3 w-3 text-forest" /> : <UploadCloud className="h-3 w-3 text-forest" />}
      </span>
      {file ? (
        <>
          <FileSpreadsheet className="h-3 w-3 text-white/70" />
          <span className="text-white/90 max-w-[140px] truncate">{file.name}</span>
          <button className="rounded-full bg-forest text-forest-deep font-medium text-[10.5px] px-2.5 py-0.5 hover:brightness-110 transition">Import</button>
          <button onClick={() => setFile(null)} className="text-white/60 hover:text-white" aria-label="Remove"><X className="h-3 w-3" /></button>
        </>
      ) : (
        <button onClick={() => inputRef.current?.click()} className="text-white/85 hover:text-white flex items-center gap-1.5">
          Drop latest <span className="text-white">GreenArea ERP</span>
          <span className="text-white/50">· .xlsx</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
    </div>
  );
}

/* ─────────────── Greeting ─────────────── */
function GreetingHeader({ period }: { period: Period }) {
  return (
    <div className="text-center text-white shrink-0">
      <h1 className="font-display text-3xl md:text-4xl leading-none drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">{periodLabel(period)}</h1>
      <p className="mt-1.5 text-[12px] text-white/75">{greeting(period)}, Ako · every place is a room</p>
    </div>
  );
}

/* ─────────────── Hotspot ─────────────── */
function HotspotLabel({ spot, onClick }: { spot: Hotspot; onClick: () => void }) {
  const { Icon } = spot;
  const toneText = spot.tone === "forest" ? "text-forest" : spot.tone === "rose" ? "text-rose-300" : "text-sand";
  return (
    <button
      onClick={onClick}
      className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
      aria-label={`${spot.label} — ${spot.kpi}`}
    >
      <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full border border-cyan-200/50 animate-ping" style={{ animationDuration: "2.8s" }} />
      <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-cyan-100/30 animate-ping" style={{ animationDuration: "3.6s", animationDelay: "0.6s" }} />
      <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full border border-cyan-100/20 animate-ping" style={{ animationDuration: "4.4s", animationDelay: "1.2s" }} />
      <div className="relative mt-3 flex items-stretch gap-2.5 rounded-2xl pl-2.5 pr-3.5 py-2 text-white/95 transition-all duration-300 group-hover:scale-[1.05] bg-white/[0.06] border border-white/10 min-w-[170px]">
        <span className="h-8 w-8 self-center rounded-xl bg-white/10 grid place-items-center shrink-0">
          <Icon className="h-3.5 w-3.5 text-white/90" />
        </span>
        <div className="text-left leading-tight">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/60">{spot.label}</p>
            <p className={`text-[9px] ${toneText}`}>{spot.trend}</p>
          </div>
          <p className="text-[13px] font-medium mt-0.5">{spot.kpi}</p>
          <p className="text-[10px] text-white/60 mt-0.5">{spot.meta}</p>
        </div>
      </div>
    </button>
  );
}

/* ─────────────── Weather glyph ─────────────── */
function WeatherGlyph({ weather, period }: { weather: Weather; period: Period }) {
  const cls = "h-3 w-3 opacity-80";
  if (weather === "rain") return <CloudRain className={cls} />;
  if (weather === "cloudy") return <Cloud className={cls} />;
  if (period === "night") return <Moon className={cls} />;
  return <Sun className={cls} />;
}

/* ─────────────── Rain ─────────────── */
function RainLayer() {
  const drops = Array.from({ length: 50 }, (_, i) => i);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40 z-[5]">
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

/* ─────────────── Ask OS bar (inline, aligned with rails) ─────────────── */
function AIAssistantBar() {
  const [q, setQ] = useState("");
  const examples = ["Show fuel expenses", "Summarize today", "Missing receipts"];
  return (
    <div className="shrink-0 rounded-2xl bg-white/[0.06] border border-white/10 px-4 py-2.5 text-white">
      <div className="flex items-center gap-3">
        <span className="h-8 w-8 rounded-full bg-forest text-forest-deep grid place-items-center shrink-0">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] uppercase tracking-[0.28em] text-white/60">Ask OS</p>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask anything about Green Area…"
            className="w-full bg-transparent outline-none text-[13px] placeholder:text-white/40 mt-0.5"
          />
        </div>
        <div className="hidden xl:flex gap-1.5">
          {examples.map((e) => (
            <button key={e} onClick={() => setQ(e)} className="text-[10.5px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition">
              {e}
            </button>
          ))}
        </div>
        <button className="rounded-full bg-forest text-forest-deep font-medium text-xs px-4 py-1.5 hover:brightness-110 transition shrink-0">
          Ask
        </button>
      </div>
    </div>
  );
}

/* ─────────────── Side rail cards ─────────────── */
function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-4 text-white min-h-0 flex flex-col flex-1">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[9px] uppercase tracking-[0.28em] text-white/55">{title}</p>
        {action && <span className="text-[10px] text-white/55">{action}</span>}
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

function FinancialCard() {
  const rows = [
    { code: "USD", val: "$128,450",   pct: "+12.4%" },
    { code: "EUR", val: "€84,220",    pct: "+3.2%"  },
    { code: "GBP", val: "£62,180",    pct: "-1.1%"  },
    { code: "IQD", val: "د.ع 184.9m", pct: "+0.6%"  },
  ];
  return (
    <Card title="Financial Overview" action="30d">
      <ul className="divide-y divide-white/5">
        {rows.map((r) => (
          <li key={r.code} className="py-1.5 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white/55">{r.code}</p>
              <p className="text-[12.5px] font-medium">{r.val}</p>
            </div>
            <span className={`text-[10.5px] ${r.pct.startsWith("+") ? "text-forest" : "text-rose-300"}`}>{r.pct}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function RecentActivityCard() {
  const rows = [
    { d: "2m",  t: "Payment received · Riverside", tone: "forest" as const },
    { d: "18m", t: "Invoice issued · Karrada",     tone: "sand"   as const },
    { d: "1h",  t: "Site log · Erbil",             tone: "forest" as const },
    { d: "2h",  t: "Fuel expense · Workshop",      tone: "rose"   as const },
  ];
  return (
    <Card title="Recent Activity" action={<button className="flex items-center gap-1 hover:text-white transition">View <ArrowRight className="h-2.5 w-2.5" /></button>}>
      <ul className="space-y-2">
        {rows.map((r, i) => (
          <li key={i} className="flex items-start gap-2 text-[12px]">
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${r.tone === "forest" ? "bg-forest" : r.tone === "rose" ? "bg-rose-400" : "bg-sand"}`} />
            <div className="flex-1 leading-tight">
              <p className="text-white/85">{r.t}</p>
              <p className="text-[10px] text-white/50 mt-0.5">{r.d} ago</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ProjectsOverviewCard() {
  const rows = [
    { name: "Riverside Villa",  pct: 72, tone: "forest" as const },
    { name: "Karrada Rooftop",  pct: 48, tone: "sand"   as const },
    { name: "Erbil Courtyard",  pct: 91, tone: "forest" as const },
    { name: "Baghdad Garden",   pct: 22, tone: "rose"   as const },
  ];
  return (
    <Card title="Projects Overview" action="12 active">
      <ul className="space-y-2.5">
        {rows.map((r) => (
          <li key={r.name}>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-white/85">{r.name}</span>
              <span className="text-white/55 text-[10.5px]">{r.pct}%</span>
            </div>
            <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <div className={`h-full ${r.tone === "forest" ? "bg-forest" : r.tone === "rose" ? "bg-rose-400" : "bg-sand"}`} style={{ width: `${r.pct}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function AIInsightsCard() {
  return (
    <Card title="AI Insights">
      <ul className="space-y-2 text-[12px] text-white/80">
        <li className="flex gap-2"><span className="text-forest">◆</span> Fuel spend up 18% vs last month — 2 vehicles over budget.</li>
        <li className="flex gap-2"><span className="text-sand">◆</span> Riverside Villa cashflow healthy; +$18k received today.</li>
        <li className="flex gap-2"><span className="text-rose-300">◆</span> Baghdad Garden behind schedule — payroll due Friday.</li>
      </ul>
    </Card>
  );
}
