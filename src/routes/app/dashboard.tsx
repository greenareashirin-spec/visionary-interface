import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Wallet, TrendingUp, TrendingDown, Search, Filter, Plus, MoreHorizontal, PieChart, X } from "lucide-react";
import { useErpData } from "@/lib/erp-store";
import { ErpEmptyBanner } from "@/components/erp-empty-banner";
import { fmtMoney, fmtNumber, symbolFor, statusCards, dayMon } from "@/lib/erp-format";


export const Route = createFileRoute("/app/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Finance · GreenArea OS" }] }),
});

const stats = [
  { label: "USD Balance", value: "$128,450",     sub: "+12.4% MoM", Icon: Wallet,     tone: "forest" as const },
  { label: "EUR Balance", value: "€84,220",      sub: "+3.2%",      Icon: Wallet,     tone: "forest" as const },
  { label: "GBP Balance", value: "£62,180",      sub: "-1.1%",      Icon: Wallet,     tone: "rose"   as const },
  { label: "IQD Balance", value: "د.ع 184.9m",   sub: "+0.6%",      Icon: Wallet,     tone: "forest" as const },
  { label: "Receivables", value: "5 open",       sub: "Mixed cur.", Icon: TrendingUp, tone: "amber"  as const },
  { label: "Payables",    value: "3 due",        sub: "Mixed cur.", Icon: TrendingDown },
];

const balances = [
  { code: "USD", value: "128,450",     symbol: "$",   pct: "+12.4%" },
  { code: "EUR", value: "84,220",      symbol: "€",   pct: "+3.2%"  },
  { code: "GBP", value: "62,180",      symbol: "£",   pct: "-1.1%"  },
  { code: "IQD", value: "184,900,000", symbol: "د.ع", pct: "+0.6%"  },
];

const tx = [
  { d: "26 Jul", p: "GA-014 · Riverside Villa", t: "Expense", c: "Material",       a: "-2,480",  cur: "USD", s: "Verified" },
  { d: "25 Jul", p: "GA-011 · Karrada Rooftop", t: "Income",  c: "Client Payment", a: "+18,000", cur: "USD", s: "Verified" },
  { d: "25 Jul", p: "GA-014 · Riverside Villa", t: "Expense", c: "Labor",          a: "-960",    cur: "EUR", s: "Verified" },
  { d: "24 Jul", p: "GA-009 · Erbil Courtyard", t: "Expense", c: "Fuel",           a: "-140,000",cur: "IQD", s: "Pending"  },
  { d: "23 Jul", p: "GA-011 · Karrada Rooftop", t: "Expense", c: "Transport",      a: "-320",    cur: "USD", s: "Verified" },
  { d: "22 Jul", p: "GA-014 · Riverside Villa", t: "Expense", c: "Material",       a: "-1,140",  cur: "USD", s: "Verified" },
  { d: "22 Jul", p: "GA-009 · Erbil Courtyard", t: "Income",  c: "Deposit",        a: "+6,500",  cur: "EUR", s: "Verified" },
];

function Dashboard() {
  const [chartOpen, setChartOpen] = useState(false);
  const { data } = useErpData();

  const view = useMemo(() => {
    if (!data) return { stats, balances, tx };
    const counts: Record<string, number> = {};
    for (const r of data.log) counts[r.currency] = (counts[r.currency] ?? 0) + 1;

    const sorted = [...data.balances].sort((a, b) => Math.abs(b.net) - Math.abs(a.net)).slice(0, 4);
    const balanceStats = sorted.map((b) => ({
      label: `${b.currency} Balance`,
      value: fmtMoney(b.net, b.currency),
      sub: `${counts[b.currency] ?? 0} entries`,
      Icon: Wallet,
      tone: (b.net < 0 ? "rose" : "forest") as "rose" | "forest",
    }));
    const extra = statusCards(data.statusCounts, data.totalEntries).map((s) => ({
      ...s,
      Icon: TrendingUp,
      tone: undefined as undefined,
    }));

    return {
      stats: [...balanceStats, ...extra] as typeof stats,
      balances: data.balances.map((b) => ({
        code: b.currency,
        value: fmtNumber(b.net),
        symbol: symbolFor(b.currency),
        pct: "",
      })),
      tx: data.log.slice(0, 8).map((r) => ({
        d: dayMon(r.rawDate),
        p: `${r.projectCode ? r.projectCode + " · " : ""}${r.project || "Unassigned"}`,
        t: r.type,
        c: r.category,
        a: `${r.type.toLowerCase() === "expense" ? "-" : "+"}${fmtNumber(r.amount)}`,
        cur: r.currency,
        s: r.status,
      })),
    };
  }, [data]);

  const { stats: statList, balances: balanceList, tx: txList } = view;

  return (
    <div className="flex flex-col h-full min-h-0 px-5 lg:px-6 py-4 gap-3.5">
      <ErpEmptyBanner />

      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/55">Finance</p>
          <h1 className="mt-1 font-display text-[26px] leading-none">Financial Overview</h1>
          <p className="mt-1 text-[12px] text-white/60">Balances, cashflow and recent movement.</p>
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
            <Plus className="h-3.5 w-3.5" /> New Entry
          </button>
        </div>
      </header>
      {chartOpen && <CostsChartModal onClose={() => setChartOpen(false)} />}

      <section className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2.5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-black/32 backdrop-blur-xl border border-white/10 p-2 md:p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[9px] uppercase tracking-[0.12em] md:tracking-[0.22em] text-white/55">{s.label}</p>
              <s.Icon className="h-3 w-3 text-white/45" />
            </div>
            <p className="mt-1 text-[13px] md:text-[15px] lg:text-lg xl:text-xl font-medium tracking-tight">{s.value}</p>
            <p className={`text-[10.5px] mt-0.5 ${s.tone === "forest" ? "text-forest" : s.tone === "amber" ? "text-amber-300" : s.tone === "rose" ? "text-rose-300" : "text-white/55"}`}>{s.sub}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
        <div className="lg:col-span-2 rounded-2xl bg-black/32 backdrop-blur-xl border border-white/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[9px] uppercase tracking-[0.12em] md:tracking-[0.22em] text-white/55">Cashflow · 30 days</p>
              <p className="text-[11px] text-white/50">Native currencies · ask OS to convert to USD</p>
            </div>
            <div className="flex gap-3 text-[10px] text-white/60">
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-forest" /> Income</span>
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-sand" /> Expense</span>
            </div>
          </div>
          <Chart />
        </div>
        <div className="rounded-2xl bg-black/32 backdrop-blur-xl border border-white/10 p-4">
          <p className="text-[9px] uppercase tracking-[0.12em] md:tracking-[0.22em] text-white/55 mb-2">Balances · Multi-currency</p>
          <ul className="divide-y divide-white/5">
            {balances.map((b) => (
              <li key={b.code} className="py-2 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-white/60">{b.code}</p>
                  <p className="text-[13px] font-medium"><span className="text-white/50 mr-0.5">{b.symbol}</span>{b.value}</p>
                </div>
                <span className={`text-[10.5px] ${b.pct.startsWith("+") ? "text-forest" : "text-rose-300"}`}>{b.pct}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl bg-black/32 backdrop-blur-xl border border-white/10 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 flex-wrap">
          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 flex-1 min-w-[200px] max-w-md">
            <Search className="h-3.5 w-3.5 text-white/55" />
            <input placeholder="Search entries…" className="bg-transparent text-xs outline-none flex-1 placeholder:text-white/45" />
          </div>
          <Select label="All Currencies" />
          <Select label="All Projects" />
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition">
            <Filter className="h-3 w-3" /> More Filters
          </button>
        </div>
        <div className="flex gap-5 px-4 pt-2.5 text-xs border-b border-white/10">
          {["Recent", "Income", "Expense", "Pending"].map((t, i) => (
            <button key={t} className={`pb-2 border-b-2 transition ${i === 0 ? "border-forest text-white" : "border-transparent text-white/55 hover:text-white"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex-1 min-h-0 overflow-auto">
          <table className="w-full text-[12px]">
            <thead className="sticky top-0 bg-[oklch(0.22_0.02_165)]/95 backdrop-blur">
              <tr className="text-left text-[9px] uppercase tracking-[0.12em] md:tracking-[0.22em] text-white/55">
                <th className="py-2.5 px-4 font-normal">Date</th>
                <th className="py-2.5 px-3 font-normal">Project</th>
                <th className="py-2.5 px-3 font-normal">Type</th>
                <th className="py-2.5 px-3 font-normal">Category</th>
                <th className="py-2.5 px-3 font-normal">Status</th>
                <th className="py-2.5 px-3 font-normal text-right">Amount</th>
                <th className="py-2.5 px-4 font-normal text-right"> </th>
              </tr>
            </thead>
            <tbody>
              {tx.map((r, i) => (
                <tr key={i} className="border-t border-white/5 hover:bg-black/30 transition">
                  <td className="py-2.5 px-4 text-white/60">{r.d}</td>
                  <td className="py-2.5 px-3">{r.p}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full ${r.t === "Income" ? "bg-forest/15 text-forest" : "bg-amber-500/10 text-amber-200"}`}>{r.t}</span>
                  </td>
                  <td className="py-2.5 px-3 text-white/60">{r.c}</td>
                  <td className="py-2.5 px-3 text-[11px] text-white/60">● {r.s}</td>
                  <td className={`py-2.5 px-3 text-right font-medium ${r.a.startsWith("+") ? "text-forest" : ""}`}>{r.a} <span className="text-white/50 text-[10.5px] ml-1">{r.cur}</span></td>
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

function Chart() {
  const income = [30, 42, 38, 55, 48, 62, 58, 70, 65, 78, 72, 88];
  const expense = [22, 28, 32, 30, 40, 38, 44, 42, 50, 48, 55, 60];
  const w = 720, h = 150, pad = 14;
  const step = (w - pad * 2) / (income.length - 1);
  const scale = (v: number) => h - pad - (v / 100) * (h - pad * 2);
  const path = (arr: number[]) => arr.map((v, i) => `${i === 0 ? "M" : "L"}${pad + i * step},${scale(v)}`).join(" ");
  const area = (arr: number[]) => `${path(arr)} L${pad + (arr.length - 1) * step},${h - pad} L${pad},${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-36">
      <defs>
        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.14 145)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="oklch(0.72 0.14 145)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={pad} x2={w - pad} y1={h * f} y2={h * f} stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4" />
      ))}
      <path d={area(income)} fill="url(#g1)" />
      <path d={path(income)} stroke="oklch(0.72 0.14 145)" strokeWidth="1.6" fill="none" />
      <path d={path(expense)} stroke="oklch(0.72 0.08 80)" strokeWidth="1.4" fill="none" strokeDasharray="4 4" />
    </svg>
  );
}

/* ─────────────── Costs by category (multi-currency → USD) ─────────────── */
type CostRow = { category: string; usd: number; eur: number; gbp: number; iqd: number };

const costRows: CostRow[] = [
  { category: "Projects",  usd: 148_200, eur: 22_400, gbp:  8_600, iqd:          0 },
  { category: "Materials", usd:  62_400, eur: 14_800, gbp:  4_200, iqd: 42_000_000 },
  { category: "Fleet",     usd:  18_600, eur:  2_100, gbp:      0, iqd: 68_000_000 },
  { category: "Labor",     usd:  84_500, eur:  9_600, gbp:  3_100, iqd: 55_000_000 },
  { category: "Other",     usd:  12_300, eur:  1_800, gbp:    900, iqd: 12_500_000 },
];

const categoryColors: Record<string, string> = {
  Projects:  "#7CB342",
  Materials: "#F59E0B",
  Fleet:     "#38BDF8",
  Labor:     "#A78BFA",
  Other:     "#F97316",
};

function CostsChartModal({ onClose }: { onClose: () => void }) {
  // rates expressed as "1 <cur> = X USD"
  const [eurRate, setEurRate] = useState("1.08");
  const [gbpRate, setGbpRate] = useState("1.27");
  const [iqdRate, setIqdRate] = useState("0.00068"); // Ako's parallel market rate
  const [converted, setConverted] = useState(false);

  const rates = {
    eur: Number(eurRate) || 0,
    gbp: Number(gbpRate) || 0,
    iqd: Number(iqdRate) || 0,
  };

  const slices = useMemo(() => {
    return costRows.map((r) => {
      const usdEquiv = converted
        ? r.usd + r.eur * rates.eur + r.gbp * rates.gbp + r.iqd * rates.iqd
        : r.usd; // before conversion, show USD-native only
      return { name: r.category, value: usdEquiv, color: categoryColors[r.category] };
    });
  }, [converted, eurRate, gbpRate, iqdRate]);

  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const R = 120, cx = 160, cy = 160;
  let angle = -Math.PI / 2;
  const arcs = slices.map((s) => {
    const frac = s.value / total;
    const sweep = frac * Math.PI * 2;
    const start = angle;
    const end = start + sweep;
    const large = sweep > Math.PI ? 1 : 0;
    const mid = (start + end) / 2;
    const x1 = cx + R * Math.cos(start), y1 = cy + R * Math.sin(start);
    const x2 = cx + R * Math.cos(end),   y2 = cy + R * Math.sin(end);
    const d = frac >= 0.999
      ? `M ${cx - R} ${cy} A ${R} ${R} 0 1 1 ${cx + R} ${cy} A ${R} ${R} 0 1 1 ${cx - R} ${cy} Z`
      : `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`;
    const lr = R + 22;
    const lx = cx + lr * Math.cos(mid);
    const ly = cy + lr * Math.sin(mid);
    const anchor = Math.cos(mid) > 0.1 ? "start" : Math.cos(mid) < -0.1 ? "end" : "middle";
    angle = end;
    return { ...s, d, frac, lx, ly, anchor };
  });

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString();

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-3xl bg-[oklch(0.20_0.02_165)] border border-white/10 p-6 max-h-[90vh] overflow-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white">
          <X className="h-4 w-4" />
        </button>
        <div className="mb-4">
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/55">Finance</p>
          <h2 className="mt-1 font-display text-[22px] leading-none">Costs by Category</h2>
          <p className="mt-1 text-[12px] text-white/60">
            {converted
              ? <>Converted to USD · Total <span className="text-white">{fmt(total)}</span></>
              : <>USD-native only · Enter Ako's exchange rates below, then convert.</>}
          </p>
        </div>

        <div className="grid md:grid-cols-[320px_1fr] gap-6 items-start">
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

          <div className="space-y-4">
            <div className="rounded-2xl bg-black/30 border border-white/10 p-3">
              <p className="text-[9px] uppercase tracking-[0.12em] md:tracking-[0.22em] text-white/55 mb-2">Ako's Exchange Rates (1 unit → USD)</p>
              <div className="grid grid-cols-3 gap-2">
                <RateInput label="EUR" value={eurRate} onChange={setEurRate} placeholder="1.08" />
                <RateInput label="GBP" value={gbpRate} onChange={setGbpRate} placeholder="1.27" />
                <RateInput label="IQD" value={iqdRate} onChange={setIqdRate} placeholder="0.00068" />
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setConverted(true)}
                  className="rounded-full bg-forest text-forest-deep px-4 py-1.5 text-xs font-medium hover:brightness-110 transition"
                >
                  Convert & recalc chart
                </button>
                <button
                  onClick={() => setConverted(false)}
                  className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs hover:bg-white/15 transition"
                >
                  Reset
                </button>
              </div>
            </div>

            <ul className="space-y-1.5">
              {arcs.map((a, i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl bg-black/30 border border-white/10 px-3 py-2">
                  <span className="h-3 w-3 rounded-sm shrink-0" style={{ background: a.color }} />
                  <p className="flex-1 text-[12.5px]">{a.name}</p>
                  <div className="text-right">
                    <p className="text-[13px] font-medium">{fmt(a.value)}</p>
                    <p className="text-[10px] text-white/50">{(a.frac * 100).toFixed(1)}%</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function RateInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-[0.12em] md:tracking-[0.22em] text-white/55">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode="decimal"
        className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-[12px] outline-none focus:border-forest/60"
      />
    </label>
  );
}
