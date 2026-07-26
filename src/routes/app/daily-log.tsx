import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, Clock, Wallet, Search, Filter, Plus, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/app/daily-log")({
  component: DailyLog,
  head: () => ({ meta: [{ title: "Daily Log · GreenArea OS" }] }),
});

const stats = [
  { label: "Entries Today",   value: "14",       sub: "Across 4 projects", Icon: BookOpen },
  { label: "Verified",        value: "11",       sub: "78.5%",             Icon: CheckCircle2, tone: "forest" as const },
  { label: "Pending",         value: "3",        sub: "Awaiting proof",    Icon: Clock,        tone: "amber"  as const },
  { label: "Income Today",    value: "$18,000",  sub: "1 payment",         Icon: Wallet,       tone: "forest" as const },
  { label: "Expense Today",   value: "$4,900",   sub: "6 movements",       Icon: Wallet },
  { label: "Net Movement",    value: "+$13,100", sub: "USD equiv.",        Icon: Wallet,       tone: "forest" as const },
];

const rows = [
  { d: "26 Jul", p: "GA-014", proj: "Riverside Villa",  t: "Expense", c: "Material",       desc: "Limestone slabs — Batch 3", who: "Al-Amin Quarry", doc: "INV-2288", pm: "Bank", cur: "USD", a: "-2,480",   s: "Verified" },
  { d: "25 Jul", p: "GA-011", proj: "Karrada Rooftop",  t: "Income",  c: "Client Payment", desc: "Milestone 3 release",       who: "M. Al-Sabah",     doc: "RCT-0091", pm: "Bank", cur: "USD", a: "+18,000",  s: "Verified" },
  { d: "25 Jul", p: "GA-014", proj: "Riverside Villa",  t: "Expense", c: "Labor",          desc: "Week 30 payroll",           who: "Site crew A",     doc: "PR-30",    pm: "Cash", cur: "EUR", a: "-960",     s: "Verified" },
  { d: "24 Jul", p: "GA-009", proj: "Erbil Courtyard",  t: "Expense", c: "Fuel",           desc: "Site pickup refuel",        who: "Kawa Petrol",     doc: "RCT-118",  pm: "Cash", cur: "IQD", a: "-140,000", s: "Pending"  },
  { d: "23 Jul", p: "GA-011", proj: "Karrada Rooftop",  t: "Expense", c: "Transport",      desc: "Delivery — pergola beams",  who: "Nour Freight",    doc: "INV-441",  pm: "FIB",  cur: "USD", a: "-320",     s: "Verified" },
  { d: "22 Jul", p: "GA-014", proj: "Riverside Villa",  t: "Expense", c: "Material",       desc: "Irrigation manifolds",      who: "HydroPart",       doc: "INV-2271", pm: "Bank", cur: "USD", a: "-1,140",   s: "Verified" },
  { d: "22 Jul", p: "GA-009", proj: "Erbil Courtyard",  t: "Income",  c: "Deposit",        desc: "Design phase deposit",      who: "R. Barzani",      doc: "RCT-0089", pm: "Bank", cur: "EUR", a: "+6,500",   s: "Verified" },
];

function DailyLog() {
  return (
    <div className="flex flex-col h-full min-h-0 px-5 lg:px-6 py-4 gap-3.5">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/55">Ledger</p>
          <h1 className="mt-1 font-display text-[26px] leading-none">Daily Log</h1>
          <p className="mt-1 text-[12px] text-white/60">Every movement, one line at a time. Sourced, signed and searchable.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs hover:bg-white/15 transition">Export</button>
          <button className="rounded-full bg-forest text-forest-deep px-4 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:brightness-110 transition">
            <Plus className="h-3.5 w-3.5" /> New Entry
          </button>
        </div>
      </header>

      <section className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-black/32 backdrop-blur-xl border border-white/10 p-3 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/55 min-w-0 truncate">{s.label}</p>
              <s.Icon className="h-3 w-3 text-white/45 shrink-0" />
            </div>
            <p className="mt-1 text-[15px] sm:text-lg md:text-xl font-medium tracking-tight truncate">{s.value}</p>
            <p className={`text-[10.5px] mt-0.5 truncate ${s.tone === "forest" ? "text-forest" : s.tone === "amber" ? "text-amber-300" : "text-white/55"}`}>{s.sub}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl bg-black/32 backdrop-blur-xl border border-white/10 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 flex-wrap">
          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 flex-1 min-w-[200px] max-w-md">
            <Search className="h-3.5 w-3.5 text-white/55" />
            <input placeholder="Search description, party or doc…" className="bg-transparent text-xs outline-none flex-1 placeholder:text-white/45" />
          </div>
          <Select label="All Projects" />
          <Select label="All Currencies" />
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition">
            <Filter className="h-3 w-3" /> More Filters
          </button>
        </div>
        <div className="flex gap-5 px-4 pt-2.5 text-xs border-b border-white/10">
          {["All", "Income", "Expense", "Verified", "Pending"].map((t, i) => (
            <button key={t} className={`pb-2 border-b-2 transition ${i === 0 ? "border-forest text-white" : "border-transparent text-white/55 hover:text-white"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex-1 min-h-0 overflow-auto">
          <table className="w-full text-[12px]">
            <thead className="sticky top-0 bg-[oklch(0.22_0.02_165)]/95 backdrop-blur">
              <tr className="text-left text-[9px] uppercase tracking-[0.22em] text-white/55">
                <th className="py-2.5 px-4 font-normal">Date</th>
                <th className="py-2.5 px-3 font-normal">Project</th>
                <th className="py-2.5 px-3 font-normal">Type</th>
                <th className="py-2.5 px-3 font-normal">Category</th>
                <th className="py-2.5 px-3 font-normal">Description</th>
                <th className="py-2.5 px-3 font-normal">Party</th>
                <th className="py-2.5 px-3 font-normal">Doc</th>
                <th className="py-2.5 px-3 font-normal">Method</th>
                <th className="py-2.5 px-3 font-normal text-right">Amount</th>
                <th className="py-2.5 px-3 font-normal">Status</th>
                <th className="py-2.5 px-4 font-normal text-right"> </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-white/5 hover:bg-black/30 transition">
                  <td className="py-2.5 px-4 text-white/60 whitespace-nowrap">{r.d}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <p className="font-medium">{r.proj}</p>
                    <p className="text-[10.5px] text-white/50">{r.p}</p>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full ${r.t === "Income" ? "bg-forest/15 text-forest" : "bg-amber-500/10 text-amber-200"}`}>{r.t}</span>
                  </td>
                  <td className="py-2.5 px-3 text-white/60">{r.c}</td>
                  <td className="py-2.5 px-3">{r.desc}</td>
                  <td className="py-2.5 px-3 text-white/60">{r.who}</td>
                  <td className="py-2.5 px-3 text-white/55 text-[11px]">{r.doc}</td>
                  <td className="py-2.5 px-3 text-white/60">{r.pm}</td>
                  <td className={`py-2.5 px-3 text-right font-medium whitespace-nowrap ${r.a.startsWith("+") ? "text-forest" : ""}`}>{r.a} <span className="text-white/50 text-[10.5px] ml-1">{r.cur}</span></td>
                  <td className={`py-2.5 px-3 text-[11px] whitespace-nowrap ${r.s === "Verified" ? "text-forest" : "text-amber-300"}`}>● {r.s}</td>
                  <td className="py-2.5 px-4 text-right">
                    <button className="text-white/50 hover:text-white"><MoreHorizontal className="h-3.5 w-3.5 inline" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/55">
          <span>Showing {rows.length} of {rows.length} entries</span>
          <span>Data Engine v9.2</span>
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
