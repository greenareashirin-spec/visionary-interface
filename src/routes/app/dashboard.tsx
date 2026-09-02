import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Wallet, TrendingUp, TrendingDown, Search, Filter, Plus, MoreHorizontal, PieChart, Printer, X } from "lucide-react";
import { useErpData, type ErpLogRow } from "@/lib/erp-store";
import { ErpEmptyBanner } from "@/components/erp-empty-banner";
import { fmtMoney, fmtNumber, symbolFor, statusCards, dayMon } from "@/lib/erp-format";

type DashboardSearch = { tab?: string; currency?: string; project?: string; q?: string };

export const Route = createFileRoute("/app/dashboard")({
  component: Dashboard,
  validateSearch: (search: Record<string, unknown>): DashboardSearch => ({
    tab: typeof search.tab === "string" ? search.tab : undefined,
    currency: typeof search.currency === "string" ? search.currency : undefined,
    project: typeof search.project === "string" ? search.project : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
  }),
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

type TxRow = { d: string; p: string; t: string; c: string; a: string; cur: string; s: string; desc?: string; amount?: number };
type StatCard = {
  label: string;
  value: string;
  sub: string;
  Icon: typeof Wallet;
  tone?: "forest" | "rose" | "amber";
  currency?: string;
};


function Dashboard() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: "/app/dashboard" });
  const tableRef = useRef<HTMLElement | null>(null);
  const [chartOpen, setChartOpen] = useState(false);
  const [drilldown, setDrilldown] = useState<{ key: string; label: string } | null>(null);
  const [tab, setTab] = useState(searchParams.tab ?? "Recent");
  const [query, setQuery] = useState(searchParams.q ?? "");
  const [curFilter, setCurFilter] = useState(searchParams.currency ?? "All Currencies");
  const [projFilter, setProjFilter] = useState(searchParams.project ?? "All Projects");
  const { data } = useErpData();

  useEffect(() => {
    const next: DashboardSearch = {};
    if (tab !== "Recent") next.tab = tab;
    if (curFilter !== "All Currencies") next.currency = curFilter;
    if (projFilter !== "All Projects") next.project = projFilter;
    if (query.trim()) next.q = query.trim();
    navigate({ search: next, replace: true });
  }, [tab, curFilter, projFilter, query, navigate]);

  const scrollToTable = () => tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });


  const view = useMemo(() => {
    if (!data) return { stats: stats as StatCard[], balances, tx: tx as TxRow[] };
    const counts: Record<string, number> = {};
    for (const r of data.log) counts[r.currency] = (counts[r.currency] ?? 0) + 1;

    const sorted = [...data.balances].sort((a, b) => Math.abs(b.net) - Math.abs(a.net)).slice(0, 4);
    const balanceStats = sorted.map((b) => ({
      label: `${b.currency} Balance`,
      value: fmtMoney(b.net, b.currency),
      sub: `${counts[b.currency] ?? 0} entries`,
      Icon: Wallet,
      tone: (b.net < 0 ? "rose" : "forest") as "rose" | "forest",
      currency: b.currency,
    }));
    const extra = statusCards(data.statusCounts, data.totalEntries).map((s) => ({
      ...s,
      Icon: TrendingUp,
      tone: undefined as undefined,
    }));

    return {
      stats: [...balanceStats, ...extra] as StatCard[],

      balances: data.balances.map((b) => ({
        code: b.currency,
        value: fmtNumber(b.net),
        symbol: symbolFor(b.currency),
        pct: "",
      })),
      tx: data.log.map((r) => ({
        d: dayMon(r.rawDate),
        p: `${r.projectCode ? r.projectCode + " · " : ""}${r.project || "Unassigned"}`,
        t: r.type,
        c: r.category,
        a: `${r.type.toLowerCase() === "expense" ? "-" : "+"}${fmtNumber(r.amount)}`,
        cur: r.currency,
        s: r.status,
        desc: r.description,
        amount: r.amount,
      })) as TxRow[],
    };
  }, [data]);

  const { stats: statList, balances: balanceList, tx: allTx } = view;

  const txList = useMemo(() => {
    if (!data) return allTx.slice(0, 8);
    const q = query.trim().toLowerCase();
    return allTx.filter((r) => {
      if (tab === "Income" && r.t !== "Income") return false;
      if (tab === "Expense" && r.t !== "Expense") return false;
      if (tab === "Pending" && !(r.s ?? "").toLowerCase().includes("pending")) return false;
      if (curFilter !== "All Currencies" && r.cur !== curFilter) return false;
      if (projFilter !== "All Projects" && !r.p.toLowerCase().includes(projFilter.toLowerCase())) return false;
      if (q && !`${r.p} ${r.c} ${r.desc ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allTx, data, query, tab, curFilter, projFilter]);

  const monthly = useMemo(() => monthlySeries(data), [data]);

  const exportCsv = () => {
    if (!data) return;
    const head = ["Date", "Project", "Type", "Category", "Amount", "Currency", "Status"];
    const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      head.join(","),
      ...txList.map((r) => [r.d, r.p, r.t, r.c, String(r.amount ?? r.a), r.cur, r.s].map(esc).join(",")),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "greenarea-finance-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full min-h-0 px-3 md:px-5 lg:px-6 py-2.5 md:py-4 gap-2 md:gap-3.5">
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
          <button
            onClick={exportCsv}
            disabled={!data}
            title={data ? "Export visible rows as CSV" : "No ERP data to export yet"}
            className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs hover:bg-white/15 transition disabled:opacity-40 disabled:hover:bg-white/5"
          >
            Export
          </button>
          <button className="rounded-full bg-forest text-forest-deep px-4 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:brightness-110 transition">
            <Plus className="h-3.5 w-3.5" /> New Entry
          </button>
        </div>
      </header>
      {chartOpen && <CostsChartModal onClose={() => setChartOpen(false)} />}

      <section className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2">
        {statList.map((s) => (
          <div key={s.label} className="rounded-2xl bg-black/32 backdrop-blur-xl border border-white/10 p-2 md:p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[9px] uppercase tracking-[0.12em] md:tracking-[0.22em] text-white/55">{s.label}</p>
              <s.Icon className="h-3 w-3 text-white/45" />
            </div>
            <p className="mt-0.5 md:mt-1 text-[13px] md:text-[15px] lg:text-lg xl:text-xl font-medium tracking-tight">{s.value}</p>
            {(() => {
              const toneCls = s.tone === "forest" ? "text-forest" : s.tone === "amber" ? "text-amber-300" : s.tone === "rose" ? "text-rose-300" : "text-white/55";
              const isPending = /pending/i.test(s.label);
              const isPaid = /paid|verified/i.test(s.label);
              if (s.currency) {
                return (
                  <button
                    onClick={() => { setCurFilter(s.currency!); setTab("Recent"); scrollToTable(); }}
                    className={`text-[10.5px] mt-0.5 text-left hover:underline ${toneCls}`}
                  >
                    {s.sub}
                  </button>
                );
              }
              if (isPending || isPaid) {
                return (
                  <button
                    onClick={() => { setTab(isPending ? "Pending" : "Recent"); setCurFilter("All Currencies"); scrollToTable(); }}
                    className={`text-[10.5px] mt-0.5 text-left hover:underline ${toneCls}`}
                  >
                    {s.sub}
                  </button>
                );
              }
              return <p className={`text-[10.5px] mt-0.5 ${toneCls}`}>{s.sub}</p>;
            })()}

          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-2.5">
        <div className="lg:col-span-2 rounded-2xl bg-black/32 backdrop-blur-xl border border-white/10 p-3 md:p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[9px] uppercase tracking-[0.12em] md:tracking-[0.22em] text-white/55">
                {monthly ? "Cashflow · by month" : "Cashflow · 30 days"}
              </p>
              <p className="text-[11px] text-white/50">
                {monthly ? `${monthly.currency} · by month` : "Native currencies · ask OS to convert to USD"}
              </p>
            </div>
            <div className="flex gap-3 text-[10px] text-white/60">
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-forest" /> Income</span>
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-rose-400" /> Expense</span>
            </div>
          </div>
          {monthly ? (
            <MonthBars series={monthly.months} onSelect={(key, label) => setDrilldown({ key, label })} />
          ) : (
            <Chart />
          )}
          {drilldown && monthly && data && (
            <div className="mt-3 border-t border-white/10 pt-3">
              <MonthDrilldownModal
                monthKey={drilldown.key}
                monthLabel={drilldown.label}
                currency={monthly.currency}
                log={data.log}
                onClose={() => setDrilldown(null)}
              />
            </div>
          )}
        </div>
        <div className="rounded-2xl bg-black/32 backdrop-blur-xl border border-white/10 p-3 md:p-4">
          <p className="text-[9px] uppercase tracking-[0.12em] md:tracking-[0.22em] text-white/55 mb-2">Balances · Multi-currency</p>
          <ul className="divide-y divide-white/5">
            {balanceList.map((b) => (
              <li key={b.code} className="py-2 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-white/60">{b.code}</p>
                  <p className="text-[13px] font-medium"><span className="text-white/50 mr-0.5">{b.symbol}</span>{b.value}</p>
                </div>
                {b.pct && <span className={`text-[10.5px] ${b.pct.startsWith("+") ? "text-forest" : "text-rose-300"}`}>{b.pct}</span>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section ref={tableRef} className="rounded-2xl bg-black/32 backdrop-blur-xl border border-white/10 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 flex-wrap">
          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 flex-1 min-w-[200px] max-w-md">
            <Search className="h-3.5 w-3.5 text-white/55" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search entries…"
              className="bg-transparent text-xs outline-none flex-1 placeholder:text-white/45"
            />
          </div>
          <Select
            label="All Currencies"
            value={curFilter}
            onChange={setCurFilter}
            options={data ? data.balances.map((b) => b.currency) : []}
          />
          <Select
            label="All Projects"
            value={projFilter}
            onChange={setProjFilter}
            options={data ? data.projects.map((p) => p.name).filter(Boolean) : []}
          />
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition">
            <Filter className="h-3 w-3" /> More Filters
          </button>
        </div>
        <div className="flex gap-5 px-4 pt-2.5 text-xs border-b border-white/10">
          {["Recent", "Income", "Expense", "Pending"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2 border-b-2 transition ${tab === t ? "border-forest text-white" : "border-transparent text-white/55 hover:text-white"}`}
            >
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
              {txList.map((r, i) => (
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
              {txList.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-[12px] text-white/45">No entries match these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value?: string; onChange?: (v: string) => void; options?: string[] }) {
  if (!options || options.length === 0) {
    return (
      <button className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition flex items-center gap-1.5">
        {label} <span className="text-white/50 text-[10px]">▾</span>
      </button>
    );
  }
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition outline-none [&>option]:bg-[oklch(0.20_0.02_165)]"
    >
      <option value={label}>{label}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

/* ─────────────── monthly cashflow ─────────────── */

function monthlySeries(data: ReturnType<typeof useErpData>["data"]) {
  if (!data || !data.log.length) return null;
  const counts: Record<string, number> = {};
  for (const r of data.log) if (r.currency) counts[r.currency] = (counts[r.currency] ?? 0) + 1;
  const currency = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!currency) return null;

  const buckets = new Map<string, MonthBucket>();
  for (const r of data.log) {
    if (r.currency !== currency) continue;
    const d = r.rawDate instanceof Date ? r.rawDate : new Date(r.rawDate);
    if (isNaN(d.getTime())) continue;
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const b = buckets.get(k) ?? {
      key: k,
      label: d.toLocaleDateString("en-US", { month: "short" }),
      fullLabel: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      income: 0,
      expense: 0,
    };
    if (r.type.toLowerCase() === "income") b.income += r.amount;
    else if (r.type.toLowerCase() === "expense") b.expense += r.amount;
    buckets.set(k, b);
  }
  const months = [...buckets.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-6).map(([, v]) => v);
  if (!months.length) return null;
  return { currency, months };
}

type MonthBucket = { key?: string; label: string; fullLabel?: string; income: number; expense: number };

function MonthBars({
  series,
  onSelect,
  scroll,
}: {
  series: MonthBucket[];
  onSelect?: (key: string, fullLabel: string) => void;
  scroll?: boolean;
}) {
  const max = Math.max(1, ...series.flatMap((m) => [m.income, m.expense]));
  return (
    <div className={`h-20 md:h-24 lg:h-28 flex items-end gap-3 px-1 ${scroll ? "overflow-x-auto" : ""}`}>
      {series.map((m, i) => (
        <div
          key={m.key ?? i}
          role={onSelect ? "button" : undefined}
          tabIndex={onSelect ? 0 : undefined}
          onClick={onSelect ? () => onSelect(m.key ?? m.label, m.fullLabel ?? m.label) : undefined}
          className={`flex flex-col items-center gap-1.5 h-full justify-end rounded-lg transition ${
            scroll ? "min-w-[54px] shrink-0 flex-1" : "flex-1"
          } ${onSelect ? "cursor-pointer hover:bg-white/8" : ""}`}
        >
          <div className="w-full flex items-end justify-center gap-1 h-full">
            <div
              className="w-1/3 max-w-[18px] rounded-t bg-forest/85"
              style={{ height: `${Math.max(2, (m.income / max) * 100)}%` }}
              title={`Income ${fmtNumber(m.income)}`}
            />
            <div
              className="w-1/3 max-w-[18px] rounded-t bg-rose-400/80"
              style={{ height: `${Math.max(2, (m.expense / max) * 100)}%` }}
              title={`Expense ${fmtNumber(m.expense)}`}
            />
          </div>
          <span
            title={m.fullLabel ?? m.label}
            className="max-w-full truncate text-[9px] uppercase tracking-[0.16em] text-white/50"
          >
            {m.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function MonthDrilldownModal({
  monthKey,
  monthLabel,
  currency,
  log,
  onClose,
}: {
  monthKey: string;
  monthLabel: string;
  currency: string;
  log: ErpLogRow[];
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"Category" | "Project">("Category");

  const rows = useMemo(
    () =>
      log.filter((r) => {
        if (r.currency !== currency) return false;
        const d = r.rawDate instanceof Date ? r.rawDate : new Date(r.rawDate);
        if (isNaN(d.getTime())) return false;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === monthKey;
      }),
    [log, currency, monthKey],
  );

  const totals = useMemo(() => {
    let income = 0, expense = 0;
    for (const r of rows) {
      if (r.type.toLowerCase() === "income") income += r.amount;
      else if (r.type.toLowerCase() === "expense") expense += r.amount;
    }
    return { income, expense };
  }, [rows]);

  const groups = useMemo(() => {
    const m = new Map<string, MonthBucket>();
    for (const r of rows) {
      const name = (mode === "Category" ? r.category || "Uncategorized" : r.project || "Unassigned");
      const g = m.get(name) ?? { key: name, label: name, fullLabel: name, income: 0, expense: 0 };
      if (r.type.toLowerCase() === "income") g.income += r.amount;
      else if (r.type.toLowerCase() === "expense") g.expense += r.amount;
      m.set(name, g);
    }
    return [...m.values()].sort((a, b) => b.income + b.expense - (a.income + a.expense));
  }, [rows, mode]);

  return (
    <div className="w-full">
      <div className="relative w-full">
        <button
          onClick={onClose}
          aria-label="Close breakdown"
          className="absolute top-0 right-0 z-10 rounded-full bg-white/10 p-1.5 text-white/70 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <div className="mb-3 pr-10">
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/55">Cashflow</p>
          <h2 className="mt-1 font-display text-[22px] leading-none">{monthLabel} · {currency}</h2>
          <p className="mt-1 text-[12px] text-white/60">
            Income <span className="text-forest">{fmtMoney(totals.income, currency)}</span> · Expense{" "}
            <span className="text-rose-300">{fmtMoney(totals.expense, currency)}</span>
          </p>
        </div>

        <div className="mb-4 inline-flex rounded-full bg-white/5 border border-white/10 p-0.5 text-[11px]">
          {(["Category", "Project"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full px-3.5 py-1 transition ${mode === m ? "bg-white/15 text-white" : "text-white/60 hover:text-white"}`}
            >
              By {m}
            </button>
          ))}
        </div>

        {groups.length ? (
          <MonthBars series={groups} scroll={groups.length > 6} />
        ) : (
          <p className="py-10 text-center text-[12px] text-white/55">No entries for this month.</p>
        )}
      </div>
    </div>
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
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20 md:h-24 lg:h-28">
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

const PALETTE = ["#7CB342", "#F59E0B", "#38BDF8", "#A78BFA", "#F97316", "#34D399", "#F472B6", "#FBBF24", "#60A5FA", "#FB7185"];
const DEFAULT_RATES: Record<string, string> = { USD: "1", EUR: "1.08", GBP: "1.27", IQD: "0.00068" };

function CostsChartModal({ onClose }: { onClose: () => void }) {
  const { data } = useErpData();
  // rates expressed as "1 <cur> = X USD"
  const [rateMap, setRateMap] = useState<Record<string, string>>(DEFAULT_RATES);
  const [converted, setConverted] = useState(false);

  // category → currency → total expense
  const real = useMemo(() => {
    if (!data) return null;
    const byCat: Record<string, Record<string, number>> = {};
    const byCur: Record<string, number> = {};
    for (const r of data.log) {
      if (r.type.toLowerCase() !== "expense" || !r.currency) continue;
      const cat = r.category || "Other";
      byCat[cat] = byCat[cat] ?? {};
      byCat[cat][r.currency] = (byCat[cat][r.currency] ?? 0) + r.amount;
      byCur[r.currency] = (byCur[r.currency] ?? 0) + r.amount;
    }
    const currencies = Object.entries(byCur).sort((a, b) => b[1] - a[1]).map(([c]) => c);
    if (!currencies.length) return null;
    return { byCat, currencies };
  }, [data]);

  const [cur, setCur] = useState<string>("");
  const selCur = cur || real?.currencies[0] || "USD";

  const rate = (c: string) => (c === "USD" ? 1 : Number(rateMap[c] ?? "0") || 0);

  const slices = useMemo(() => {
    if (!real) {
      return costRows.map((r) => ({
        name: r.category,
        value: converted ? r.usd + r.eur * rate("EUR") + r.gbp * rate("GBP") + r.iqd * rate("IQD") : r.usd,
        color: categoryColors[r.category],
      }));
    }
    return Object.entries(real.byCat)
      .map(([name, perCur], i) => ({
        name,
        value: converted
          ? Object.entries(perCur).reduce((s, [c, v]) => s + v * rate(c), 0)
          : perCur[selCur] ?? 0,
        color: categoryColors[name] ?? PALETTE[i % PALETTE.length],
      }))
      .filter((s) => s.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [real, converted, rateMap, selCur]);

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

  const fmt = (n: number) =>
    converted || !real ? "$" + Math.round(n).toLocaleString() : fmtMoney(n, selCur);


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
              : real
                ? <>{selCur} · Total <span className="text-white">{fmt(total)}</span>{real.currencies.length > 1 ? " — switch currency below" : ""}</>
                : <>USD-native only · Enter Ako's exchange rates below, then convert.</>}
          </p>
          {real && real.currencies.length > 1 && !converted && (
            <div className="mt-2 flex gap-1.5 flex-wrap">
              {real.currencies.map((c) => (
                <button
                  key={c}
                  onClick={() => setCur(c)}
                  className={`text-[11px] px-3 py-1 rounded-full border transition ${
                    c === selCur ? "bg-forest text-forest-deep border-transparent" : "bg-white/5 border-white/10 hover:bg-white/15"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
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
                {(real ? real.currencies.filter((c) => c !== "USD") : ["EUR", "GBP", "IQD"]).map((c) => (
                  <RateInput
                    key={c}
                    label={c}
                    value={rateMap[c] ?? ""}
                    onChange={(v) => setRateMap((m) => ({ ...m, [c]: v }))}
                    placeholder={DEFAULT_RATES[c] ?? "1"}
                  />
                ))}
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
        </>
        )}

        {mode !== "overview" && (
          <PivotBreakdown
            mode={mode}
            log={data?.log ?? []}
            names={mode === "project" ? pivotProjects : pivotCategories}
          />
        )}

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
