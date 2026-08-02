import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, CheckCircle2, AlertTriangle, Wallet, Plus, MoreHorizontal, PieChart, X } from "lucide-react";
import riverside from "@/assets/proj-riverside.jpg";
import karrada from "@/assets/proj-karrada.jpg";
import erbil from "@/assets/proj-erbil.jpg";
import mountain from "@/assets/proj-mountain.jpg";

export const Route = createFileRoute("/app/projects")({
  component: Projects,
  head: () => ({ meta: [{ title: "Projects · GreenArea OS" }] }),
});

const stats = [
  { label: "Total Projects", value: "12", sub: "Active", Icon: Building2 },
  { label: "On Track",       value: "7",  sub: "58%",    Icon: CheckCircle2,  tone: "forest" as const },
  { label: "At Risk",        value: "3",  sub: "25%",    Icon: AlertTriangle, tone: "amber"  as const },
  { label: "Delayed",        value: "2",  sub: "17%",    Icon: AlertTriangle, tone: "rose"   as const },
  { label: "Completed",      value: "9",  sub: "This year", Icon: CheckCircle2 },
  { label: "Total Budget",   value: "$2.48M", sub: "All projects", Icon: Wallet },
];

const projects = [
  { code: "GA-014", name: "Riverside Villa",  img: riverside, location: "Baghdad", manager: "S. Kareem", pct: 78, budget: "$620,000",   spent: "$483,600", remaining: "$136,400",  status: "On Track" },
  { code: "GA-011", name: "Karrada Rooftop",  img: karrada,   location: "Baghdad", manager: "L. Yousef", pct: 42, budget: "$320,000",   spent: "$134,400", remaining: "$185,600",  status: "At Risk"  },
  { code: "GA-009", name: "Erbil Courtyard",  img: erbil,     location: "Erbil",   manager: "R. Hussein",pct: 23, budget: "$280,000",   spent: "$64,400",  remaining: "$215,600",  status: "At Risk"  },
  { code: "GA-021", name: "Mountain Resort",  img: mountain,  location: "Duhok",   manager: "S. Kareem", pct: 15, budget: "$1,260,000", spent: "$189,000", remaining: "$1,071,000", status: "Delayed" },
];

const statusTone: Record<string, string> = {
  "On Track":  "bg-forest/15 text-forest",
  "At Risk":   "bg-amber-500/15 text-amber-300",
  "Delayed":   "bg-rose-500/15 text-rose-300",
  "Completed": "bg-water/20 text-water",
};

function Projects() {
  const [chartOpen, setChartOpen] = useState(false);
  return (
    <div className="flex flex-col h-full min-h-0 px-5 lg:px-6 py-4 gap-3.5 overflow-x-hidden">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/55">Portfolio</p>
          <h1 className="mt-1 font-display text-[26px] leading-none">Projects Overview</h1>
          <p className="mt-1 text-[12px] text-white/60">Track all projects, budgets and progress.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setChartOpen(true)}
            className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs hover:bg-white/15 transition flex items-center gap-1.5"
          >
            <PieChart className="h-3.5 w-3.5" /> See Chart
          </button>
          <button className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs hover:bg-white/15 transition">Export</button>
          <button className="rounded-full bg-forest text-forest-deep px-4 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:brightness-110 transition">
            <Plus className="h-3.5 w-3.5" /> New Project
          </button>
        </div>
      </header>
      {chartOpen && <SpendChartModal onClose={() => setChartOpen(false)} />}

      <section className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2.5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-black/32 backdrop-blur-xl border border-white/10 p-2 md:p-3">
            <p className="text-[9px] uppercase tracking-[0.12em] md:tracking-[0.22em] text-white/55">{s.label}</p>
            <p className="mt-1 text-[13px] md:text-[15px] lg:text-lg xl:text-xl font-medium tracking-tight">{s.value}</p>
            <p className={`text-[10.5px] mt-0.5 ${s.tone === "amber" ? "text-amber-300" : s.tone === "rose" ? "text-rose-300" : s.tone === "forest" ? "text-forest" : "text-white/55"}`}>{s.sub}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl bg-black/32 backdrop-blur-xl border border-white/10 flex-1 min-h-0 flex flex-col overflow-hidden overflow-x-hidden">
        <div className="flex gap-5 px-4 pt-2.5 text-xs border-b border-white/10">
          {["All Projects", "On Track", "At Risk", "Delayed", "Completed"].map((t, i) => (
            <button key={t} className={`pb-2 border-b-2 transition ${i === 0 ? "border-forest text-white" : "border-transparent text-white/55 hover:text-white"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="hidden md:block flex-1 min-h-0 overflow-auto">
          <table className="w-full text-[12px]">
            <thead className="sticky top-0 bg-[oklch(0.22_0.02_165)]/95 backdrop-blur">
              <tr className="text-left text-[9px] uppercase tracking-[0.12em] md:tracking-[0.22em] text-white/55">
                <th className="py-2.5 px-4 font-normal">Project</th>
                <th className="py-2.5 px-3 font-normal">Location</th>
                <th className="py-2.5 px-3 font-normal">Manager</th>
                <th className="py-2.5 px-3 font-normal w-48">Progress</th>
                <th className="py-2.5 px-3 font-normal text-right">Budget</th>
                <th className="py-2.5 px-3 font-normal text-right">Spent</th>
                <th className="py-2.5 px-3 font-normal text-right">Remaining</th>
                <th className="py-2.5 px-3 font-normal">Status</th>
                <th className="py-2.5 px-4 font-normal text-right"> </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.code} className="border-t border-white/5 hover:bg-black/30 transition">
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img src={p.img} alt="" width={48} height={32} loading="lazy" className="h-8 w-12 rounded-md object-cover" />
                      <div className="leading-tight">
                        <p className="font-medium">{p.name}</p>
                        <p className="text-[10.5px] text-white/50">{p.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-white/60">{p.location}</td>
                  <td className="py-2.5 px-3">{p.manager}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden min-w-[80px]">
                        <div className={`h-full rounded-full ${p.status === "Delayed" ? "bg-rose-400" : p.status === "At Risk" ? "bg-amber-400" : "bg-forest"}`} style={{ width: `${p.pct}%` }} />
                      </div>
                      <span className="text-[11px] text-white/55 w-8 text-right">{p.pct}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium">{p.budget}</td>
                  <td className="py-2.5 px-3 text-right text-white/60">{p.spent}</td>
                  <td className="py-2.5 px-3 text-right text-white/60">{p.remaining}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full ${statusTone[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button className="text-white/50 hover:text-white"><MoreHorizontal className="h-3.5 w-3.5 inline" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden flex-1 min-h-0 overflow-y-auto overflow-x-hidden divide-y divide-white/10">
          {projects.map((p) => (
            <ProjectCard key={p.code} p={p} />
          ))}
        </div>
        <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/55">
          <span>Showing 1 to 4 of 12 projects</span>
          <span>Rows per page: 10</span>
        </div>
      </section>
    </div>
  );
}

function ProjectCard({ p }: { p: typeof projects[0] }) {
  const barColor = p.status === "Delayed" ? "bg-rose-400" : p.status === "At Risk" ? "bg-amber-400" : "bg-forest";
  return (
    <div className="py-3 px-2.5">
      {/* Line 1: name + code, status + menu */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0 flex items-baseline gap-1">
          <p className="text-sm font-medium leading-tight truncate min-w-0">{p.name}</p>
          <span className="text-[11px] font-normal text-white/45 shrink-0">· {p.code}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`text-[8px] uppercase tracking-wider px-1 py-0.5 rounded-full ${statusTone[p.status]}`}>
            {p.status}
          </span>
          <button className="text-white/45 hover:text-white -mr-1">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Line 2: progress bar + % */}
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden min-w-0">
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${p.pct}%` }} />
        </div>
        <span className="text-[11px] text-white/60 w-8 text-right shrink-0">{p.pct}%</span>
      </div>

      {/* Line 3: Budget · Spent · Remaining */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
        <span className="text-white/80"><span className="text-white/45 text-[11px]">Budget</span> {p.budget}</span>
        <span className="text-white/45 text-[10px]">·</span>
        <span className="text-white/80"><span className="text-white/45 text-[11px]">Spent</span> {p.spent}</span>
        <span className="text-white/45 text-[10px]">·</span>
        <span className="text-white/80"><span className="text-white/45 text-[11px]">Remaining</span> {p.remaining}</span>
      </div>

      {/* Line 4: Manager · Location */}
      <p className="mt-1.5 text-[11px] text-white/40 truncate">{p.manager} · {p.location}</p>
    </div>
  );
}


/* ─────────────── Spend chart (solid "cake bites") ─────────────── */
function SpendChartModal({ onClose }: { onClose: () => void }) {
  const parseAmt = (s: string) => Number(s.replace(/[^0-9.]/g, ""));
  const slices = projects.map((p) => ({ name: p.name, code: p.code, value: parseAmt(p.spent) }));
  const total = slices.reduce((s, x) => s + x.value, 0);
  const palette = ["#7CB342", "#F59E0B", "#F43F5E", "#38BDF8", "#A78BFA", "#F97316"];

  const R = 120;
  const cx = 160;
  const cy = 160;
  let angle = -Math.PI / 2;

  const arcs = slices.map((s, i) => {
    const frac = s.value / total;
    const sweep = frac * Math.PI * 2;
    const start = angle;
    const end = start + sweep;
    const large = sweep > Math.PI ? 1 : 0;
    const mid = (start + end) / 2;
    const x1 = cx + R * Math.cos(start);
    const y1 = cy + R * Math.sin(start);
    const x2 = cx + R * Math.cos(end);
    const y2 = cy + R * Math.sin(end);
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`;
    const lr = R + 22;
    const lx = cx + lr * Math.cos(mid);
    const ly = cy + lr * Math.sin(mid);
    const anchor = Math.cos(mid) > 0.1 ? "start" : Math.cos(mid) < -0.1 ? "end" : "middle";
    angle = end;
    return { d, color: palette[i % palette.length], name: s.name, code: s.code, value: s.value, frac, lx, ly, anchor };
  });

  const fmt = (n: number) => "$" + n.toLocaleString();

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-3xl bg-[oklch(0.20_0.02_165)] border border-white/10 p-6"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white">
          <X className="h-4 w-4" />
        </button>
        <div className="mb-4">
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/55">Portfolio</p>
          <h2 className="mt-1 font-display text-[22px] leading-none">Spend by Project</h2>
          <p className="mt-1 text-[12px] text-white/60">Total spent · {fmt(total)}</p>
        </div>

        <div className="grid md:grid-cols-[320px_1fr] gap-6 items-center">
          <svg viewBox="0 0 320 320" className="w-full h-auto max-w-[320px] mx-auto">
            {arcs.map((a, i) => (
              <path key={i} d={a.d} fill={a.color} stroke="oklch(0.20 0.02 165)" strokeWidth="2" />
            ))}
            {arcs.map((a, i) => (
              <text
                key={`t-${i}`}
                x={a.lx}
                y={a.ly}
                textAnchor={a.anchor as "start" | "end" | "middle"}
                dominantBaseline="middle"
                fontSize="9"
                fill="rgba(255,255,255,0.7)"
                style={{ letterSpacing: "0.14em", textTransform: "uppercase" }}
              >
                {Math.round(a.frac * 100)}%
              </text>
            ))}
          </svg>

          <ul className="space-y-2">
            {arcs.map((a, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl bg-black/30 border border-white/10 px-3 py-2">
                <span className="h-3 w-3 rounded-sm shrink-0" style={{ background: a.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] truncate">{a.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.12em] md:tracking-[0.22em] text-white/50">{a.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-medium">{fmt(a.value)}</p>
                  <p className="text-[10px] text-white/50">{(a.frac * 100).toFixed(1)}%</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
