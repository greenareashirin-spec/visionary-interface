import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Truck, Fuel, Search, Filter, Plus, MoreHorizontal, PieChart, X } from "lucide-react";

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
  const [chartOpen, setChartOpen] = useState(false);
  return (
    <div className="flex flex-col h-full min-h-0 px-5 lg:px-6 py-4 gap-3.5">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/55">Operations</p>
          <h1 className="mt-1 font-display text-[26px] leading-none">Fleet</h1>
          <p className="mt-1 text-[12px] text-white/60">Vehicles and fuel across the fleet.</p>
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
            <Plus className="h-3.5 w-3.5" /> Add Vehicle
          </button>
        </div>
      </header>
      {chartOpen && <FuelChartModal onClose={() => setChartOpen(false)} />}

      <section className="grid grid-cols-2 md:grid-cols-6 gap-2.5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-black/32 backdrop-blur-xl border border-white/10 p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/55">{s.label}</p>
              <s.Icon className="h-3 w-3 text-white/45" />
            </div>
            <p className="mt-1 text-[13px] md:text-[15px] lg:text-lg xl:text-xl font-medium tracking-tight">{s.value}</p>
            <p className="text-[10.5px] mt-0.5 text-white/55">{s.sub}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl bg-black/32 backdrop-blur-xl border border-white/10 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 flex-wrap">
          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 flex-1 min-w-[200px] max-w-md">
            <Search className="h-3.5 w-3.5 text-white/55" />
            <input placeholder="Search plate or model…" className="bg-transparent text-xs outline-none flex-1 placeholder:text-white/45" />
          </div>
          <Select label="All Status" />
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition">
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
                <tr key={v.id} className="border-t border-white/5 hover:bg-black/30 transition">
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
    <button className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition flex items-center gap-1.5">
      {label} <span className="text-white/50 text-[10px]">▾</span>
    </button>
  );
}

function FuelChartModal({ onClose }: { onClose: () => void }) {
  const total = fleet.reduce((s, v) => s + v.fuel, 0);
  const R = 120, cx = 160, cy = 160;
  let angle = -Math.PI / 2;
  const arcs = fleet.map((v, i) => {
    const frac = v.fuel / total;
    const sweep = frac * Math.PI * 2;
    const start = angle;
    const end = start + sweep;
    const large = sweep > Math.PI ? 1 : 0;
    const mid = (start + end) / 2;
    const x1 = cx + R * Math.cos(start), y1 = cy + R * Math.sin(start);
    const x2 = cx + R * Math.cos(end),   y2 = cy + R * Math.sin(end);
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`;
    const lr = R + 22;
    const lx = cx + lr * Math.cos(mid);
    const ly = cy + lr * Math.sin(mid);
    const anchor = Math.cos(mid) > 0.1 ? "start" : Math.cos(mid) < -0.1 ? "end" : "middle";
    angle = end;
    return { ...v, d, color: sliceColors[i % sliceColors.length], frac, lx, ly, anchor };
  });

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-3xl bg-[oklch(0.20_0.02_165)] border border-white/10 p-6 max-h-[90vh] overflow-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white">
          <X className="h-4 w-4" />
        </button>
        <div className="mb-4">
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/55">Operations</p>
          <h2 className="mt-1 font-display text-[22px] leading-none">Fuel by Vehicle</h2>
          <p className="mt-1 text-[12px] text-white/60">Last 30 days · Total ${total.toLocaleString()}</p>
        </div>

        <div className="grid md:grid-cols-[320px_1fr] gap-6 items-center">
          <svg viewBox="0 0 320 320" className="w-full h-auto max-w-[320px] mx-auto">
            {arcs.map((a, i) => (
              <path key={i} d={a.d} fill={a.color} stroke="oklch(0.20 0.02 165)" strokeWidth="2" />
            ))}
            {arcs.map((a, i) => a.frac > 0.03 && (
              <text
                key={`t-${i}`}
                x={a.lx}
                y={a.ly}
                textAnchor={a.anchor as "start" | "end" | "middle"}
                dominantBaseline="middle"
                fontSize="9"
                fill="rgba(255,255,255,0.75)"
                style={{ letterSpacing: "0.14em", textTransform: "uppercase" }}
              >
                {Math.round(a.frac * 100)}%
              </text>
            ))}
          </svg>

          <ul className="space-y-2">
            {arcs.map((a) => (
              <li key={a.id} className="flex items-center gap-3 rounded-xl bg-black/30 border border-white/10 px-3 py-2">
                <span className="h-3 w-3 rounded-sm shrink-0" style={{ background: a.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] truncate">{a.model}</p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">{a.plate}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-medium">${a.fuel}</p>
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
