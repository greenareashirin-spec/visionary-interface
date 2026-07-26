import { createFileRoute } from "@tanstack/react-router";
import { Building2, CheckCircle2, AlertTriangle, Wallet, Search, Filter, Plus, MoreHorizontal } from "lucide-react";
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
  return (
    <div className="flex flex-col h-full min-h-0 px-5 lg:px-6 py-4 gap-3.5">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/55">Portfolio</p>
          <h1 className="mt-1 font-display text-[26px] leading-none">Projects Overview</h1>
          <p className="mt-1 text-[12px] text-white/60">Track all projects, budgets and progress.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs hover:bg-white/10 transition">Export</button>
          <button className="rounded-full bg-forest text-forest-deep px-4 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:brightness-110 transition">
            <Plus className="h-3.5 w-3.5" /> New Project
          </button>
        </div>
      </header>

      <section className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white/[0.04] border border-white/10 p-3">
            <p className="text-[9px] uppercase tracking-[0.22em] text-white/55">{s.label}</p>
            <p className="mt-1 text-xl font-medium tracking-tight">{s.value}</p>
            <p className={`text-[10.5px] mt-0.5 ${s.tone === "amber" ? "text-amber-300" : s.tone === "rose" ? "text-rose-300" : s.tone === "forest" ? "text-forest" : "text-white/55"}`}>{s.sub}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl bg-white/[0.04] border border-white/10 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 flex-wrap">
          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 flex-1 min-w-[200px] max-w-md">
            <Search className="h-3.5 w-3.5 text-white/55" />
            <input placeholder="Search projects…" className="bg-transparent text-xs outline-none flex-1 placeholder:text-white/45" />
          </div>
          <Select label="All Status" />
          <Select label="All Managers" />
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition">
            <Filter className="h-3 w-3" /> More Filters
          </button>
        </div>
        <div className="flex gap-5 px-4 pt-2.5 text-xs border-b border-white/10">
          {["All Projects", "On Track", "At Risk", "Delayed", "Completed"].map((t, i) => (
            <button key={t} className={`pb-2 border-b-2 transition ${i === 0 ? "border-forest text-white" : "border-transparent text-white/55 hover:text-white"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex-1 min-h-0 overflow-auto">
          <table className="w-full text-[12px]">
            <thead className="sticky top-0 bg-[oklch(0.22_0.02_165)]/95 backdrop-blur">
              <tr className="text-left text-[9px] uppercase tracking-[0.22em] text-white/55">
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
                <tr key={p.code} className="border-t border-white/5 hover:bg-white/[0.03] transition">
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
        <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/55">
          <span>Showing 1 to 4 of 12 projects</span>
          <span>Rows per page: 10</span>
        </div>
      </section>
    </div>
  );
}

function Select({ label }: { label: string }) {
  return (
    <button className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center gap-1.5">
      {label} <span className="text-white/50 text-[10px]">▾</span>
    </button>
  );
}
