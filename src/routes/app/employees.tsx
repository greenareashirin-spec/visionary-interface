import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/employees")({
  component: Employees,
  head: () => ({ meta: [{ title: "Team · GreenArea OS" }] }),
});

const team = [
  { id: "EMP-001", name: "Sarah Kareem", role: "Project Manager", phone: "+964 770 000 001", status: "Active" },
  { id: "EMP-002", name: "Rami Hussein", role: "Site Engineer", phone: "+964 770 000 002", status: "Active" },
  { id: "EMP-003", name: "Lara Yousef", role: "Landscape Architect", phone: "+964 770 000 003", status: "Active" },
  { id: "EMP-004", name: "Omar Nabil", role: "Foreman", phone: "+964 770 000 004", status: "On Leave" },
  { id: "EMP-005", name: "Dana Al-Amin", role: "Accountant", phone: "+964 770 000 005", status: "Active" },
  { id: "EMP-006", name: "Karim Faris", role: "Irrigation Specialist", phone: "+964 770 000 006", status: "Active" },
];

function Employees() {
  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">People</p>
          <h1 className="mt-3 font-display text-5xl leading-none">The Team</h1>
          <p className="mt-3 text-muted-foreground font-light max-w-lg">
            The hands and minds that shape every project.
          </p>
        </div>
        <button className="rounded-full bg-forest text-background px-5 py-2 text-sm">+ Add teammate</button>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((m) => (
          <div key={m.id} className="bg-card rounded-3xl hairline p-8 flex items-start gap-5">
            <div className="h-14 w-14 rounded-full bg-forest/10 grid place-items-center font-display text-forest text-xl">
              {m.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-xl leading-tight">{m.name}</p>
                  <p className="text-sm text-muted-foreground">{m.role}</p>
                </div>
                <span className={`text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full whitespace-nowrap ${m.status === "Active" ? "bg-forest/10 text-forest" : "bg-sand/40 text-forest-deep"}`}>
                  {m.status}
                </span>
              </div>
              <div className="mt-5 pt-5 border-t border-border text-xs text-muted-foreground space-y-1">
                <p>{m.id}</p>
                <p>{m.phone}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
