import { createFileRoute } from "@tanstack/react-router";
import { Package, AlertTriangle, XCircle, FileText, Search, Filter, Plus, MoreHorizontal } from "lucide-react";

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
  return (
    <div className="flex flex-col h-full min-h-0 px-5 lg:px-6 py-4 gap-3.5">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/55">Materials &amp; Inventory</p>
          <h1 className="mt-1 font-display text-[26px] leading-none">Materials</h1>
          <p className="mt-1 text-[12px] text-white/60">Track stock levels, materials and movements.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs hover:bg-white/10 transition">Export</button>
          <button className="rounded-full bg-forest text-forest-deep px-4 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:brightness-110 transition">
            <Plus className="h-3.5 w-3.5" /> Add Material
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-6 gap-2.5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white/[0.04] border border-white/10 p-3">
            <p className="text-[9px] uppercase tracking-[0.22em] text-white/55">{s.label}</p>
            <p className="mt-1 text-xl font-medium tracking-tight">{s.value}</p>
            <p className={`text-[10.5px] mt-0.5 ${s.tone === "amber" ? "text-amber-300" : s.tone === "rose" ? "text-rose-300" : "text-white/55"}`}>{s.sub}</p>
          </div>
        ))}
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 md:col-span-2 flex items-center gap-3">
          <Donut segments={categories.map(c => ({ pct: c.pct, color: c.color }))} />
          <ul className="flex-1 grid grid-cols-1 gap-y-1 text-[11px]">
            {categories.map((c) => (
              <li key={c.name} className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${colorMap[c.color]}`} />
                <span className="text-white/60">{c.name}</span>
                <span className="ml-auto text-white/75">{c.pct}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl bg-white/[0.04] border border-white/10 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 flex-wrap">
          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 flex-1 min-w-[200px] max-w-md">
            <Search className="h-3.5 w-3.5 text-white/55" />
            <input placeholder="Search materials…" className="bg-transparent text-xs outline-none flex-1 placeholder:text-white/45" />
          </div>
          <Select label="All Categories" />
          <Select label="All Locations" />
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition">
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
              <tr className="text-left text-[9px] uppercase tracking-[0.22em] text-white/55">
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
                <tr key={it.name} className="border-t border-white/5 hover:bg-white/[0.03] transition">
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
    <button className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center gap-1.5">
      {label} <span className="text-white/50 text-[10px]">▾</span>
    </button>
  );
}

function Donut({ segments }: { segments: { pct: number; color: string }[] }) {
  const size = 80, cx = size / 2, cy = size / 2, r = 34, gap = 4;
  const stroke = (c: string) =>
    c === "forest"   ? "oklch(0.72 0.14 145)" :
    c === "sand"     ? "oklch(0.72 0.08 80)"  :
    c === "olive"    ? "oklch(0.55 0.07 115)" :
    c === "charcoal" ? "oklch(0.85 0.005 70)" :
                       "oklch(0.6 0.01 70)";
  const total = segments.reduce((s, x) => s + x.pct, 0);
  const gapAngle = (gap / r); // radians of gap on arc
  let angle = -Math.PI / 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-[80px] h-[80px] shrink-0">
      {segments.map((s, i) => {
        const sweep = (s.pct / total) * Math.PI * 2;
        const a0 = angle + gapAngle / 2;
        const a1 = angle + sweep - gapAngle / 2;
        angle += sweep;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
        const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
        const d = `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
        return <path key={i} d={d} fill={stroke(s.color)} opacity={0.9} />;
      })}
    </svg>
  );
}
