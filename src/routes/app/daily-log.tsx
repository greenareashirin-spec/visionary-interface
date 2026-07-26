import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/daily-log")({
  component: DailyLog,
  head: () => ({ meta: [{ title: "Daily Log · GreenArea OS" }] }),
});

const rows = [
  { d: "26 Jul", p: "GA-014", proj: "Riverside Villa", t: "Expense", c: "Material", desc: "Limestone slabs — Batch 3", who: "Al-Amin Quarry", doc: "INV-2288", pm: "Bank", cur: "USD", a: "-2,480", s: "Verified" },
  { d: "25 Jul", p: "GA-011", proj: "Karrada Rooftop", t: "Income", c: "Client Payment", desc: "Milestone 3 release", who: "M. Al-Sabah", doc: "RCT-0091", pm: "Bank", cur: "USD", a: "+18,000", s: "Verified" },
  { d: "25 Jul", p: "GA-014", proj: "Riverside Villa", t: "Expense", c: "Labor", desc: "Week 30 payroll", who: "Site crew A", doc: "PR-30", pm: "Cash", cur: "EUR", a: "-960", s: "Verified" },
  { d: "24 Jul", p: "GA-009", proj: "Erbil Courtyard", t: "Expense", c: "Fuel", desc: "Site pickup refuel", who: "Kawa Petrol", doc: "RCT-118", pm: "Cash", cur: "IQD", a: "-140,000", s: "Pending" },
  { d: "23 Jul", p: "GA-011", proj: "Karrada Rooftop", t: "Expense", c: "Transport", desc: "Delivery — pergola beams", who: "Nour Freight", doc: "INV-441", pm: "FIB", cur: "USD", a: "-320", s: "Verified" },
  { d: "22 Jul", p: "GA-014", proj: "Riverside Villa", t: "Expense", c: "Material", desc: "Irrigation manifolds", who: "HydroPart", doc: "INV-2271", pm: "Bank", cur: "USD", a: "-1,140", s: "Verified" },
  { d: "22 Jul", p: "GA-009", proj: "Erbil Courtyard", t: "Income", c: "Deposit", desc: "Design phase deposit", who: "R. Barzani", doc: "RCT-0089", pm: "Bank", cur: "EUR", a: "+6,500", s: "Verified" },
];

function DailyLog() {
  return (
    <div className="h-full overflow-auto px-6 py-6 space-y-8">
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Ledger</p>
          <h1 className="mt-3 font-display text-5xl leading-none">Daily Log</h1>
          <p className="mt-3 text-muted-foreground font-light max-w-lg">
            Every movement, one line at a time. Sourced, signed and searchable.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full bg-secondary text-foreground px-4 py-2 text-sm hover:bg-accent transition">Filter</button>
          <button className="rounded-full bg-secondary text-foreground px-4 py-2 text-sm hover:bg-accent transition">Export</button>
          <button className="rounded-full bg-forest text-background px-5 py-2 text-sm">+ New entry</button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {["All", "Income", "Expense", "USD", "EUR", "GBP", "IQD", "Verified", "Pending"].map((f, i) => (
          <span key={f} className={`text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-full ${i === 0 ? "bg-forest text-background" : "bg-secondary text-muted-foreground"}`}>
            {f}
          </span>
        ))}
      </div>

      <div className="bg-card rounded-3xl hairline overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.2em] text-muted-foreground bg-secondary/50">
              <th className="py-4 px-6 font-normal">Date</th>
              <th className="py-4 px-6 font-normal">Project</th>
              <th className="py-4 px-6 font-normal">Type</th>
              <th className="py-4 px-6 font-normal">Category</th>
              <th className="py-4 px-6 font-normal">Description</th>
              <th className="py-4 px-6 font-normal">Party</th>
              <th className="py-4 px-6 font-normal">Doc</th>
              <th className="py-4 px-6 font-normal">Method</th>
              <th className="py-4 px-6 font-normal text-right">Amount</th>
              <th className="py-4 px-6 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-border hover:bg-secondary/40 transition">
                <td className="py-4 px-6 text-muted-foreground whitespace-nowrap">{r.d}</td>
                <td className="py-4 px-6">
                  <div className="font-medium whitespace-nowrap">{r.proj}</div>
                  <div className="text-xs text-muted-foreground">{r.p}</div>
                </td>
                <td className="py-4 px-6">
                  <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${r.t === "Income" ? "bg-forest/10 text-forest" : "bg-sand/40 text-forest-deep"}`}>{r.t}</span>
                </td>
                <td className="py-4 px-6 text-muted-foreground">{r.c}</td>
                <td className="py-4 px-6">{r.desc}</td>
                <td className="py-4 px-6 text-muted-foreground">{r.who}</td>
                <td className="py-4 px-6 text-muted-foreground text-xs">{r.doc}</td>
                <td className="py-4 px-6 text-muted-foreground">{r.pm}</td>
                <td className={`py-4 px-6 text-right font-medium whitespace-nowrap ${r.a.startsWith("+") ? "text-forest" : "text-foreground"}`}>
                  {r.a} <span className="text-muted-foreground text-xs ml-1">{r.cur}</span>
                </td>
                <td className="py-4 px-6">
                  <span className={`text-xs whitespace-nowrap ${r.s === "Verified" ? "text-forest" : "text-muted-foreground"}`}>● {r.s}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="px-6 py-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing 7 of 7 entries</span>
          <span>Data Engine v9.2</span>
        </div>
      </div>
    </div>
  );
}
