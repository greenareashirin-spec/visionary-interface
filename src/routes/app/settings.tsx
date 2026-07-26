import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/settings")({
  component: Settings,
  head: () => ({ meta: [{ title: "Settings · GreenArea OS" }] }),
});

const groups = [
  { title: "Currencies", items: ["IQD", "USD", "EUR", "GBP"] },
  { title: "Payment Methods", items: ["Cash", "Bank", "ZainCash", "FIB", "FastPay"] },
  { title: "Categories", items: ["Material", "Fuel", "Salary", "Transport", "Labor"] },
  { title: "Evidence Types", items: ["Receipt", "Invoice", "Bank Transfer", "Cash Voucher", "Contract", "Quotation", "Other"] },
  { title: "Project Phases", items: ["Phase 1 — Design & Planning", "Phase 2 — Construction", "Phase 3 — Finishing & Handover"] },
  { title: "Project Statuses", items: ["Planning", "Active", "On Hold", "Waiting for Client", "Waiting for Materials", "Completed", "Cancelled"] },
  { title: "Transaction Types", items: ["Income", "Expense"] },
];

function Settings() {
  return (
    <div className="h-full overflow-auto px-6 py-6 space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">System</p>
        <h1 className="mt-3 font-display text-5xl leading-none">Settings</h1>
        <p className="mt-3 text-muted-foreground font-light max-w-lg">
          The vocabulary of the studio — the exact words we use across the operating system.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {groups.map((g) => (
          <section key={g.title} className="bg-card rounded-3xl hairline p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl">{g.title}</h2>
              <button className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-forest">Edit</button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((it) => (
                <li key={it} className="text-sm px-4 py-2 rounded-full bg-secondary text-foreground/80">{it}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
