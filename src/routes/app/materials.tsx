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
  { label: "Total Materials", value: "156", sub: "In inventory", Icon: Package },
  { label: "Low Stock",       value: "18",  sub: "Reorder soon", tone: "amber" as const, Icon: AlertTriangle },
  { label: "Out of Stock",    value: "3",   sub: "Needs attention", tone: "rose" as const, Icon: XCircle },
  { label: "Total Value",     value: "$647,820", sub: "Inventory value", Icon: FileText },
  { label: "Purchase Orders", value: "12",  sub: "Open",             Icon: FileText },
];

const categories = [
  { name: "Stone",  pct: 41, color: "bg-forest" },
  { name: "Sand",   pct: 21, color: "bg-sand" },
  { name: "Cement", pct: 15, color: "bg-charcoal" },
  { name: "Timber", pct: 12, color: "bg-olive" },
  { name: "Other",  pct: 11, color: "bg-muted-foreground" },
];

const items = [
  { name: "Natural Stone", cat: "Stone",  unit: "m²",  qty: 68.5, min: 20, cost: "$85.00",  total: "$5,822.50", status: "In Stock",   supplier: "Al-Amin Quarry" },
  { name: "Sand",          cat: "Sand",   unit: "m³",  qty: 42.0, min: 15, cost: "$18.00",  total: "$756.00",   status: "In Stock",   supplier: "Delta Aggregates" },
  { name: "Cement",        cat: "Cement", unit: "Bag", qty: 120,  min: 30, cost: "$7.50",   total: "$900.00",   status: "In Stock",   supplier: "Baghdad Cement" },
  { name: "Timber",        cat: "Timber", unit: "m³",  qty: 18.3, min: 20, cost: "$120.00", total: "$2,196.00", status: "Low Stock",  supplier: "Nour Timber" },
  { name: "Steel Rebar",   cat: "Steel",  unit: "Ton", qty: 8.0,  min: 10, cost: "$650.00", total: "$5,200.00", status: "Low Stock",  supplier: "Erbil Steel" },
  { name: "Water Pump",    cat: "Equipment", unit: "Unit", qty: 0,  min: 2, cost: "$150.00", total: "$0.00",    status: "Out of Stock", supplier: "HydroPart" },
  { name: "Irrigation Pipe", cat: "Plumbing", unit: "m", qty: 480, min: 100, cost: "$3.20", total: "$1,536.00", status: "In Stock", supplier: "HydroPart" },
];

const statusTone: Record<string, string> = {
  "In Stock":     "bg-forest/10 text-forest",
  "Low Stock":    "bg-amber-500/15 text-amber-700",
  "Out of Stock": "bg-rose-500/15 text-rose-600",
};

function Materials() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Materials &amp; Inventory</p>
          <h1 className="mt-2 font-display text-4xl leading-none">Materials</h1>
          <p className="mt-2 text-sm text-muted-foreground">Track stock levels, materials and movements.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full bg-secondary px-4 py-2 text-sm hover:bg-accent transition">Export</button>
          <button className="rounded-full bg-forest text-background px-5 py-2 text-sm flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Material
          </button>
        </div>
      </header>

      <section className="grid lg:grid-cols-5 gap-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-3 lg:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:col-span-3">
            {stats.slice(0, 3).map((s) => (
              <div key={s.label} className="rounded-2xl bg-card border border-border p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{s.label}</p>
                <p className="mt-2 text-3xl font-medium tracking-tight">{s.value}</p>
                <p className={`text-xs mt-0.5 ${s.tone === "amber" ? "text-amber-700" : s.tone === "rose" ? "text-rose-600" : "text-muted-foreground"}`}>{s.sub}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stats.slice(3).map((s) => (
              <div key={s.label} className="rounded-2xl bg-card border border-border p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{s.label}</p>
                <p className="mt-2 text-3xl font-medium tracking-tight">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Stock Value by Category</p>
            <span className="text-xs text-muted-foreground">Total 100%</span>
          </div>
          <Donut segments={categories.map(c => ({ pct: c.pct, className: c.color }))} />
          <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.name} className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${c.color}`} />
                <span className="text-muted-foreground text-xs">{c.name}</span>
                <span className="ml-auto text-xs">{c.pct}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-3xl bg-card border border-border overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-6 py-4 flex-wrap">
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 flex-1 min-w-[220px] max-w-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Search materials…" className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground" />
          </div>
          <Select label="All Categories" />
          <Select label="All Locations" />
          <button className="flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-secondary hover:bg-accent transition">
            <Filter className="h-3.5 w-3.5" /> More Filters
          </button>
        </div>

        <div className="flex gap-6 px-6 pt-4 text-sm border-b border-border">
          {["All Materials", "Low Stock", "Out of Stock"].map((t, i) => (
            <button key={t} className={`pb-3 border-b-2 transition ${i === 0 ? "border-forest text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <th className="py-3.5 px-6 font-normal">Material</th>
                <th className="py-3.5 px-4 font-normal">Category</th>
                <th className="py-3.5 px-4 font-normal">Unit</th>
                <th className="py-3.5 px-4 font-normal text-right">Stock Qty</th>
                <th className="py-3.5 px-4 font-normal text-right">Min. Level</th>
                <th className="py-3.5 px-4 font-normal text-right">Unit Cost</th>
                <th className="py-3.5 px-4 font-normal text-right">Total Value</th>
                <th className="py-3.5 px-4 font-normal">Supplier</th>
                <th className="py-3.5 px-4 font-normal">Status</th>
                <th className="py-3.5 px-6 font-normal text-right">·</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.name} className="border-t border-border hover:bg-secondary/50 transition">
                  <td className="py-3.5 px-6 font-medium">{it.name}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{it.cat}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{it.unit}</td>
                  <td className="py-3.5 px-4 text-right">{it.qty}</td>
                  <td className="py-3.5 px-4 text-right text-muted-foreground">{it.min}</td>
                  <td className="py-3.5 px-4 text-right text-muted-foreground">{it.cost}</td>
                  <td className="py-3.5 px-4 text-right font-medium">{it.total}</td>
                  <td className="py-3.5 px-4 text-muted-foreground text-xs">{it.supplier}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full ${statusTone[it.status]}`}>{it.status}</span>
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

/* Simple donut chart (SVG). Segments sum to <= 100. */
function Donut({ segments }: { segments: { pct: number; className: string }[] }) {
  const size = 160, r = 60, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center justify-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-40 h-40 -rotate-90">
        <circle cx={cx} cy={cy} r={r} stroke="currentColor" className="text-border" strokeWidth="14" fill="none" />
        {segments.map((s, i) => {
          const len = (s.pct / 100) * circ;
          const dash = `${len} ${circ - len}`;
          const el = (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              strokeWidth="14"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              className={s.className.replace("bg-", "stroke-").replace("charcoal", "foreground/70").replace("sand", "sand").replace("muted-foreground", "muted-foreground")}
              stroke="currentColor"
              style={{
                color:
                  s.className.includes("forest") ? "oklch(0.38 0.06 155)" :
                  s.className.includes("sand") ? "oklch(0.72 0.08 80)" :
                  s.className.includes("olive") ? "oklch(0.55 0.07 115)" :
                  s.className.includes("charcoal") ? "oklch(0.28 0.015 70)" :
                  "oklch(0.6 0.01 70)",
              }}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
    </div>
  );
}
