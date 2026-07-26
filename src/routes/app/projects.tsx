import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/projects")({
  component: Projects,
  head: () => ({ meta: [{ title: "Projects · GreenArea OS" }] }),
});

const projects = [
  { code: "GA-014", name: "Riverside Villa", client: "H. Al-Rawi", location: "Baghdad, IQ", pm: "S. Kareem", phase: "Phase 2 — Construction", status: "Active", pct: 62, budget: "$180,000" },
  { code: "GA-011", name: "Karrada Rooftop", client: "M. Al-Sabah", location: "Baghdad, IQ", pm: "R. Hussein", phase: "Phase 3 — Finishing", status: "Active", pct: 84, budget: "$96,000" },
  { code: "GA-009", name: "Erbil Courtyard", client: "R. Barzani", location: "Erbil, IQ", pm: "L. Yousef", phase: "Phase 1 — Planning", status: "Waiting for Client", pct: 22, budget: "€48,000" },
  { code: "GA-008", name: "Basra Waterline", client: "Delta Group", location: "Basra, IQ", pm: "S. Kareem", phase: "Phase 2 — Construction", status: "On Hold", pct: 41, budget: "$210,000" },
  { code: "GA-007", name: "Ainkawa Residence", client: "N. Mikhail", location: "Erbil, IQ", pm: "L. Yousef", phase: "Phase 3 — Finishing", status: "Completed", pct: 100, budget: "€72,000" },
  { code: "GA-006", name: "Sulaymaniyah Park", client: "City of Sulaymaniyah", location: "Sulaymaniyah, IQ", pm: "R. Hussein", phase: "Phase 2 — Construction", status: "Active", pct: 55, budget: "$340,000" },
];

const statusTone: Record<string, string> = {
  "Active": "bg-forest/10 text-forest",
  "Waiting for Client": "bg-sand/40 text-forest-deep",
  "On Hold": "bg-secondary text-muted-foreground",
  "Completed": "bg-water/20 text-forest-deep",
};

function Projects() {
  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Portfolio</p>
          <h1 className="mt-3 font-display text-5xl leading-none">Projects</h1>
          <p className="mt-3 text-muted-foreground font-light max-w-lg">
            Every landscape we tend — from planning to handover.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-full bg-secondary p-1 text-xs">
            <span className="px-4 py-1.5 rounded-full bg-card">Grid</span>
            <span className="px-4 py-1.5 text-muted-foreground">Table</span>
          </div>
          <button className="rounded-full bg-forest text-background px-5 py-2 text-sm">+ New project</button>
        </div>
      </header>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((p) => (
          <article key={p.code} className="group bg-card rounded-3xl hairline p-8 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{p.code}</p>
                <h3 className="font-display text-2xl mt-2 leading-tight">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 font-light">{p.client} · {p.location}</p>
              </div>
              <span className={`text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full whitespace-nowrap ${statusTone[p.status]}`}>{p.status}</span>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">{p.phase}</p>
            <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-forest rounded-full" style={{ width: `${p.pct}%` }} />
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Manager</dt>
                <dd className="mt-1">{p.pm}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Budget</dt>
                <dd className="mt-1 font-medium">{p.budget}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
