import { createFileRoute } from "@tanstack/react-router";
import { Truck, Fuel, Wrench, CheckCircle2, Search, Filter, Plus, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/app/fleet")({
  component: Fleet,
  head: () => ({ meta: [{ title: "Fleet · GreenArea OS" }] }),
});

const stats = [
  { label: "Total Vehicles", value: "6",       sub: "In fleet",         Icon: Truck },
  { label: "Active",         value: "4",       sub: "On assignment",    Icon: CheckCircle2, tone: "forest" as const },
  { label: "In Service",     value: "1",       sub: "Maintenance",      Icon: Wrench,       tone: "amber"  as const },
  { label: "Idle",           value: "1",       sub: "Available",        Icon: Truck },
  { label: "Fuel (30d)",     value: "$1,240",  sub: "-4.1%",            Icon: Fuel },
  { label: "Next Service",   value: "3 days",  sub: "GA-VH-002",        Icon: Wrench },
];

const fleet = [
  { id: "GA-VH-001", plate: "BGD 4712", model: "Toyota Hilux 2022",    driver: "Omar Nabil",   assigned: "GA-014 · Riverside", odo: "42,180 km", fuel: "$210", status: "Active",     next: "12 Aug" },
  { id: "GA-VH-002", plate: "BGD 5228", model: "Isuzu D-Max 2021",     driver: "Karim Faris",  assigned: "GA-009 · Erbil",     odo: "58,940 km", fuel: "$180", status: "In Service", next: "29 Jul" },
  { id: "GA-VH-003", plate: "ERB 1091", model: "Ford Ranger 2023",     driver: "Rami Hussein", assigned: "GA-011 · Karrada",   odo: "18,220 km", fuel: "$260", status: "Active",     next: "22 Sep" },
  { id: "GA-VH-004", plate: "BGD 8830", model: "Mitsubishi L200 2020", driver: "—",            assigned: "Workshop",           odo: "82,610 km", fuel: "$90",  status: "Idle",       next: "04 Aug" },
  { id: "GA-VH-005", plate: "DUH 2277", model: "Kia K2500 Truck 2019", driver: "S. Kareem",    assigned: "GA-021 · Mountain",  odo: "94,300 km", fuel: "$310", status: "Active",     next: "18 Aug" },
  { id: "GA-VH-006", plate: "BGD 6614", model: "Toyota Land Cruiser",  driver: "L. Yousef",    assigned: "Ops · Baghdad",      odo: "31,020 km", fuel: "$190", status: "Active",     next: "07 Sep" },
];

const statusTone: Record<string, string> = {
  "Active":     "bg-forest/15 text-forest",
  "In Service": "bg-amber-500/15 text-amber-300",
  "Idle":       "bg-white/10 text-white/70",
};

function Fleet() {
  return (
    <div className="flex flex-col h-full min-h-0 px-5 lg:px-6 py-4 gap-3.5">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/55">Operations</p>
          <h1 className="mt-1 font-display text-[26px] leading-none">Fleet</h1>
          <p className="mt-1 text-[12px] text-white/60">Vehicles, drivers, fuel and service.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs hover:bg-white/10 transition">Export</button>
          <button className="rounded-full bg-forest text-forest-deep px-4 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:brightness-110 transition">
            <Plus className="h-3.5 w-3.5" /> Add Vehicle
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-6 gap-2.5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white/[0.04] border border-white/10 p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/55">{s.label}</p>
              <s.Icon className="h-3 w-3 text-white/45" />
            </div>
            <p className="mt-1 text-xl font-medium tracking-tight">{s.value}</p>
            <p className={`text-[10.5px] mt-0.5 ${s.tone === "forest" ? "text-forest" : s.tone === "amber" ? "text-amber-300" : "text-white/55"}`}>{s.sub}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl bg-white/[0.04] border border-white/10 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 flex-wrap">
          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 flex-1 min-w-[200px] max-w-md">
            <Search className="h-3.5 w-3.5 text-white/55" />
            <input placeholder="Search plate, driver or model…" className="bg-transparent text-xs outline-none flex-1 placeholder:text-white/45" />
          </div>
          <Select label="All Status" />
          <Select label="All Drivers" />
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition">
            <Filter className="h-3 w-3" /> More Filters
          </button>
        </div>
        <div className="flex gap-5 px-4 pt-2.5 text-xs border-b border-white/10">
          {["All Vehicles", "Active", "In Service", "Idle", "Archived"].map((t, i) => (
            <button key={t} className={`pb-2 border-b-2 transition ${i === 0 ? "border-forest text-white" : "border-transparent text-white/55 hover:text-white"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex-1 min-h-0 overflow-auto">
          <table className="w-full text-[12px]">
            <thead className="sticky top-0 bg-[oklch(0.22_0.02_165)]/95 backdrop-blur">
              <tr className="text-left text-[9px] uppercase tracking-[0.22em] text-white/55">
                <th className="py-2.5 px-4 font-normal">Vehicle</th>
                <th className="py-2.5 px-3 font-normal">Plate</th>
                <th className="py-2.5 px-3 font-normal">Driver</th>
                <th className="py-2.5 px-3 font-normal">Assignment</th>
                <th className="py-2.5 px-3 font-normal">Status</th>
                <th className="py-2.5 px-3 font-normal">Odometer</th>
                <th className="py-2.5 px-3 font-normal">Fuel (30d)</th>
                <th className="py-2.5 px-3 font-normal">Next Service</th>
                <th className="py-2.5 px-4 font-normal text-right"> </th>
              </tr>
            </thead>
            <tbody>
              {fleet.map((v) => (
                <tr key={v.id} className="border-t border-white/5 hover:bg-white/[0.03] transition">
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-forest/15 grid place-items-center text-forest">
                        <Truck className="h-3.5 w-3.5" />
                      </div>
                      <div className="leading-tight">
                        <p className="font-medium">{v.model}</p>
                        <p className="text-[10.5px] text-white/50">{v.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-white/70 text-[11px]">{v.plate}</td>
                  <td className="py-2.5 px-3">{v.driver}</td>
                  <td className="py-2.5 px-3 text-white/70">{v.assigned}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full ${statusTone[v.status]}`}>{v.status}</span>
                  </td>
                  <td className="py-2.5 px-3 text-white/70 text-[11px]">{v.odo}</td>
                  <td className="py-2.5 px-3 text-white/70">{v.fuel}</td>
                  <td className="py-2.5 px-3 text-white/70 text-[11px]">{v.next}</td>
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
    <button className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center gap-1.5">
      {label} <span className="text-white/50 text-[10px]">▾</span>
    </button>
  );
}
