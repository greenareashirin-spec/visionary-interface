import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
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
  name: string;
  hint: string;
  glyph: string;
  kpis: [string, string][];
  x: number; y: number;
  to: string;
};

const HOTSPOTS: Hotspot[] = [
  { id: "finance",   name: "Lagoon",          hint: "Finance",      glyph: "◇", kpis: [["Cash Balance","$128,450"],["Monthly Expenses","$42,180"]], x: 46, y: 62, to: "/app/daily-log" },
  { id: "projects",  name: "Bridge",          hint: "Projects",     glyph: "▲", kpis: [["Active","12"],["Near Completion","3"]],                    x: 60, y: 80, to: "/app/projects" },
  { id: "employees", name: "Office",          hint: "Employees",    glyph: "◉", kpis: [["Staff","18"],["On Leave","2"]],                            x: 14, y: 34, to: "/app/employees" },
  { id: "fleet",     name: "Workshop",        hint: "Fleet",        glyph: "◈", kpis: [["Vehicles","6"],["Maintenance Due","1"]],                   x: 84, y: 78, to: "/app/settings" },
  { id: "documents", name: "Archive Pavilion",hint: "Documents",    glyph: "▤", kpis: [["Files","128"],["Missing Receipts","7"]],                   x: 90, y: 55, to: "/app/dashboard" },
  { id: "ai",        name: "Garden",          hint: "AI Assistant", glyph: "✻", kpis: [["Insights Ready","2"],["Alerts","0"]],                      x: 30, y: 78, to: "/app/dashboard" },
];

type Concept = "cinematic" | "monograph" | "cartographic";
const CONCEPTS: { id: Concept; label: string; sub: string }[] = [
  { id: "cinematic",    label: "I. Cinematic",     sub: "Landscape at golden hour" },
  { id: "monograph",    label: "II. Monograph",    sub: "Editorial page, framed scene" },
  { id: "cartographic", label: "III. Cartographic", sub: "Site plan, ink annotations" },
];

function CommandCenter() {
  const navigate = useNavigate();
  const [concept, setConcept] = useState<Concept>("cinematic");
  const [active, setActive] = useState<string | null>(null);
  const [zooming, setZooming] = useState<Hotspot | null>(null);

  function flyTo(spot: Hotspot) {
    setZooming(spot);
    setTimeout(() => navigate({ to: spot.to }), 900);
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Persistent brand + concept switcher */}
      <TopBar concept={concept} onChange={setConcept} zooming={!!zooming} />

      {concept === "cinematic" && (
        <CinematicConcept active={active} setActive={setActive} zooming={zooming} onFly={flyTo} />
      )}
      {concept === "monograph" && (
        <MonographConcept active={active} setActive={setActive} zooming={zooming} onFly={flyTo} />
      )}
      {concept === "cartographic" && (
        <CartographicConcept active={active} setActive={setActive} zooming={zooming} onFly={flyTo} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Top bar with concept switcher                                       */
/* ------------------------------------------------------------------ */
function TopBar({ concept, onChange, zooming }: { concept: Concept; onChange: (c: Concept) => void; zooming: boolean }) {
  return (
    <div className={`absolute top-0 inset-x-0 z-30 transition-opacity duration-500 ${zooming ? "opacity-0" : "opacity-100"}`}>
      <div className="px-6 lg:px-14 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoAsset.url} alt="" className="h-9 w-9" />
          <div className="leading-tight">
            <p className="font-display text-lg">Green Area</p>
            <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground">Command Center</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1 rounded-full glass-card px-1.5 py-1.5">
          {CONCEPTS.map((c) => (
            <button
              key={c.id}
              onClick={() => onChange(c.id)}
              className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.28em] transition ${
                concept === c.id ? "bg-forest text-background" : "text-muted-foreground hover:text-foreground"
              }`}
              title={c.sub}
            >
              {c.label}
            </button>
          ))}
        </div>

        <Link to="/" className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition">
          Sign out
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* I. Cinematic — full-bleed landscape, hairline annotations on scene */
/* ------------------------------------------------------------------ */
function CinematicConcept({
  active, setActive, zooming, onFly,
}: {
  active: string | null; setActive: (v: string | null) => void;
  zooming: Hotspot | null; onFly: (s: Hotspot) => void;
}) {
  return (
    <>
      <div
        className={`absolute inset-0 transition-all ease-out ${zooming ? "duration-[900ms]" : "duration-[1500ms]"}`}
        style={{
          transform: zooming
            ? `scale(1.8) translate(${(50 - zooming.x) * 0.6}%, ${(50 - zooming.y) * 0.6}%)`
            : "scale(1.02)",
          filter: zooming ? "blur(6px) brightness(0.85)" : "none",
        }}
      >
        <img src={landscape} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-transparent to-background/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/35 via-transparent to-background/20" />
      </div>

      {/* Editorial marginalia */}
      <MarginPanel corner="tl" hidden={!!zooming} title="Treasury"
        lines={[["Cash Balance","$128,450"],["Income (mo)","+$62,000"],["Expenses (mo)","−$42,180"]]} />
      <MarginPanel corner="tr" hidden={!!zooming} title="Projects"
        lines={[["Active","12"],["Delayed","1"],["Completed YTD","9"]]} />
      <MarginPanel corner="bl" hidden={!!zooming} title="Recent Activity"
        lines={[["Riverside Villa","Payment received"],["Karrada Rooftop","Invoice issued"],["Erbil Courtyard","Site visit"]]} />
      <MarginPanel corner="br" hidden={!!zooming} title="AI Insights"
        lines={[["Fuel spend","▲ 12% vs last mo"],["Missing receipts","7 flagged"]]} />

      <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${zooming ? "opacity-0" : "opacity-100"}`}>
        {HOTSPOTS.map((spot) => (
          <SceneMarker key={spot.id} spot={spot}
            active={active === spot.id}
            onEnter={() => setActive(spot.id)}
            onLeave={() => setActive(active === spot.id ? null : active)}
            onClick={() => onFly(spot)} />
        ))}
      </div>

      <p className={`absolute bottom-6 inset-x-0 text-center text-[10px] uppercase tracking-[0.4em] text-muted-foreground transition-opacity duration-500 ${zooming ? "opacity-0" : "opacity-70"}`}>
        Sunday · 26 July · Baghdad — every place is a room
      </p>
    </>
  );
}

function SceneMarker({ spot, active, onEnter, onLeave, onClick }: {
  spot: Hotspot; active: boolean; onEnter: () => void; onLeave: () => void; onClick: () => void;
}) {
  return (
    <button
      onMouseEnter={onEnter} onMouseLeave={onLeave}
      onFocus={onEnter} onBlur={onLeave}
      onClick={onClick}
      className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
      aria-label={`${spot.hint} — ${spot.name}`}
    >
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-foreground/10 animate-ping" style={{ animationDuration: "3s" }} />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-background shadow-[0_0_20px_6px_rgba(255,255,255,0.35)] ring-1 ring-foreground/40" />

      <div className="absolute left-7 top-1/2 -translate-y-1/2 whitespace-nowrap">
        <div className="border-l border-foreground/50 pl-3 py-0.5">
          <p className="text-[9px] uppercase tracking-[0.35em] text-foreground/70">{spot.hint}</p>
          <p className="font-display text-lg leading-tight text-foreground">{spot.name}</p>
        </div>
      </div>

      <div className={`absolute left-7 top-full mt-3 min-w-[220px] rounded-2xl glass-card p-4 text-left transition-all duration-300 ${
        active ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg text-forest">{spot.glyph}</span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Click to open</span>
        </div>
        <div className="space-y-2">
          {spot.kpis.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{k}</span>
              <span className="font-display text-base">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}

function MarginPanel({ corner, title, lines, hidden }: {
  corner: "tl" | "tr" | "bl" | "br"; title: string; lines: [string, string][]; hidden: boolean;
}) {
  const pos = { tl: "top-24 left-8", tr: "top-24 right-8", bl: "bottom-16 left-8", br: "bottom-16 right-8" }[corner];
  return (
    <div className={`absolute z-10 hidden md:block ${pos} w-64 rounded-2xl glass-card p-5 transition-all duration-700 ${hidden ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
      <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground mb-3">{title}</p>
      <div className="space-y-2.5">
        {lines.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-3">
            <span className="text-[11px] text-muted-foreground font-light">{k}</span>
            <span className="font-display text-sm">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* II. Monograph — warm-paper editorial with framed inset landscape    */
/* ------------------------------------------------------------------ */
function MonographConcept({
  active, setActive, zooming, onFly,
}: {
  active: string | null; setActive: (v: string | null) => void;
  zooming: Hotspot | null; onFly: (s: Hotspot) => void;
}) {
  return (
    <div className="absolute inset-0 pt-24 pb-10 px-8 lg:px-16">
      <div className="grid grid-cols-12 gap-8 h-full">
        {/* Left index */}
        <aside className="hidden lg:flex col-span-3 flex-col justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground">Index — 01</p>
            <h2 className="font-display text-4xl leading-[1.05] mt-3">A landscape,<br/><em>read</em> as an office.</h2>
            <p className="text-sm text-muted-foreground mt-4 font-light leading-relaxed max-w-xs">
              Six places. Six disciplines. Wander through the plate, or turn the page.
            </p>
          </div>
          <div className="space-y-4">
            {HOTSPOTS.slice(0, 3).map((s, i) => (
              <button key={s.id} onClick={() => onFly(s)}
                onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)}
                className={`w-full text-left border-t pt-3 transition ${active === s.id ? "border-forest" : "border-border"}`}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Plate {String(i+1).padStart(2,"0")}</span>
                  <span className="text-forest">{s.glyph}</span>
                </div>
                <p className="font-display text-xl mt-1">{s.name}</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{s.hint}</p>
              </button>
            ))}
          </div>
        </aside>

        {/* Framed plate */}
        <div className="col-span-12 lg:col-span-6 relative">
          <div className="text-center mb-3">
            <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground">Plate I · Sunday, 26 July</p>
            <p className="font-display text-lg italic mt-1">Aerial view, golden hour</p>
          </div>
          <div className="relative rounded-sm overflow-hidden border border-border bg-card shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]" style={{ height: "calc(100% - 80px)" }}>
            <div className={`absolute inset-0 transition-all ease-out ${zooming ? "duration-[900ms] scale-[1.6]" : "duration-[1200ms]"}`}
              style={zooming ? { transform: `scale(1.6) translate(${(50 - zooming.x) * 0.5}%, ${(50 - zooming.y) * 0.5}%)`, filter: "blur(4px)" } : {}}>
              <img src={landscape} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/25 to-transparent" />
            </div>

            <div className={`absolute inset-0 transition-opacity ${zooming ? "opacity-0" : "opacity-100"}`}>
              {HOTSPOTS.map((s) => (
                <button key={s.id}
                  onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)}
                  onClick={() => onFly(s)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}>
                  <span className="block h-2.5 w-2.5 rounded-full bg-background ring-1 ring-forest shadow" />
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.3em] px-2 py-1 rounded-sm bg-card/90 border border-border transition ${active === s.id ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
                    {s.name}
                  </span>
                </button>
              ))}
            </div>

            <p className="absolute bottom-3 right-4 text-[9px] uppercase tracking-[0.35em] text-background/80 mix-blend-difference">Fig. 01 — Baghdad Estate</p>
          </div>
        </div>

        {/* Right column KPIs */}
        <aside className="hidden lg:flex col-span-3 flex-col gap-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground">Overview</p>
            <div className="mt-3 space-y-4">
              {[["Treasury","$128,450"],["Active projects","12"],["Team on site","16 / 18"],["Insights ready","2"]].map(([k,v]) => (
                <div key={k} className="border-b border-border pb-3">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{k}</p>
                  <p className="font-display text-2xl mt-1">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto space-y-4">
            {HOTSPOTS.slice(3).map((s, i) => (
              <button key={s.id} onClick={() => onFly(s)}
                onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)}
                className={`w-full text-left border-t pt-3 transition ${active === s.id ? "border-forest" : "border-border"}`}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Plate {String(i+4).padStart(2,"0")}</span>
                  <span className="text-forest">{s.glyph}</span>
                </div>
                <p className="font-display text-xl mt-1">{s.name}</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{s.hint}</p>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* III. Cartographic — illustrated site plan, ink annotations, legend  */
/* ------------------------------------------------------------------ */
function CartographicConcept({
  active, setActive, zooming, onFly,
}: {
  active: string | null; setActive: (v: string | null) => void;
  zooming: Hotspot | null; onFly: (s: Hotspot) => void;
}) {
  return (
    <div className="absolute inset-0 pt-24 pb-6 px-6 lg:px-14">
      <div className="grid grid-rows-[1fr_auto] h-full gap-6">
        {/* The plan */}
        <div className="relative rounded-3xl overflow-hidden bg-[color-mix(in_oklab,var(--sand)_60%,var(--background))] border border-border">
          <SitePlanSvg />
          {/* Hotspots on the plan */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${zooming ? "opacity-0" : "opacity-100"}`}>
            {HOTSPOTS.map((s) => (
              <button key={s.id}
                onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)}
                onClick={() => onFly(s)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                aria-label={`${s.hint} — ${s.name}`}>
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-forest/40 group-hover:scale-110 transition" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-forest" />
                <div className={`absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap transition ${active === s.id ? "opacity-100" : "opacity-80"}`}>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{s.hint}</p>
                  <p className="font-display text-base italic leading-tight">{s.name}</p>
                </div>
              </button>
            ))}
          </div>
          {/* Zoom overlay effect */}
          {zooming && (
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity duration-500" />
          )}
          {/* Compass */}
          <div className="absolute top-6 right-6 h-14 w-14 rounded-full border border-forest/40 grid place-items-center">
            <div className="relative h-10 w-10">
              <span className="absolute left-1/2 top-0 -translate-x-1/2 text-[9px] font-display">N</span>
              <span className="absolute left-1/2 bottom-0 -translate-x-1/2 text-[9px] text-muted-foreground">S</span>
              <span className="absolute top-1/2 left-0 -translate-y-1/2 text-[9px] text-muted-foreground">W</span>
              <span className="absolute top-1/2 right-0 -translate-y-1/2 text-[9px] text-muted-foreground">E</span>
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-px bg-forest" />
            </div>
          </div>
          {/* Scale bar */}
          <div className="absolute bottom-6 left-6 text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-px w-16 bg-forest/60 block" />
              <span>25 m</span>
            </div>
            <p className="mt-2 font-display italic text-sm normal-case tracking-normal text-foreground">Baghdad Estate — Site Plan, Sheet 01</p>
          </div>
        </div>

        {/* Legend rail */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {HOTSPOTS.map((s, i) => (
            <button key={s.id} onClick={() => onFly(s)}
              onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)}
              className={`text-left rounded-xl border p-4 transition ${active === s.id ? "border-forest bg-secondary" : "border-border hover:border-forest/40"}`}>
              <div className="flex items-baseline justify-between">
                <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">№ {String(i+1).padStart(2,"0")}</span>
                <span className="text-forest">{s.glyph}</span>
              </div>
              <p className="font-display text-lg mt-2 leading-tight">{s.name}</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{s.hint}</p>
              <div className="mt-3 space-y-1">
                {s.kpis.map(([k,v]) => (
                  <div key={k} className="flex items-baseline justify-between">
                    <span className="text-[10px] text-muted-foreground">{k}</span>
                    <span className="font-display text-sm">{v}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SitePlanSvg() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      {/* soft field */}
      <defs>
        <pattern id="grove" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.35" fill="var(--forest)" opacity="0.18" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#grove)" />
      {/* river */}
      <path d="M -5 55 C 20 45, 40 70, 65 60 S 105 55, 110 65" stroke="var(--water)" strokeWidth="6" fill="none" opacity="0.55" strokeLinecap="round" />
      <path d="M -5 55 C 20 45, 40 70, 65 60 S 105 55, 110 65" stroke="var(--water)" strokeWidth="0.4" fill="none" opacity="0.8" strokeDasharray="0.6 1.2" />
      {/* paths */}
      <path d="M 10 20 C 30 35, 55 30, 80 40 S 95 70, 60 82" stroke="var(--forest)" strokeWidth="0.4" fill="none" strokeDasharray="1.2 1.6" opacity="0.6" />
      <path d="M 14 34 L 30 78" stroke="var(--forest)" strokeWidth="0.3" fill="none" strokeDasharray="0.8 1.2" opacity="0.5" />
      {/* buildings */}
      <rect x="11" y="30" width="7" height="7" fill="var(--forest)" opacity="0.85" />
      <rect x="82" y="74" width="6" height="7" fill="var(--forest)" opacity="0.75" />
      <rect x="88" y="52" width="5" height="6" fill="var(--forest)" opacity="0.7" />
      {/* garden circles */}
      <circle cx="30" cy="78" r="4" fill="none" stroke="var(--forest)" strokeWidth="0.3" opacity="0.6" />
      <circle cx="30" cy="78" r="2" fill="none" stroke="var(--forest)" strokeWidth="0.3" opacity="0.5" />
      {/* lagoon */}
      <ellipse cx="46" cy="62" rx="7" ry="4.5" fill="var(--water)" opacity="0.35" />
      <ellipse cx="46" cy="62" rx="7" ry="4.5" fill="none" stroke="var(--water)" strokeWidth="0.4" opacity="0.8" />
      {/* bridge */}
      <line x1="55" y1="76" x2="65" y2="84" stroke="var(--forest)" strokeWidth="0.6" opacity="0.8" />
      <line x1="55" y1="78" x2="65" y2="86" stroke="var(--forest)" strokeWidth="0.4" opacity="0.6" />
    </svg>
  );
}
