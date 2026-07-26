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
  { label: "On Track",       value: "7",  sub: "58%",    Icon: CheckCircle2, tone: "forest" as const },
  { label: "At Risk",        value: "3",  sub: "25%",    Icon: AlertTriangle, tone: "amber" as const },
  { label: "Delayed",        value: "2",  sub: "17%",    Icon: AlertTriangle, tone: "rose" as const },
  { label: "Completed",      value: "9",  sub: "This year", Icon: CheckCircle2 },
  { label: "Total Budget",   value: "$2.48M", sub: "All projects", Icon: Wallet },
];

const projects = [
  { code: "GA-014", name: "Riverside Villa",  img: riverside, location: "Baghdad",  manager: "S. Kareem", pct: 78, budget: "$620,000", spent: "$483,600", remaining: "$136,400", status: "On Track" },
  { code: "GA-011", name: "Karrada Rooftop",  img: karrada,   location: "Baghdad",  manager: "L. Yousef", pct: 42, budget: "$320,000", spent: "$134,400", remaining: "$185,600", status: "At Risk"  },
  { code: "GA-009", name: "Erbil Courtyard",  img: erbil,     location: "Erbil",    manager: "R. Hussein",pct: 23, budget: "$280,000", spent: "$64,400",  remaining: "$215,600", status: "At Risk"  },
  { code: "GA-021", name: "Mountain Resort",  img: mountain,  location: "Duhok",    manager: "S. Kareem", pct: 15, budget: "$1,260,000", spent: "$189,000", remaining: "$1,071,000", status: "Delayed" },
];

const statusTone: Record<string, string> = {
  "On Track": "bg-forest/10 text-forest",
  "At Risk":  "bg-amber-500/15 text-amber-700",
  "Delayed":  "bg-rose-500/15 text-rose-600",
  "Completed":"bg-water/20 text-forest-deep",
};

function Projects() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Portfolio</p>
          <h1 className="mt-2 font-display text-4xl leading-none">Projects Overview</h1>
          <p className="mt-2 text-sm text-muted-foreground">Track all projects, budgets and progress.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full bg-secondary px-4 py-2 text-sm hover:bg-accent transition">Export</button>
          <button className="rounded-full bg-forest text-background px-5 py-2 text-sm flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Project
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card border border-border p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-2xl font-medium tracking-tight">{s.value}</p>
            <p className={`text-[11px] mt-0.5 ${s.tone === "amber" ? "text-amber-700" : s.tone === "rose" ? "text-rose-600" : s.tone === "forest" ? "text-forest" : "text-muted-foreground"}`}>{s.sub}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl bg-card border border-border overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-6 py-4 flex-wrap">
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 flex-1 min-w-[220px] max-w-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Search projects…" className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground" />
          </div>
          <Select label="All Status" />
          <Select label="All Managers" />
          <button className="flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-secondary hover:bg-accent transition">
            <Filter className="h-3.5 w-3.5" /> More Filters
          </button>
        </div>

        <div className="flex gap-6 px-6 pt-4 text-sm border-b border-border">
          {["All Projects", "On Track", "At Risk", "Delayed", "Completed"].map((t, i) => (
            <button key={t} className={`pb-3 border-b-2 transition ${i === 0 ? "border-forest text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <th className="py-3.5 px-6 font-normal">Project</th>
                <th className="py-3.5 px-4 font-normal">Location</th>
                <th className="py-3.5 px-4 font-normal">Manager</th>
                <th className="py-3.5 px-4 font-normal w-56">Progress</th>
                <th className="py-3.5 px-4 font-normal text-right">Budget</th>
                <th className="py-3.5 px-4 font-normal text-right">Spent</th>
                <th className="py-3.5 px-4 font-normal text-right">Remaining</th>
                <th className="py-3.5 px-4 font-normal">Status</th>
                <th className="py-3.5 px-6 font-normal text-right">·</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.code} className="border-t border-border hover:bg-secondary/50 transition">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <img src={p.img} alt="" width={56} height={40} loading="lazy" className="h-10 w-14 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground">{p.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">{p.location}</td>
                  <td className="py-3.5 px-4">{p.manager}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden min-w-[100px]">
                        <div className={`h-full rounded-full ${p.status === "Delayed" ? "bg-rose-500" : p.status === "At Risk" ? "bg-amber-500" : "bg-forest"}`} style={{ width: `${p.pct}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{p.pct}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium">{p.budget}</td>
                  <td className="py-3.5 px-4 text-right text-muted-foreground">{p.spent}</td>
                  <td className="py-3.5 px-4 text-right text-muted-foreground">{p.remaining}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full ${statusTone[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4 inline" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing 1 to 4 of 12 projects</span>
          <span>Rows per page: 10</span>
        </div>
      </section>
    </div>
  );
}

function Select({ label }: { label: string }) {
  return (
    <button className="text-sm px-4 py-2 rounded-full bg-secondary hover:bg-accent transition flex items-center gap-2">
      {label} <span className="text-muted-foreground text-xs">▾</span>
    </button>
  );
}
