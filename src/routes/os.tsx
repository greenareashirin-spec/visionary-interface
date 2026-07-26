import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Wallet, Building2, Users, Truck, FolderOpen, Sparkles, Settings as SettingsIcon,
  Bell, Search, ChevronDown, Calendar, ArrowRight,
} from "lucide-react";
import landscape from "@/assets/command-landscape.jpg";
import logoAsset from "@/assets/greenarea-logo.png.asset.json";

export const Route = createFileRoute("/os")({
  component: CommandCenter,
  head: () => ({
    meta: [
      { title: "Command Center · GreenArea OS" },
      { name: "description", content: "GreenArea Command Center — a living landscape as your navigation." },
    ],
  }),
});

type Hotspot = {
  id: string;
  hint: string;   // small caps label
  value: string;  // secondary line
  Icon: React.ComponentType<{ className?: string }>;
  x: number; y: number;
  to: string;
};

const HOTSPOTS: Hotspot[] = [
  { id: "employees", hint: "Employees",   value: "18 Active",     Icon: Users,       x: 52, y: 30, to: "/app/employees" },
  { id: "projects",  hint: "Projects",    value: "12 Active",     Icon: Building2,   x: 33, y: 46, to: "/app/projects" },
  { id: "finance",   hint: "Finance",     value: "$128,450",      Icon: Wallet,      x: 50, y: 58, to: "/app/daily-log" },
  { id: "documents", hint: "Documents",   value: "128 Files",     Icon: FolderOpen,  x: 68, y: 58, to: "/app/dashboard" },
  { id: "ai",        hint: "AI Assistant",value: "2 Insights",    Icon: Sparkles,    x: 34, y: 74, to: "/app/dashboard" },
  { id: "settings",  hint: "Settings",    value: "System",        Icon: SettingsIcon,x: 70, y: 76, to: "/app/settings" },
  { id: "fleet",     hint: "Fleet",       value: "6 Vehicles",    Icon: Truck,       x: 52, y: 88, to: "/app/settings" },
];

function CommandCenter() {
  const navigate = useNavigate();
  const [zooming, setZooming] = useState<Hotspot | null>(null);

  function flyTo(spot: Hotspot) {
    setZooming(spot);
    setTimeout(() => navigate({ to: spot.to }), 850);
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      <TopBar zooming={!!zooming} />

      <div className="pt-24 pb-8 px-6 lg:px-10 min-h-screen grid grid-cols-12 gap-6">
        {/* Left rail — Financial Overview + Recent Activity */}
        <aside className="hidden lg:flex col-span-3 xl:col-span-2 flex-col gap-5">
          <FinancialCard hidden={!!zooming} />
          <RecentActivityCard hidden={!!zooming} />
        </aside>

        {/* Center — the landscape scene */}
        <section className="col-span-12 lg:col-span-6 xl:col-span-8 relative">
          <GreetingHeader hidden={!!zooming} />
          <div className="relative mt-4 rounded-3xl overflow-hidden border border-border shadow-[0_40px_100px_-50px_rgba(35,75,58,0.35)] aspect-[16/11]">
            <div
              className={`absolute inset-0 transition-all ease-out ${zooming ? "duration-[850ms]" : "duration-[1500ms]"}`}
              style={{
                transform: zooming
                  ? `scale(1.7) translate(${(50 - zooming.x) * 0.55}%, ${(50 - zooming.y) * 0.55}%)`
                  : "scale(1.02)",
                filter: zooming ? "blur(6px) brightness(0.9)" : "none",
              }}
            >
              <img src={landscape} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/30" />
            </div>

            {/* Connector lines between hotspots (very subtle) */}
            <svg className={`absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-500 ${zooming ? "opacity-0" : "opacity-40"}`} viewBox="0 0 100 100" preserveAspectRatio="none">
              {[
                ["employees","finance"],["projects","finance"],["finance","documents"],
                ["finance","ai"],["finance","fleet"],["documents","settings"],["ai","fleet"],
              ].map(([a,b]) => {
                const A = HOTSPOTS.find(h=>h.id===a)!, B = HOTSPOTS.find(h=>h.id===b)!;
                return <line key={`${a}-${b}`} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="white" strokeWidth="0.15" strokeDasharray="0.6 0.8" />;
              })}
            </svg>

            {/* Hotspots */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${zooming ? "opacity-0" : "opacity-100"}`}>
              {HOTSPOTS.map((s) => <HotspotPill key={s.id} spot={s} onClick={() => flyTo(s)} />)}
            </div>

            {/* Bottom caption */}
            <div className={`absolute bottom-4 inset-x-0 flex items-center justify-between px-6 text-white/85 transition-opacity duration-500 ${zooming ? "opacity-0" : "opacity-100"}`}>
              <p className="text-[10px] uppercase tracking-[0.35em]">Move across the landscape · every place is a room</p>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em]">
                <span>Data Engine v9.2</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right rail — Projects Overview + AI Insights */}
        <aside className="hidden lg:flex col-span-3 xl:col-span-2 flex-col gap-5">
          <ProjectsOverviewCard hidden={!!zooming} />
          <AIInsightsCard hidden={!!zooming} />
        </aside>
      </div>
    </div>
  );
}

/* ---------------- top bar ---------------- */
function TopBar({ zooming }: { zooming: boolean }) {
  return (
    <div className={`absolute top-0 inset-x-0 z-30 transition-opacity duration-500 ${zooming ? "opacity-0" : "opacity-100"}`}>
      <div className="px-6 lg:px-10 h-20 grid grid-cols-3 items-center">
        <div className="flex items-center gap-3">
          <img src={logoAsset.url} alt="" className="h-9 w-9" />
          <div className="leading-tight">
            <p className="font-medium tracking-[0.22em] text-sm">GREEN AREA</p>
            <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground">Operating System</p>
          </div>
        </div>
        <div className="hidden md:block text-center text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          Sunday, 26 July 2026 · Baghdad
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

/* ---------------- greeting ---------------- */
function GreetingHeader({ hidden }: { hidden: boolean }) {
  return (
    <div className={`text-center transition-opacity duration-500 ${hidden ? "opacity-0" : "opacity-100"}`}>
      <h1 className="font-display text-4xl md:text-5xl leading-none">Golden hour</h1>
      <p className="mt-2 text-muted-foreground">Good evening, Ako</p>
    </div>
  );
}

/* ---------------- hotspot pill ---------------- */
function HotspotPill({ spot, onClick }: { spot: Hotspot; onClick: () => void }) {
  const { Icon } = spot;
  return (
    <button
      onClick={onClick}
      className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
      aria-label={`${spot.hint} — ${spot.value}`}
    >
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-white/20 animate-ping" style={{ animationDuration: "3.2s" }} />
      <div className="relative flex items-center gap-2.5 rounded-full bg-forest-deep/80 backdrop-blur-md border border-white/15 pl-3 pr-4 py-2 text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] transition-all duration-300 group-hover:bg-forest-deep group-hover:scale-[1.04] group-hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)]">
        <span className="h-7 w-7 rounded-full bg-white/10 grid place-items-center">
          <Icon className="h-3.5 w-3.5 text-white/90" />
        </span>
        <div className="text-left leading-tight">
          <p className="text-[9px] uppercase tracking-[0.28em] text-white/70">{spot.hint}</p>
          <p className="text-[13px] font-medium">{spot.value}</p>
        </div>
      </div>
    </button>
  );
}

/* ---------------- side cards ---------------- */
function Card({ title, children, hidden }: { title: string; children: React.ReactNode; hidden: boolean }) {
  return (
    <div className={`rounded-2xl bg-card border border-border p-5 transition-all duration-500 ${hidden ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{title}</p>
        <button className="text-muted-foreground hover:text-foreground text-lg leading-none">···</button>
      </div>
      {children}
    </div>
  );
}

function FinancialCard({ hidden }: { hidden: boolean }) {
  const rows: [string, string, string, "up" | "down"][] = [
    ["Cash Balance", "$128,450", "12.4%", "up"],
    ["Income (mo)",  "$62,000",  "8.1%",  "up"],
    ["Expenses (mo)","$42,180",  "5.3%",  "down"],
  ];
  return (
    <Card title="Financial Overview" hidden={hidden}>
      <div className="space-y-4">
        {rows.map(([k, v, delta, dir]) => (
          <div key={k}>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{k}</p>
            <div className="flex items-baseline justify-between mt-1">
              <p className="font-display text-2xl">{v} <span className="text-xs text-muted-foreground align-top">USD</span></p>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              vs last month
              <span className={dir === "up" ? "text-emerald-600" : "text-rose-600"}>▲ {delta}</span>
            </p>
          </div>
        ))}
        <div className="border-t border-border pt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Pending Payments</p>
              <p className="font-display text-2xl mt-1">7</p>
            </div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function RecentActivityCard({ hidden }: { hidden: boolean }) {
  const items: [string, string, string, string][] = [
    ["●", "Payment received", "Riverside Villa",  "2m ago"],
    ["●", "Invoice issued",   "Karrada Rooftop",  "18m ago"],
    ["●", "Site visit logged","Erbil Courtyard",  "1h ago"],
    ["●", "Fuel purchase",    "Workshop",         "2h ago"],
  ];
  return (
    <Card title="Recent Activity" hidden={hidden}>
      <ul className="space-y-3">
        {items.map(([dot, title, sub, time]) => (
          <li key={title} className="flex items-start gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-forest shrink-0" aria-hidden>{null}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm">{title}</p>
              <p className="text-[11px] text-muted-foreground">{sub}</p>
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{time}</span>
          </li>
        ))}
      </ul>
      <button className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition">
        View all activity <ArrowRight className="h-3 w-3" />
      </button>
    </Card>
  );
}

function ProjectsOverviewCard({ hidden }: { hidden: boolean }) {
  const rows: [string, number][] = [
    ["Riverside Villa", 78],
    ["Karrada Rooftop", 42],
    ["Erbil Courtyard", 23],
    ["Mountain Resort", 15],
  ];
  return (
    <Card title="Projects Overview" hidden={hidden}>
      <ul className="space-y-4">
        {rows.map(([name, pct]) => (
          <li key={name}>
            <div className="flex items-baseline justify-between">
              <p className="text-sm">{name}</p>
              <p className="text-[11px] text-muted-foreground">{pct}%</p>
            </div>
            <div className="h-1 rounded-full bg-secondary mt-2 overflow-hidden">
              <div className="h-full bg-forest rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <Link to="/app/projects" className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition">
        View all projects <ArrowRight className="h-3 w-3" />
      </Link>
    </Card>
  );
}

function AIInsightsCard({ hidden }: { hidden: boolean }) {
  const items: [string, string][] = [
    ["Expenses are 18% higher than last month.", "View insight"],
    ["3 receipts are missing for fuel expenses.", "Review now"],
    ["Projected cash balance for next month is positive.", "See forecast"],
  ];
  return (
    <Card title="AI Insights" hidden={hidden}>
      <ul className="space-y-4">
        {items.map(([text, cta]) => (
          <li key={text}>
            <div className="flex items-start gap-2">
              <Sparkles className="h-3.5 w-3.5 text-forest mt-0.5 shrink-0" />
              <p className="text-sm leading-snug">{text}</p>
            </div>
            <button className="mt-2 ml-5 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition">
              {cta} <ArrowRight className="h-3 w-3" />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
