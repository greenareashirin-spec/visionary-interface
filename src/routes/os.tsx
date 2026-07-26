import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import landscape from "@/assets/command-landscape.jpg";
import logoAsset from "@/assets/greenarea-logo.png.asset.json";

export const Route = createFileRoute("/os")({
  component: CommandCenter,
  head: () => ({
    meta: [
      { title: "Command Center · GreenArea OS" },
      { name: "description", content: "The GreenArea Command Center — a living environment for landscape operations." },
    ],
  }),
});

type Hotspot = {
  id: string;
  name: string;
  hint: string;
  icon: string;
  kpis: [string, string][];
  // Position on the landscape as percentages
  x: number;
  y: number;
  to?: string;
};

const HOTSPOTS: Hotspot[] = [
  {
    id: "finance",
    name: "Lagoon",
    hint: "Finance",
    icon: "◇",
    kpis: [["Cash Balance", "$128,450"], ["Monthly Expenses", "$42,180"]],
    x: 46, y: 62,
    to: "/app/daily-log",
  },
  {
    id: "projects",
    name: "Bridge",
    hint: "Projects",
    icon: "▲",
    kpis: [["Active", "12"], ["Near Completion", "3"]],
    x: 60, y: 80,
    to: "/app/projects",
  },
  {
    id: "employees",
    name: "Office",
    hint: "Employees",
    icon: "◉",
    kpis: [["Staff", "18"], ["On Leave", "2"]],
    x: 14, y: 34,
    to: "/app/employees",
  },
  {
    id: "fleet",
    name: "Workshop",
    hint: "Fleet",
    icon: "◈",
    kpis: [["Vehicles", "6"], ["Maintenance Due", "1"]],
    x: 84, y: 78,
    to: "/app/settings",
  },
  {
    id: "documents",
    name: "Archive Pavilion",
    hint: "Documents",
    icon: "▤",
    kpis: [["Files", "128"], ["Missing Receipts", "7"]],
    x: 90, y: 55,
    to: "/app/dashboard",
  },
  {
    id: "ai",
    name: "Garden",
    hint: "AI Assistant",
    icon: "✻",
    kpis: [["Insights Ready", "2"], ["Alerts", "0"]],
    x: 30, y: 78,
    to: "/app/dashboard",
  },
];

function CommandCenter() {
  const navigate = useNavigate();
  const [active, setActive] = useState<string | null>(null);
  const [zooming, setZooming] = useState<Hotspot | null>(null);

  function flyTo(spot: Hotspot) {
    if (!spot.to) return;
    setZooming(spot);
    setTimeout(() => navigate({ to: spot.to! }), 900);
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Landscape — the environment IS the interface */}
      <div
        className={`absolute inset-0 transition-all ease-out ${zooming ? "duration-[900ms]" : "duration-[1500ms]"}`}
        style={{
          transform: zooming
            ? `scale(1.8) translate(${(50 - zooming.x) * 0.6}%, ${(50 - zooming.y) * 0.6}%)`
            : "scale(1.02)",
          filter: zooming ? "blur(6px) brightness(0.7)" : "none",
        }}
      >
        <img
          src={landscape}
          alt="Green Area project landscape"
          width={1920}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Soft atmospheric layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30" />
      </div>

      {/* Top bar — architectural, quiet */}
      <div className={`absolute top-0 inset-x-0 z-20 transition-opacity duration-500 ${zooming ? "opacity-0" : "opacity-100"}`}>
        <div className="px-8 lg:px-14 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoAsset.url} alt="" className="h-9 w-9" />
            <div className="leading-tight">
              <p className="font-display text-lg">Green Area</p>
              <p className="text-[9px] uppercase tracking-[0.35em] opacity-70">Command Center</p>
            </div>
          </div>
          <div className="hidden md:block text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] opacity-60">Sunday · 26 July · Baghdad</p>
            <p className="font-display text-xl mt-1">Golden hour</p>
          </div>
          <Link to="/" className="text-[10px] uppercase tracking-[0.3em] opacity-70 hover:opacity-100 transition">
            Sign out
          </Link>
        </div>
      </div>

      {/* Floating KPI panels — support, do not dominate */}
      <FloatingPanel corner="tl" hidden={!!zooming} title="Treasury" lines={[["Cash Balance", "$128,450"], ["Income (mo)", "+$62,000"], ["Expenses (mo)", "-$42,180"]]} />
      <FloatingPanel corner="tr" hidden={!!zooming} title="Projects" lines={[["Active", "12"], ["Delayed", "1"], ["Completed YTD", "9"]]} />
      <FloatingPanel corner="bl" hidden={!!zooming} title="Recent Activity" lines={[["Riverside Villa", "Payment received"], ["Karrada Rooftop", "Invoice issued"], ["Erbil Courtyard", "Site visit logged"]]} />
      <FloatingPanel corner="br" hidden={!!zooming} title="AI Insights" lines={[["Fuel spend", "▲ 12% vs last mo"], ["Missing receipts", "7 flagged"]]} />

      {/* Hotspots on the landscape */}
      <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${zooming ? "opacity-0" : "opacity-100"}`}>
        {HOTSPOTS.map((spot) => (
          <HotspotMarker
            key={spot.id}
            spot={spot}
            active={active === spot.id}
            onEnter={() => setActive(spot.id)}
            onLeave={() => setActive((v) => (v === spot.id ? null : v))}
            onClick={() => flyTo(spot)}
          />
        ))}
      </div>

      {/* Ambient water/wind hint */}
      <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center pointer-events-none">
        <p className={`text-[10px] uppercase tracking-[0.4em] opacity-50 transition-opacity duration-700 ${zooming ? "opacity-0" : "opacity-50"}`}>
          Move across the landscape · every place is a room
        </p>
      </div>
    </div>
  );
}

function HotspotMarker({
  spot, active, onEnter, onLeave, onClick,
}: {
  spot: Hotspot; active: boolean;
  onEnter: () => void; onLeave: () => void; onClick: () => void;
}) {
  return (
    <button
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onClick={onClick}
      className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
      aria-label={`${spot.hint} — ${spot.name}`}
    >
      {/* pulse rings */}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/10 animate-ping" style={{ animationDuration: "3s" }} />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white/90 shadow-[0_0_24px_6px_rgba(255,255,255,0.4)]" />

      {/* Architectural annotation */}
      <div className={`absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-300 ${active ? "opacity-100 translate-x-0" : "opacity-90 translate-x-0"}`}>
        <div className="border-l border-white/50 pl-4 py-1">
          <p className="text-[9px] uppercase tracking-[0.35em] opacity-70">{spot.hint}</p>
          <p className="font-display text-lg leading-tight">{spot.name}</p>
        </div>
      </div>

      {/* Expanded KPI card on hover */}
      <div
        className={`absolute left-8 top-full mt-3 min-w-[220px] rounded-2xl border border-white/15 bg-black/45 backdrop-blur-xl p-4 text-left transition-all duration-300 ${
          active ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg opacity-80">{spot.icon}</span>
          <span className="text-[9px] uppercase tracking-[0.3em] opacity-60">Click to open</span>
        </div>
        <div className="space-y-2">
          {spot.kpis.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4">
              <span className="text-[11px] uppercase tracking-[0.2em] opacity-60">{k}</span>
              <span className="font-display text-base">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}

function FloatingPanel({
  corner, title, lines, hidden,
}: {
  corner: "tl" | "tr" | "bl" | "br";
  title: string;
  lines: [string, string][];
  hidden: boolean;
}) {
  const pos = {
    tl: "top-24 left-8",
    tr: "top-24 right-8",
    bl: "bottom-16 left-8",
    br: "bottom-16 right-8",
  }[corner];
  return (
    <div
      className={`absolute z-10 hidden md:block ${pos} w-64 rounded-2xl border border-white/12 bg-black/30 backdrop-blur-xl p-5 transition-all duration-700 ${
        hidden ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
      }`}
    >
      <p className="text-[9px] uppercase tracking-[0.35em] opacity-60 mb-3">{title}</p>
      <div className="space-y-2.5">
        {lines.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-3">
            <span className="text-[11px] opacity-70 font-light">{k}</span>
            <span className="font-display text-sm">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
