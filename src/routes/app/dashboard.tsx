import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard · GreenArea OS" }] }),
});

const balances = [
  { code: "USD", label: "US Dollar", value: "128,450", symbol: "$" },
  { code: "EUR", label: "Euro", value: "84,220", symbol: "€" },
  { code: "GBP", label: "Pound Sterling", value: "62,180", symbol: "£" },
  { code: "IQD", label: "Iraqi Dinar", value: "184,900,000", symbol: "د.ع" },
];

const recentTx = [
  { d: "26 Jul", p: "GA-014 · Riverside Villa", t: "Expense", c: "Material", a: "-2,480", cur: "USD" },
  { d: "25 Jul", p: "GA-011 · Karrada Rooftop", t: "Income", c: "Client Payment", a: "+18,000", cur: "USD" },
  { d: "25 Jul", p: "GA-014 · Riverside Villa", t: "Expense", c: "Labor", a: "-960", cur: "EUR" },
  { d: "24 Jul", p: "GA-009 · Erbil Courtyard", t: "Expense", c: "Fuel", a: "-140", cur: "IQD" },
  { d: "23 Jul", p: "GA-011 · Karrada Rooftop", t: "Expense", c: "Transport", a: "-320", cur: "USD" },
];

const projects = [
  { code: "GA-014", name: "Riverside Villa", phase: "Phase 2 — Construction", status: "Active", pct: 62 },
  { code: "GA-011", name: "Karrada Rooftop", phase: "Phase 3 — Finishing", status: "Active", pct: 84 },
  { code: "GA-009", name: "Erbil Courtyard", phase: "Phase 1 — Planning", status: "Waiting for Client", pct: 22 },
];

function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-14">
      <header className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Sunday, 26 July</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl leading-none">Good morning.</h1>
          <p className="mt-3 text-muted-foreground font-light max-w-lg">
            A calm overview of the studio — balances, movement and projects underway.
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          {["Today", "Week", "Month", "Year"].map((r, i) => (
            <button key={r} className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] transition ${i === 2 ? "bg-forest text-background" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
              {r}
            </button>
          ))}
        </div>
      </header>

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl">Balances</h2>
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Multi-currency</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden hairline">
          {balances.map((b) => (
            <div key={b.code} className="bg-card p-8">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{b.label}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{b.code}</span>
              </div>
              <p className="mt-6 font-display text-4xl text-foreground">
                <span className="text-muted-foreground text-xl mr-1 align-top">{b.symbol}</span>
                {b.value}
              </p>
              <p className="mt-3 text-xs text-muted-foreground font-light">Reconciled today</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card rounded-3xl p-8 hairline">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl">Cashflow</h2>
              <p className="text-sm text-muted-foreground font-light">Last 30 days · all currencies (USD equiv.)</p>
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-forest" /> Income</span>
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sand" /> Expense</span>
            </div>
          </div>
          <Chart />
        </div>

        <div className="bg-card rounded-3xl p-8 hairline">
          <h2 className="font-display text-2xl mb-6">Active Projects</h2>
          <ul className="space-y-6">
            {projects.map((p) => (
              <li key={p.code}>
                <div className="flex items-baseline justify-between">
                  <p className="font-medium">{p.name}</p>
                  <span className="text-xs text-muted-foreground">{p.code}</span>
                </div>
                <p className="text-xs text-muted-foreground font-light mt-1">{p.phase}</p>
                <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-forest rounded-full" style={{ width: `${p.pct}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{p.status}</span>
                  <span>{p.pct}%</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl">Recent Movement</h2>
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Open daily log →</span>
        </div>
        <div className="bg-card rounded-3xl hairline overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <th className="py-4 px-6 font-normal">Date</th>
                <th className="py-4 px-6 font-normal">Project</th>
                <th className="py-4 px-6 font-normal">Type</th>
                <th className="py-4 px-6 font-normal">Category</th>
                <th className="py-4 px-6 font-normal text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.map((t, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="py-4 px-6 text-muted-foreground">{t.d}</td>
                  <td className="py-4 px-6">{t.p}</td>
                  <td className="py-4 px-6">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${t.t === "Income" ? "bg-forest/10 text-forest" : "bg-sand/40 text-forest-deep"}`}>
                      {t.t}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">{t.c}</td>
                  <td className={`py-4 px-6 text-right font-medium ${t.a.startsWith("+") ? "text-forest" : "text-foreground"}`}>
                    {t.a} <span className="text-muted-foreground text-xs ml-1">{t.cur}</span>
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

function Chart() {
  const income = [30, 42, 38, 55, 48, 62, 58, 70, 65, 78, 72, 88];
  const expense = [22, 28, 32, 30, 40, 38, 44, 42, 50, 48, 55, 60];
  const w = 720, h = 220, pad = 20;
  const step = (w - pad * 2) / (income.length - 1);
  const scale = (v: number) => h - pad - (v / 100) * (h - pad * 2);
  const path = (arr: number[]) => arr.map((v, i) => `${i === 0 ? "M" : "L"}${pad + i * step},${scale(v)}`).join(" ");
  const area = (arr: number[]) => `${path(arr)} L${pad + (arr.length - 1) * step},${h - pad} L${pad},${h - pad} Z`;
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56">
        <defs>
          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.36 0.055 155)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="oklch(0.36 0.055 155)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={pad} x2={w - pad} y1={h * f} y2={h * f} stroke="currentColor" className="text-border" strokeDasharray="2 4" />
        ))}
        <path d={area(income)} fill="url(#g1)" />
        <path d={path(income)} stroke="oklch(0.36 0.055 155)" strokeWidth="2" fill="none" />
        <path d={path(expense)} stroke="oklch(0.72 0.08 80)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}
