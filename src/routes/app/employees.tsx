import { createFileRoute } from "@tanstack/react-router";
import { Users, Calendar, UserMinus, Building2, Search, Filter, Plus, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/app/employees")({
  component: Employees,
  head: () => ({ meta: [{ title: "Employees · GreenArea OS" }] }),
});

const stats = [
  { label: "Total Employees", value: "18", sub: "Active staff", delta: "+8.3%", Icon: Users },
  { label: "On Site Today",   value: "12", sub: "66.7% of team", Icon: Calendar },
  { label: "On Leave",        value: "2",  sub: "This week",     Icon: UserMinus },
  { label: "Departments",     value: "6",  sub: "Active",        Icon: Building2 },
];

const team = [
  { id: "EMP-001", name: "Sarah Kareem",  role: "Project Manager",     dept: "Projects",    project: "Riverside Villa",  phone: "+964 770 000 001", status: "Active"  },
  { id: "EMP-002", name: "Rami Hussein",  role: "Site Engineer",       dept: "Engineering", project: "Erbil Courtyard",  phone: "+964 770 000 002", status: "Active"  },
  { id: "EMP-003", name: "Lara Yousef",   role: "Landscape Architect", dept: "Design",      project: "Karrada Rooftop",  phone: "+964 770 000 003", status: "Active"  },
  { id: "EMP-004", name: "Omar Nabil",    role: "Foreman",             dept: "Operations",  project: "Riverside Villa",  phone: "+964 770 000 004", status: "On Leave"},
  { id: "EMP-005", name: "Dana Al-Amin",  role: "Accountant",          dept: "Finance",     project: "—",                phone: "+964 770 000 005", status: "Active"  },
  { id: "EMP-006", name: "Karim Faris",   role: "Irrigation Specialist", dept: "Engineering", project: "Sulaymaniyah Park", phone: "+964 770 000 006", status: "Active" },
];

function Employees() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Team</p>
          <h1 className="mt-2 font-display text-4xl leading-none">Employees</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your people, roles and activity.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full bg-secondary px-4 py-2 text-sm hover:bg-accent transition">Export</button>
          <button className="rounded-full bg-forest text-background px-5 py-2 text-sm flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Employee
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card border border-border p-5 shadow-[0_10px_30px_-25px_rgba(0,0,0,0.2)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{s.label}</p>
                <p className="mt-3 text-3xl font-medium tracking-tight">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {s.sub}
                  {s.delta && <span className="text-forest ml-2">▲ {s.delta}</span>}
                </p>
              </div>
              <span className="h-9 w-9 rounded-xl bg-secondary grid place-items-center">
                <s.Icon className="h-4 w-4 text-forest" />
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-3xl bg-card border border-border overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-6 py-4 flex-wrap">
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 flex-1 min-w-[220px] max-w-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Search by name, role or ID…" className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground" />
          </div>
          <Select label="All Departments" />
          <Select label="All Status" />
          <button className="flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-secondary hover:bg-accent transition">
            <Filter className="h-3.5 w-3.5" /> More Filters
          </button>
        </div>

        <div className="flex gap-6 px-6 pt-4 text-sm border-b border-border">
          {["All Employees", "Departments", "On Leave", "Contractors", "Archived"].map((t, i) => (
            <button key={t} className={`pb-3 border-b-2 transition ${i === 0 ? "border-forest text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <th className="py-3.5 px-6 font-normal">Employee</th>
                <th className="py-3.5 px-4 font-normal">ID</th>
                <th className="py-3.5 px-4 font-normal">Department</th>
                <th className="py-3.5 px-4 font-normal">Role</th>
                <th className="py-3.5 px-4 font-normal">Project</th>
                <th className="py-3.5 px-4 font-normal">Phone</th>
                <th className="py-3.5 px-4 font-normal">Status</th>
                <th className="py-3.5 px-6 font-normal text-right">·</th>
              </tr>
            </thead>
            <tbody>
              {team.map((m) => (
                <tr key={m.id} className="border-t border-border hover:bg-secondary/50 transition">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-forest/10 grid place-items-center font-medium text-forest text-xs">
                        {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-[11px] text-muted-foreground">{m.name.toLowerCase().replace(" ", ".")}@greenarea.uk</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground text-xs">{m.id}</td>
                  <td className="py-3.5 px-4">{m.dept}</td>
                  <td className="py-3.5 px-4">{m.role}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{m.project}</td>
                  <td className="py-3.5 px-4 text-muted-foreground text-xs">{m.phone}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full ${m.status === "Active" ? "bg-forest/10 text-forest" : "bg-amber-500/15 text-amber-700"}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4 inline" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
