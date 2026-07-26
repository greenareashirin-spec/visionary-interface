import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Package, AlertTriangle, XCircle, FileText, Search, Filter, Plus, MoreHorizontal, PieChart, X } from "lucide-react";


export const Route = createFileRoute("/app/materials")({
  component: Materials,
  head: () => ({
    meta: [
      { title: "Materials · GreenArea OS" },
      { name: "description", content: "Materials & inventory across every Green Area project." },
    ],
  }),
});

const stats = [
  { label: "Total Materials", value: "156",      sub: "In inventory",     Icon: Package },
  { label: "Low Stock",       value: "18",       sub: "Reorder soon",     tone: "amber" as const, Icon: AlertTriangle },
  { label: "Out of Stock",    value: "3",        sub: "Needs attention",  tone: "rose"  as const, Icon: XCircle },
  { label: "Total Value",     value: "$647,820", sub: "Inventory value",  Icon: FileText },
];

const categories = [
  { name: "Stone",  pct: 41, color: "forest" },
  { name: "Sand",   pct: 21, color: "sand" },
  { name: "Cement", pct: 15, color: "charcoal" },
  { name: "Timber", pct: 12, color: "olive" },
  { name: "Other",  pct: 11, color: "muted" },
];

const items = [
  { name: "Natural Stone",   cat: "Stone",     unit: "m²",   qty: 68.5, min: 20,  cost: "$85.00",  total: "$5,822.50", status: "In Stock"     },
  { name: "Sand",            cat: "Sand",      unit: "m³",   qty: 42.0, min: 15,  cost: "$18.00",  total: "$756.00",   status: "In Stock"     },
  { name: "Cement",          cat: "Cement",    unit: "Bag",  qty: 120,  min: 30,  cost: "$7.50",   total: "$900.00",   status: "In Stock"     },
  { name: "Timber",          cat: "Timber",    unit: "m³",   qty: 18.3, min: 20,  cost: "$120.00", total: "$2,196.00", status: "Low Stock"    },
  { name: "Steel Rebar",     cat: "Steel",     unit: "Ton",  qty: 8.0,  min: 10,  cost: "$650.00", total: "$5,200.00", status: "Low Stock"    },
  { name: "Water Pump",      cat: "Equipment", unit: "Unit", qty: 0,    min: 2,   cost: "$150.00", total: "$0.00",     status: "Out of Stock" },
  { name: "Irrigation Pipe", cat: "Plumbing",  unit: "m",    qty: 480,  min: 100, cost: "$3.20",   total: "$1,536.00", status: "In Stock"     },
];

const statusTone: Record<string, string> = {
  "In Stock":     "bg-forest/15 text-forest",
  "Low Stock":    "bg-amber-500/15 text-amber-300",
  "Out of Stock": "bg-rose-500/15 text-rose-300",
};

const colorMap: Record<string, string> = {
  forest:   "bg-forest",
  sand:     "bg-sand",
  charcoal: "bg-white/60",
  olive:    "bg-olive",
  muted:    "bg-white/30",
};

function Materials() {
  const [chartOpen, setChartOpen] = useState(false);
  return (
    <div className="flex flex-col h-full min-h-0 px-5 lg:px-6 py-4 gap-3.5">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/55">Materials &amp; Inventory</p>
          <h1 className="mt-1 font-display text-[26px] leading-none">Materials</h1>
          <p className="mt-1 text-[12px] text-white/60">Track stock levels, materials and movements.</p>
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
            <Plus className="h-3.5 w-3.5" /> Add Material
          </button>
        </div>
      </header>
      {chartOpen && <CategoryChartModal onClose={() => setChartOpen(false)} />}

      <section className="grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-2.5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-black/32 backdrop-blur-xl border border-white/10 p-2 md:p-3">
            <p className="text-[9px] uppercase tracking-[0.12em] md:tracking-[0.22em] text-white/55">{s.label}</p>
            <p className="mt-1 text-[13px] md:text-[15px] lg:text-lg xl:text-xl font-medium tracking-tight">{s.value}</p>
            <p className={`text-[10.5px] mt-0.5 ${s.tone === "amber" ? "text-amber-300" : s.tone === "rose" ? "text-rose-300" : "text-white/55"}`}>{s.sub}</p>
          </div>
        ))}
      </section>


      <section className="rounded-2xl bg-black/32 backdrop-blur-xl border border-white/10 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 flex-wrap">
          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 flex-1 min-w-[200px] max-w-md">
            <Search className="h-3.5 w-3.5 text-white/55" />
            <input placeholder="Search materials…" className="bg-transparent text-xs outline-none flex-1 placeholder:text-white/45" />
          </div>
          <Select label="All Categories" />
          <Select label="All Locations" />
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition">
            <Filter className="h-3 w-3" /> More Filters
          </button>
        </div>
        <div className="flex gap-5 px-4 pt-2.5 text-xs border-b border-white/10">
          {["All Materials", "Low Stock", "Out of Stock"].map((t, i) => (
            <button key={t} className={`pb-2 border-b-2 transition ${i === 0 ? "border-forest text-white" : "border-transparent text-white/55 hover:text-white"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex-1 min-h-0 overflow-auto">
          <table className="w-full text-[12px]">
            <thead className="sticky top-0 bg-[oklch(0.22_0.02_165)]/95 backdrop-blur">
              <tr className="text-left text-[9px] uppercase tracking-[0.12em] md:tracking-[0.22em] text-white/55">
                <th className="py-2.5 px-4 font-normal">Material</th>
                <th className="py-2.5 px-3 font-normal">Category</th>
                <th className="py-2.5 px-3 font-normal">Unit</th>
                <th className="py-2.5 px-3 font-normal text-right">Stock Qty</th>
                <th className="py-2.5 px-3 font-normal text-right">Min. Level</th>
                <th className="py-2.5 px-3 font-normal text-right">Unit Cost</th>
                <th className="py-2.5 px-3 font-normal text-right">Total Value</th>
                <th className="py-2.5 px-3 font-normal">Status</th>
                <th className="py-2.5 px-4 font-normal text-right"> </th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.name} className="border-t border-white/5 hover:bg-black/30 transition">
                  <td className="py-2.5 px-4 font-medium">{it.name}</td>
                  <td className="py-2.5 px-3 text-white/60">{it.cat}</td>
                  <td className="py-2.5 px-3 text-white/60">{it.unit}</td>
                  <td className="py-2.5 px-3 text-right">{it.qty}</td>
                  <td className="py-2.5 px-3 text-right text-white/55">{it.min}</td>
                  <td className="py-2.5 px-3 text-right text-white/60">{it.cost}</td>
                  <td className="py-2.5 px-3 text-right font-medium">{it.total}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full ${statusTone[it.status]}`}>{it.status}</span>
                  </td>
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

function CategoryChartModal({ onClose }: { onClose: () => void }) {
  const palette: Record<string, string> = {
    forest:   "#7CB342",
    sand:     "#D4B382",
    charcoal: "#D9D4C7",
    olive:    "#8A9A5B",
    muted:    "#8892A0",
  };
  const total = categories.reduce((s, c) => s + c.pct, 0);
  const R = 120, cx = 160, cy = 160;
  let angle = -Math.PI / 2;

  const arcs = categories.map((c) => {
    const frac = c.pct / total;
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
    return { d, color: palette[c.color] ?? "#8892A0", name: c.name, pct: c.pct, frac, lx, ly, anchor };
  });

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-3xl rounded-3xl bg-[oklch(0.20_0.02_165)] border border-white/10 p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white">
          <X className="h-4 w-4" />
        </button>
        <div className="mb-4">
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/55">Materials &amp; Inventory</p>
          <h2 className="mt-1 font-display text-[22px] leading-none">Stock by Category</h2>
          <p className="mt-1 text-[12px] text-white/60">Share of inventory across categories</p>
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
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-medium">{a.pct}%</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

