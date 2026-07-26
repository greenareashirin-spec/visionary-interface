import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Plus } from "lucide-react";

export const Route = createFileRoute("/app/settings")({
  component: Settings,
  head: () => ({ meta: [{ title: "Settings · GreenArea OS" }] }),
});

const groups = [
  { title: "Currencies",         items: ["IQD", "USD", "EUR", "GBP"] },
  { title: "Payment Methods",    items: ["Cash", "Bank", "ZainCash", "FIB", "FastPay"] },
  { title: "Categories",         items: ["Material", "Fuel", "Salary", "Transport", "Labor"] },
  { title: "Evidence Types",     items: ["Receipt", "Invoice", "Bank Transfer", "Cash Voucher", "Contract", "Quotation", "Other"] },
  { title: "Project Phases",     items: ["Phase 1 — Design & Planning", "Phase 2 — Construction", "Phase 3 — Finishing & Handover"] },
  { title: "Project Statuses",   items: ["Planning", "Active", "On Hold", "Waiting for Client", "Waiting for Materials", "Completed", "Cancelled"] },
  { title: "Transaction Types",  items: ["Income", "Expense"] },
  { title: "Departments",        items: ["Projects", "Engineering", "Design", "Operations", "Finance", "Admin"] },
];

const stats = [
  { label: "Vocabularies", value: "8"    },
  { label: "Total Tokens", value: "42"   },
  { label: "Version",      value: "v9.2" },
  { label: "Last Updated", value: "26 Jul" },
];

function Settings() {
  return (
    <div className="flex flex-col h-full min-h-0 px-5 lg:px-6 py-4 gap-3.5">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/55">System</p>
          <h1 className="mt-1 font-display text-[26px] leading-none">Settings</h1>
          <p className="mt-1 text-[12px] text-white/60">The vocabulary of the studio — the exact words used across the OS.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs hover:bg-white/10 transition">Export</button>
          <button className="rounded-full bg-forest text-forest-deep px-4 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:brightness-110 transition">
            <Plus className="h-3.5 w-3.5" /> New Token
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white/[0.04] border border-white/10 p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/55">{s.label}</p>
              <SettingsIcon className="h-3 w-3 text-white/45" />
            </div>
            <p className="mt-1 text-xl font-medium tracking-tight">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl bg-white/[0.04] border border-white/10 flex-1 min-h-0 overflow-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {groups.map((g) => (
            <div key={g.title} className="rounded-xl bg-white/[0.03] border border-white/10 p-3.5">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[10.5px] uppercase tracking-[0.22em] text-white/70">{g.title}</p>
                <button className="text-[10px] uppercase tracking-[0.22em] text-white/50 hover:text-forest transition">Edit</button>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {g.items.map((it) => (
                  <li key={it} className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/75">{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
