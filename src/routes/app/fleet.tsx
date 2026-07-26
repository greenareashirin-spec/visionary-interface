import { createFileRoute } from "@tanstack/react-router";
import { Truck, Fuel, Search, Filter, Plus, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/app/fleet")({
  component: Fleet,
  head: () => ({ meta: [{ title: "Fleet · GreenArea OS" }] }),
});

const stats = [
  { label: "Total Vehicles", value: "6",      sub: "In fleet", Icon: Truck },
  { label: "Fuel (30d)",     value: "$1,240", sub: "-4.1%",    Icon: Fuel },
];

const fleet = [
  { id: "GA-VH-001", plate: "BGD 4712", model: "Toyota Hilux 2022",    fuel: 210, status: "Active"     },
  { id: "GA-VH-002", plate: "BGD 5228", model: "Isuzu D-Max 2021",     fuel: 180, status: "In Service" },
  { id: "GA-VH-003", plate: "ERB 1091", model: "Ford Ranger 2023",     fuel: 260, status: "Active"     },
  { id: "GA-VH-004", plate: "BGD 8830", model: "Mitsubishi L200 2020", fuel:  90, status: "Idle"       },
  { id: "GA-VH-005", plate: "DUH 2277", model: "Kia K2500 Truck 2019", fuel: 310, status: "Active"     },
  { id: "GA-VH-006", plate: "BGD 6614", model: "Toyota Land Cruiser",  fuel: 190, status: "Active"     },
];

const statusTone: Record<string, string> = {
  "Active":     "bg-forest/15 text-forest",
  "In Service": "bg-amber-500/15 text-amber-300",
  "Idle":       "bg-white/10 text-white/70",
};

const sliceColors = [
  "oklch(0.72 0.14 145)",
  "oklch(0.72 0.08 80)",
  "oklch(0.55 0.07 115)",
  "oklch(0.68 0.10 200)",
  "oklch(0.85 0.005 70)",
  "oklch(0.60 0.12 30)",
];

function Fleet() {
  return (
    <div className="flex flex-col h-full min-h-0 px-5 lg:px-6 py-4 gap-3.5">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/55">Operations</p>
          <h1 className="mt-1 font-display text-[26px] leading-none">Fleet</h1>
          <p className="mt-1 text-[12px] text-white/60">Vehicles and fuel across the fleet.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs hover:bg-white/10 transition">Export</button>
          <button className="rounded-full bg-forest text-forest-deep px-4 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:brightness-110 transition">
            <Plus className="h-3.5 w-3.5" /> Add Vehicle
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        <div className="grid grid-cols-2 gap-2.5 md:col-span-1">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/[0.04] border border-white/10 p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/55">{s.label}</p>
                <s.Icon className="h-3 w-3 text-white/45" />
              </div>
              <p className="mt-1 text-xl font-medium tracking-tight">{s.value}</p>
              <p className="text-[10.5px] mt-0.5 text-white/55">{s.sub}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 md:col-span-2 flex items-center gap-3 min-h-[180px]">
          <PieBites
            segments={fleet.map((v, i) => ({
              label: v.model,
              value: v.fuel,
              color: sliceColors[i % sliceColors.length],
            }))}
          />
          <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            {fleet.map((v, i) => (
              <div key={v.id} className="flex items-center gap-1.5 min-w-0">
                <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: sliceColors[i % sliceColors.length] }} />
                <span className="text-white/70 truncate">{v.model}</span>
                <span className="ml-auto text-white/50">${v.fuel}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white/[0.04] border border-white/10 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 flex-wrap">
          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 flex-1 min-w-[200px] max-w-md">
            <Search className="h-3.5 w-3.5 text-white/55" />
            <input placeholder="Search plate or model…" className="bg-transparent text-xs outline-none flex-1 placeholder:text-white/45" />
          </div>
          <Select label="All Status" />
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition">
            <Filter className="h-3 w-3" /> More Filters
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-auto">
          <table className="w-full text-[12px]">
            <thead className="sticky top-0 bg-[oklch(0.22_0.02_165)]/95 backdrop-blur">
              <tr className="text-left text-[9px] uppercase tracking-[0.22em] text-white/55">
                <th className="py-2.5 px-4 font-normal">Vehicle</th>
                <th className="py-2.5 px-3 font-normal">Plate</th>
                <th className="py-2.5 px-3 font-normal">Status</th>
                <th className="py-2.5 px-3 font-normal">Fuel (30d)</th>
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
                  <td className="py-2.5 px-3">
                    <span className={`text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full ${statusTone[v.status]}`}>{v.status}</span>
                  </td>
                  <td className="py-2.5 px-3 text-white/70">${v.fuel}</td>
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

function PieBites({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const size = 260, cx = size / 2, cy = size / 2, r = 74, gap = 5;
  const total = segments.reduce((s, x) => s + x.value, 0);
  const gapAngle = gap / r;
  let angle = -Math.PI / 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-[220px] h-[220px] shrink-0">
      {segments.map((s, i) => {
        const sweep = (s.value / total) * Math.PI * 2;
        const a0 = angle + gapAngle / 2;
        const a1 = angle + sweep - gapAngle / 2;
        const mid = (a0 + a1) / 2;
        angle += sweep;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
        const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
        const d = `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
        const lr = r + 6;
        const lx = cx + lr * Math.cos(mid);
        const ly = cy + lr * Math.sin(mid);
        const tr = r + 18;
        const tx = cx + tr * Math.cos(mid);
        const ty = cy + tr * Math.sin(mid);
        const anchor = Math.cos(mid) > 0.15 ? "start" : Math.cos(mid) < -0.15 ? "end" : "middle";
        return (
          <g key={i}>
            <path d={d} fill={s.color} opacity={0.92} />
            <line x1={cx + r * Math.cos(mid)} y1={cy + r * Math.sin(mid)} x2={lx} y2={ly} stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" />
            <text x={tx} y={ty} fontSize="8.5" fill="rgba(255,255,255,0.78)" textAnchor={anchor} dominantBaseline="middle">
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
