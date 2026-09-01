export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  IQD: "د.ع",
};

export function symbolFor(currency: string) {
  return CURRENCY_SYMBOLS[currency?.toUpperCase()] ?? "";
}

/** e.g. -319,914 USD → "-$319,914" (symbol) or "-319,914 IQD" when no symbol */
export function fmtMoney(amount: number, currency: string) {
  const sym = symbolFor(currency);
  const sign = amount < 0 ? "-" : "";
  const abs = Math.round(Math.abs(amount)).toLocaleString("en-US");
  return sym ? `${sign}${sym}${abs}` : `${sign}${abs} ${currency}`;
}

export function fmtNumber(amount: number) {
  return Math.round(amount).toLocaleString("en-US");
}

/** Case-insensitive lookup in a statusCounts map. Returns [label, count] or null. */
export function findStatus(counts: Record<string, number>, needle: string) {
  const hit = Object.keys(counts).find((k) => k.toLowerCase() === needle.toLowerCase());
  return hit ? ([hit, counts[hit]] as const) : null;
}

/** Two status cards: paid/pending when present, else the two biggest. */
export function statusCards(counts: Record<string, number>, total: number) {
  const paid = findStatus(counts, "paid");
  const pending = findStatus(counts, "pending");
  let picked: (readonly [string, number])[] = [paid, pending].filter(Boolean) as (readonly [string, number])[];
  if (picked.length === 0) {
    picked = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([k, v]) => [k, v] as const);
  }
  return picked.map(([label, count]) => ({
    label,
    value: String(count),
    sub: total ? `${((count / total) * 100).toFixed(1)}% of entries` : "—",
  }));
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function monthYear(d: Date) {
  return isNaN(d.getTime()) ? "" : `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function dateRange(dates: Date[]) {
  const valid = dates.filter((d) => d instanceof Date && !isNaN(d.getTime()));
  if (!valid.length) return "No dates";
  const times = valid.map((d) => d.getTime());
  const a = monthYear(new Date(Math.min(...times)));
  const b = monthYear(new Date(Math.max(...times)));
  return a === b ? a : `${a} – ${b}`;
}

export function dayMon(d: Date) {
  if (!(d instanceof Date) || isNaN(d.getTime())) return "—";
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]}`;
}
