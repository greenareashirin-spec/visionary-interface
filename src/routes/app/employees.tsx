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
  { label: "Monthly Payroll", value: "$24,850", sub: "This month", Icon: Building2 },
];

const team = [
  { id: "EMP-001", name: "Sarah Kareem",  role: "Project Manager",       dept: "Projects",    phone: "+964 770 000 001", salary: "$1,800", hire: "15 Jan 2024", status: "Active"   },
  { id: "EMP-002", name: "Rami Hussein",  role: "Site Engineer",         dept: "Engineering", phone: "+964 770 000 002", salary: "$1,400", hire: "10 Feb 2024", status: "Active"   },
  { id: "EMP-003", name: "Lara Yousef",   role: "Landscape Architect",   dept: "Design",      phone: "+964 770 000 003", salary: "$1,700", hire: "5 Mar 2024",  status: "Active"   },
  { id: "EMP-004", name: "Omar Nabil",    role: "Foreman",               dept: "Operations",  phone: "+964 770 000 004", salary: "$950",   hire: "1 Apr 2023",  status: "On Leave" },
  { id: "EMP-005", name: "Dana Al-Amin",  role: "Accountant",            dept: "Finance",     phone: "+964 770 000 005", salary: "$1,300", hire: "12 Jun 2024", status: "Active"   },
  { id: "EMP-006", name: "Karim Faris",   role: "Irrigation Specialist", dept: "Engineering", phone: "+964 770 000 006", salary: "$1,100", hire: "20 Aug 2024", status: "Active"   },
];

function Employees() {
  return (
    <div className="flex flex-col h-full min-h-0 px-5 lg:px-6 py-4 gap-3.5">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/55">Team</p>
          <h1 className="mt-1 font-display text-[26px] leading-none">Employees</h1>
          <p className="mt-1 text-[12px] text-white/60">Manage your people, roles and activity.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs hover:bg-white/15 transition">Export</button>
          <button className="rounded-full bg-forest text-forest-deep px-4 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:brightness-110 transition">
            <Plus className="h-3.5 w-3.5" /> Add Employee
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/55">{s.label}</p>
                <p className="mt-1 text-xl font-medium tracking-tight">{s.value}</p>
                <p className="text-[10.5px] text-white/55 mt-0.5">
                  {s.sub}
                  {s.delta && <span className="text-forest ml-1.5">▲ {s.delta}</span>}
                </p>
              </div>
              <span className="h-7 w-7 rounded-lg bg-white/5 grid place-items-center shrink-0">
                <s.Icon className="h-3.5 w-3.5 text-forest" />
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 flex-wrap">
          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 flex-1 min-w-[200px] max-w-md">
            <Search className="h-3.5 w-3.5 text-white/55" />
            <input placeholder="Search by name, role or ID…" className="bg-transparent text-xs outline-none flex-1 placeholder:text-white/45" />
          </div>
          <Select label="All Departments" />
          <Select label="All Status" />
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition">
            <Filter className="h-3 w-3" /> More Filters
          </button>
        </div>
        <div className="flex gap-5 px-4 pt-2.5 text-xs border-b border-white/10">
          {["All Employees", "Departments", "On Leave", "Contractors", "Archived"].map((t, i) => (
            <button key={t} className={`pb-2 border-b-2 transition ${i === 0 ? "border-forest text-white" : "border-transparent text-white/55 hover:text-white"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex-1 min-h-0 overflow-auto">
          <table className="w-full text-[12px]">
            <thead className="sticky top-0 bg-[oklch(0.22_0.02_165)]/95 backdrop-blur">
              <tr className="text-left text-[9px] uppercase tracking-[0.22em] text-white/55">
                <th className="py-2.5 px-4 font-normal">Employee</th>
                <th className="py-2.5 px-3 font-normal">ID</th>
                <th className="py-2.5 px-3 font-normal">Department</th>
                <th className="py-2.5 px-3 font-normal">Role</th>
                <th className="py-2.5 px-3 font-normal">Status</th>
                <th className="py-2.5 px-3 font-normal">Phone</th>
                <th className="py-2.5 px-3 font-normal">Hire Date</th>
                <th className="py-2.5 px-3 font-normal text-right">Salary</th>
                <th className="py-2.5 px-4 font-normal text-right"> </th>
              </tr>
            </thead>
            <tbody>
              {team.map((m) => (
                <tr key={m.id} className="border-t border-white/5 hover:bg-black/30 transition">
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-forest/15 grid place-items-center font-medium text-forest text-[10px]">
                        {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="leading-tight">
                        <p className="font-medium">{m.name}</p>
                        <p className="text-[10.5px] text-white/50">{m.name.toLowerCase().replace(" ", ".")}@greenarea.uk</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-white/55 text-[11px]">{m.id}</td>
                  <td className="py-2.5 px-3">{m.dept}</td>
                  <td className="py-2.5 px-3">{m.role}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full ${m.status === "Active" ? "bg-forest/15 text-forest" : "bg-amber-500/15 text-amber-300"}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-white/60 text-[11px]">{m.phone}</td>
                  <td className="py-2.5 px-3 text-white/60 text-[11px]">{m.hire}</td>
                  <td className="py-2.5 px-3 text-right font-medium">{m.salary}</td>
                  <td className="py-2.5 px-4 text-right">
                    <button className="text-white/50 hover:text-white"><MoreHorizontal className="h-3.5 w-3.5 inline" /></button>
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
    <button className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition flex items-center gap-1.5">
      {label} <span className="text-white/50 text-[10px]">▾</span>
    </button>
  );
}
