import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Wallet, Building2, Users, Truck, FolderOpen, Package,
  Bell, Search, ChevronDown, Sparkles, ArrowRight, CloudRain, Cloud, Sun, Moon,
} from "lucide-react";
import landscape from "@/assets/command-landscape.jpg";
import logoAsset from "@/assets/greenarea-logo.png.asset.json";
import {
  currentPeriod, currentWeather, greeting, periodLabel, periodOverlay,
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
  id: string;
  label: string;
  kpi: string;
  Icon: React.ComponentType<{ className?: string }>;
  x: number; y: number;
  to: string;
};

const HOTSPOTS: Hotspot[] = [
  { id: "projects",  label: "Projects",  kpi: "12 Active",  Icon: Building2, x: 30, y: 40, to: "/app/projects"  },
  { id: "employees", label: "Employees", kpi: "18 Active",  Icon: Users,     x: 55, y: 58, to: "/app/employees" },
  { id: "fleet",     label: "Fleet",     kpi: "6 Vehicles", Icon: Truck,     x: 78, y: 44, to: "/app/settings"  },
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
  const weather: Weather = currentWeather(now);
  const overlay = useMemo(() => periodOverlay(period), [period]);
  const isNight = period === "night" || period === "dusk";

  function flyTo(spot: Hotspot) {
    setZooming(spot);
    setTimeout(() => navigate({ to: spot.to }), 800);
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Full-bleed landscape */}
      <div
        className={`fixed inset-0 transition-all ease-out ${zooming ? "duration-[800ms]" : "duration-[1400ms]"}`}
        style={{
          transform: zooming
            ? `scale(1.8) translate(${(50 - zooming.x) * 0.6}%, ${(50 - zooming.y) * 0.6}%)`
            : "scale(1.02)",
          filter: zooming ? "blur(8px) brightness(0.75)" : overlay.filter,
        }}
      >
        <img src={landscape} alt="Green Area landscape" className="absolute inset-0 h-full w-full object-cover" />
      </div>

      {/* Time-of-day tint + edge vignette for legibility */}
      <div className="fixed inset-0 pointer-events-none transition-opacity duration-[1500ms]"
           style={{ background: overlay.gradient }} />
      <div className="fixed inset-0 pointer-events-none mix-blend-overlay"
           style={{ background: overlay.tint }} />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-black/45 via-transparent to-black/55" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.5)_100%)]" />

      {weather === "rain" && <RainLayer />}
      {isNight && <LandscapeLightsLayer />}

      <TopBar zooming={!!zooming} now={now} weather={weather} period={period} />

      {/* Floating panels + hotspots overlay */}
      <div className={`relative z-10 min-h-screen pt-24 pb-40 px-6 lg:px-8 grid grid-cols-12 gap-6 transition-opacity duration-500 ${zooming ? "opacity-0" : "opacity-100"}`}>
        <aside className="app-dark hidden lg:flex col-span-3 flex-col gap-4">
          <FinancialCard hidden={!!zooming} />
          <RecentActivityCard hidden={!!zooming} />
        </aside>

        <section className="col-span-12 lg:col-span-6 relative flex flex-col">
          <GreetingHeader hidden={!!zooming} period={period} />
          <div className="relative flex-1 mt-6">
            {HOTSPOTS.map((s) => (
              <HotspotLabel key={s.id} spot={s} onClick={() => flyTo(s)} dark={isNight} />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.35em] text-white/70">
            <WeatherGlyph weather={weather} period={period} />
            <span>{periodLabel(period)} · every place is a room</span>
          </div>
        </section>

        <aside className="app-dark hidden lg:flex col-span-3 flex-col gap-4">
          <ProjectsOverviewCard hidden={!!zooming} />
          <AIInsightsCard hidden={!!zooming} />
        </aside>
      </div>

      <AIAssistantBar hidden={!!zooming} />
    </div>
  );
}


/* ─────────────── top bar ─────────────── */
function TopBar({ zooming, now, weather, period }: { zooming: boolean; now: Date; weather: Weather; period: Period }) {
  const dateStr = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return (
    <div className={`absolute top-0 inset-x-0 z-30 transition-opacity duration-500 ${zooming ? "opacity-0" : "opacity-100"}`}>
      <div className="px-6 lg:px-8 h-20 grid grid-cols-3 items-center">
        <div className="flex items-center gap-3">
          <img src={logoAsset.url} alt="" className="h-9 w-9" />
          <div className="leading-tight">
            <p className="font-medium tracking-[0.22em] text-sm">GREEN AREA</p>
            <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground">Operating System</p>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.38em] text-muted-foreground">
          <WeatherGlyph weather={weather} period={period} />
          <span>{dateStr} · Baghdad</span>
        </div>
        <div className="flex items-center gap-3 justify-end">
          <div className="hidden md:flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm text-muted-foreground w-72">
            <Search className="h-4 w-4 opacity-60" />
            <span className="font-light">Search projects, entries, people…</span>
          </div>
          <button className="relative rounded-full p-2 hover:bg-secondary transition" aria-label="Notifications">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-forest text-background text-[9px] grid place-items-center">3</span>
          </button>
          <Link to="/" className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-secondary transition">
            <span className="h-8 w-8 rounded-full bg-sand grid place-items-center text-forest-deep text-xs font-medium">GA</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── greeting ─────────────── */
function GreetingHeader({ hidden, period }: { hidden: boolean; period: Period }) {
  return (
    <div className={`text-center text-white transition-opacity duration-500 ${hidden ? "opacity-0" : "opacity-100"}`}>
      <h1 className="font-display text-4xl md:text-5xl leading-none drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">{periodLabel(period)}</h1>
      <p className="mt-2 text-sm text-white/75">{greeting(period)}, Ako</p>
    </div>
  );
}

/* ─────────────── hotspot ─────────────── */
function HotspotLabel({ spot, onClick, dark }: { spot: Hotspot; onClick: () => void; dark: boolean }) {
  const { Icon } = spot;
  return (
    <button
      onClick={onClick}
      className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
      aria-label={`${spot.label} — ${spot.kpi}`}
    >
      {/* pin dot */}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white/90 shadow-[0_0_0_4px_rgba(255,255,255,0.15)]" />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/25 animate-ping opacity-60" style={{ animationDuration: "3.5s" }} />
      {/* elegant label pill */}
      <div className={`relative mt-3 flex items-center gap-2 rounded-full pl-2.5 pr-3.5 py-1.5 text-white/95 transition-all duration-300 group-hover:scale-[1.06] ${dark ? "bg-black/45" : "bg-black/35"} backdrop-blur-md border border-white/15 shadow-[0_6px_20px_-6px_rgba(0,0,0,0.45)]`}>
        <span className="h-5 w-5 rounded-full bg-white/10 grid place-items-center">
          <Icon className="h-3 w-3 text-white/90" />
        </span>
        <div className="text-left leading-tight">
          <p className="text-[9px] uppercase tracking-[0.25em] text-white/70">{spot.label}</p>
          <p className="text-[11px] font-medium">{spot.kpi}</p>
        </div>
      </div>
    </button>
  );
}

/* ─────────────── weather glyph ─────────────── */
function WeatherGlyph({ weather, period }: { weather: Weather; period: Period }) {
  const cls = "h-3 w-3 opacity-80";
  if (weather === "rain") return <CloudRain className={cls} />;
  if (weather === "cloudy") return <Cloud className={cls} />;
  if (period === "night") return <Moon className={cls} />;
  return <Sun className={cls} />;
}

/* ─────────────── rain layer ─────────────── */
function RainLayer() {
  const drops = Array.from({ length: 60 }, (_, i) => i);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
      {drops.map((i) => {
        const left = (i * 53) % 100;
        const delay = (i * 137) % 2500;
        const dur = 900 + ((i * 71) % 800);
        return (
          <span
            key={i}
            className="absolute top-[-10%] w-px h-6 bg-white/60"
            style={{
              left: `${left}%`,
              animation: `rain-fall ${dur}ms linear ${delay}ms infinite`,
              transform: "rotate(12deg)",
            }}
          />
        );
      })}
      <style>{`@keyframes rain-fall { to { transform: translateY(120vh) rotate(12deg); } }`}</style>
    </div>
  );
}

/* ─────────────── night lights layer ─────────────── */
function LandscapeLightsLayer() {
  const lights = [
    { x: 30, y: 68 }, { x: 44, y: 72 }, { x: 58, y: 70 }, { x: 72, y: 74 },
    { x: 36, y: 82 }, { x: 66, y: 82 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none">
      {lights.map((l, i) => (
        <span
          key={i}
          className="absolute h-2 w-2 rounded-full bg-amber-200/90"
          style={{
            left: `${l.x}%`, top: `${l.y}%`,
            boxShadow: "0 0 12px 4px rgba(255,200,120,0.55), 0 0 30px 10px rgba(255,180,90,0.25)",
            animation: `light-flicker ${2200 + i * 250}ms ease-in-out infinite`,
          }}
        />
      ))}
      <style>{`@keyframes light-flicker { 0%,100% { opacity: 0.85 } 50% { opacity: 1 } }`}</style>
    </div>
  );
}

/* ─────────────── AI Assistant Bar ─────────────── */
function AIAssistantBar({ hidden }: { hidden: boolean }) {
  const [q, setQ] = useState("");
  const examples = ["Show fuel expenses", "Summarize today", "Missing receipts", "Project status", "Forecast cash flow"];
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[min(720px,92vw)] transition-all duration-500 ${hidden ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
      <div className="rounded-2xl bg-black/55 backdrop-blur-xl border border-white/10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)] px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-full bg-forest text-forest-deep grid place-items-center shrink-0">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/60">Ask OS</p>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ask anything about Green Area…"
              className="w-full bg-transparent outline-none text-sm placeholder:text-white/40 mt-0.5"
            />
          </div>
          <button className="rounded-full bg-forest text-forest-deep font-medium text-xs px-4 py-2 hover:brightness-110 transition shrink-0">
            Ask
          </button>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5 pl-11">
          {examples.map((e) => (
            <button
              key={e}
              onClick={() => setQ(e)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 text-white/75 hover:bg-white/20 hover:text-white transition"
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── side cards ─────────────── */
function Card({ title, children, hidden, action }: { title: string; children: React.ReactNode; hidden: boolean; action?: React.ReactNode }) {
  return (
    <div className={`rounded-2xl bg-black/45 backdrop-blur-xl border border-white/10 p-5 text-white transition-all duration-500 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)] ${hidden ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] uppercase tracking-[0.28em] text-white/60">{title}</p>
        {action && <span className="text-[10px] text-white/60">{action}</span>}
      </div>
      {children}
    </div>
  );
}

function Sparkline({ points, tone = "forest" }: { points: number[]; tone?: "forest" | "sand" | "rose" }) {
  const w = 100, h = 28;
  const max = Math.max(...points), min = Math.min(...points);
  const step = w / (points.length - 1);
  const scale = (v: number) => h - 2 - ((v - min) / Math.max(1, max - min)) * (h - 4);
  const d = points.map((v, i) => `${i === 0 ? "M" : "L"}${i * step},${scale(v)}`).join(" ");
  const stroke = tone === "forest" ? "oklch(0.38 0.06 155)" : tone === "sand" ? "oklch(0.72 0.08 80)" : "oklch(0.6 0.18 25)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-24 h-7">
      <path d={d} stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FinancialCard({ hidden }: { hidden: boolean }) {
  const rows: [string, string, string, "up" | "down", number[]][] = [
    ["Cash Balance",  "$128,450", "+12.4%", "up",   [40, 42, 48, 50, 55, 62, 68, 72, 78, 82, 88, 96]],
    ["Income",        "$62,000",  "+8.1%",  "up",   [30, 35, 32, 40, 48, 45, 55, 58, 62]],
    ["Expenses",      "$42,180",  "-5.3%",  "down", [55, 52, 48, 50, 46, 44, 42, 40, 42]],
  ];
  return (
    <Card title="Financial Overview" hidden={hidden} action={<span className="text-[10px] text-muted-foreground">This month</span>}>
      <div className="space-y-4">
        {rows.map(([k, v, delta, dir, series]) => (
          <div key={k} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{k}</p>
              <p className="mt-1 text-lg font-medium tracking-tight">{v}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                <span className={dir === "up" ? "text-forest" : "text-rose-600"}>{dir === "up" ? "▲" : "▼"} {delta}</span> vs last month
              </p>
            </div>
            <Sparkline points={series} tone={dir === "up" ? "forest" : "sand"} />
          </div>
        ))}
        <div className="border-t border-border pt-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Pending Payments</p>
            <p className="mt-1 text-lg font-medium">7 <span className="text-xs text-muted-foreground">invoices</span></p>
          </div>
          <span className="text-[10px] text-muted-foreground">$18,240</span>
        </div>
      </div>
    </Card>
  );
}

function RecentActivityCard({ hidden }: { hidden: boolean }) {
  const items: [string, string, string][] = [
    ["Payment received",   "Riverside Villa · $18,000", "2m"],
    ["Invoice issued",     "Karrada Rooftop · $6,500",  "18m"],
    ["Site visit logged",  "Erbil Courtyard",           "1h"],
    ["Receipt uploaded",   "Fuel · Workshop",           "2h"],
  ];
  return (
    <Card title="Recent Activity" hidden={hidden}>
      <ul className="space-y-3">
        {items.map(([title, sub, time]) => (
          <li key={title} className="flex items-start gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-forest shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm">{title}</p>
              <p className="text-[11px] text-muted-foreground truncate">{sub}</p>
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{time}</span>
          </li>
        ))}
      </ul>
      <button className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition">
        View all <ArrowRight className="h-3 w-3" />
      </button>
    </Card>
  );
}

function ProjectsOverviewCard({ hidden }: { hidden: boolean }) {
  const rows: [string, number, "ok" | "risk"][] = [
    ["Riverside Villa", 78, "ok"],
    ["Karrada Rooftop", 42, "risk"],
    ["Erbil Courtyard", 23, "risk"],
    ["Mountain Resort", 15, "ok"],
  ];
  return (
    <Card title="Projects Overview" hidden={hidden} action={<span className="text-[10px] text-muted-foreground">12 active</span>}>
      <ul className="space-y-3.5">
        {rows.map(([name, pct, s]) => (
          <li key={name}>
            <div className="flex items-baseline justify-between">
              <p className="text-sm">{name}</p>
              <p className="text-[11px] text-muted-foreground">{pct}%</p>
            </div>
            <div className="h-1 rounded-full bg-secondary mt-2 overflow-hidden">
              <div className={`h-full rounded-full ${s === "ok" ? "bg-forest" : "bg-amber-500/80"}`} style={{ width: `${pct}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground">Delayed</span>
        <span className="text-rose-600">2 projects</span>
      </div>
      <Link to="/app/projects" className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition">
        View all <ArrowRight className="h-3 w-3" />
      </Link>
    </Card>
  );
}

function AIInsightsCard({ hidden }: { hidden: boolean }) {
  const items = [
    "Expenses are 18% higher than last month.",
    "3 receipts are missing for fuel expenses.",
    "Projected cash next month is positive.",
  ];
  return (
    <Card title="AI Insights" hidden={hidden}>
      <ul className="space-y-3">
        {items.map((text) => (
          <li key={text} className="flex items-start gap-2">
            <Sparkles className="h-3.5 w-3.5 text-forest mt-0.5 shrink-0" />
            <p className="text-sm leading-snug">{text}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
