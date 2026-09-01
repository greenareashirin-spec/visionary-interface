import { useSyncExternalStore } from "react";
import * as XLSX from "xlsx";

export type ErpBalance = { currency: string; income: number; expense: number; net: number };

export type ErpProject = {
  code: string;
  name: string;
  client: string;
  location: string;
  manager: string;
  phase: string;
  status: string;
  startDate: string;
  estFinish: string;
  budgetRaw: string;
  budgetAmount: number | null;
  budgetCurrency: string | null;
  notes: string;
  spentByCurrency: Record<string, number>;
  pct: number | null;
};

export type ErpEmployee = { id: string; name: string; position: string; phone: string; status: string };

export type ErpLogRow = {
  date: string;
  rawDate: Date;
  project: string;
  projectCode: string;
  type: string;
  category: string;
  description: string;
  who: string;
  doc: string;
  payMethod: string;
  currency: string;
  amount: number;
  status: string;
  notes: string;
};

export type ErpData = {
  fileName: string;
  uploadedAt: number;
  totalEntries: number;
  statusCounts: Record<string, number>;
  balances: ErpBalance[];
  unassignedByCurrency: Record<string, number>;
  projects: ErpProject[];
  employees: ErpEmployee[];
  log: ErpLogRow[];
};

/* ─────────────── helpers ─────────────── */

const norm = (v: unknown) => String(v ?? "").trim();
const key = (v: unknown) => norm(v).toLowerCase();

function toDate(v: unknown): Date {
  if (v instanceof Date) return v;
  const s = norm(v);
  if (!s) return new Date(NaN);
  const d = new Date(s);
  return d;
}

function fmtDate(d: Date) {
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function toNumber(v: unknown): number {
  if (typeof v === "number") return isFinite(v) ? v : 0;
  const n = parseFloat(norm(v).replace(/[^0-9.\-]/g, ""));
  return isFinite(n) ? n : 0;
}

type Row = Record<string, unknown>;

/** Read a sheet as objects keyed by lowercase-trimmed header names. */
function sheetRows(wb: XLSX.WorkBook, name: string): Row[] {
  const ws = wb.Sheets[name];
  if (!ws) throw new Error(`Missing sheet: "${name}"`);
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, raw: true, blankrows: false });
  if (!matrix.length) return [];
  const headers = (matrix[0] as unknown[]).map((h) => key(h));
  return matrix.slice(1).map((arr) => {
    const row: Row = {};
    headers.forEach((h, i) => {
      if (h) row[h] = (arr as unknown[])[i];
    });
    return row;
  });
}

const isEmptyRow = (r: Row) => Object.values(r).every((v) => norm(v) === "");

function pick(r: Row, ...names: string[]) {
  for (const n of names) {
    const v = r[n.toLowerCase()];
    if (v !== undefined && norm(v) !== "") return v;
  }
  return "";
}

/* ─────────────── parser ─────────────── */

export async function parseErpWorkbook(file: File): Promise<ErpData> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { cellDates: true });

  for (const required of ["Daily Log", "Projects", "Employees"]) {
    if (!wb.Sheets[required]) throw new Error(`Missing sheet: "${required}"`);
  }

  const projectRows = sheetRows(wb, "Projects").filter((r) => !isEmptyRow(r));
  const logRowsRaw = sheetRows(wb, "Daily Log").filter((r) => !isEmptyRow(r));
  const employeeRows = sheetRows(wb, "Employees").filter((r) => !isEmptyRow(r));

  // project name -> code lookup
  const nameToCode = new Map<string, string>();
  projectRows.forEach((r) => {
    const n = key(pick(r, "Project Name"));
    if (n) nameToCode.set(n, norm(pick(r, "Project Code")));
  });

  const log: ErpLogRow[] = logRowsRaw.map((r) => {
    const rawDate = toDate(pick(r, "Date"));
    const project = norm(pick(r, "Project"));
    return {
      date: fmtDate(rawDate),
      rawDate,
      project,
      projectCode: nameToCode.get(key(project)) ?? "",
      type: norm(pick(r, "Type")),
      category: norm(pick(r, "Category")),
      description: norm(pick(r, "Description")),
      who: norm(pick(r, "Supplier/Employee", "Supplier / Employee", "Supplier")),
      doc: norm(pick(r, "Document No.", "Document No", "Doc No.")),
      payMethod: norm(pick(r, "Pay Method")),
      currency: norm(pick(r, "Currency")),
      amount: toNumber(pick(r, "Amount")),
      status: norm(pick(r, "Status")),
      notes: norm(pick(r, "Notes")),
    };
  });

  log.sort((a, b) => (b.rawDate?.getTime() || 0) - (a.rawDate?.getTime() || 0));

  // balances
  const byCur = new Map<string, ErpBalance>();
  for (const r of log) {
    if (!r.currency) continue;
    const b = byCur.get(r.currency) ?? { currency: r.currency, income: 0, expense: 0, net: 0 };
    if (key(r.type) === "income") b.income += r.amount;
    else if (key(r.type) === "expense") b.expense += r.amount;
    byCur.set(r.currency, b);
  }
  const balances = [...byCur.values()].map((b) => ({ ...b, net: b.income - b.expense }));

  // status counts
  const statusCounts: Record<string, number> = {};
  for (const r of log) {
    if (!r.status) continue;
    statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1;
  }

  // unassigned expenses
  const unassignedByCurrency: Record<string, number> = {};
  for (const r of log) {
    if (r.project || key(r.type) !== "expense" || !r.currency) continue;
    unassignedByCurrency[r.currency] = (unassignedByCurrency[r.currency] ?? 0) + r.amount;
  }

  const projects: ErpProject[] = projectRows.map((r) => {
    const name = norm(pick(r, "Project Name"));
    const budgetRaw = norm(pick(r, "Budget"));
    const m = budgetRaw.match(/[\d.,]+/);
    const budgetAmount = m ? toNumber(m[0].replace(/,/g, "")) || null : null;
    const budgetCurrency = /dollar|usd|\$/i.test(budgetRaw) ? "USD" : null;

    const spentByCurrency: Record<string, number> = {};
    for (const l of log) {
      if (key(l.type) !== "expense" || !l.currency) continue;
      if (key(l.project) !== key(name)) continue;
      spentByCurrency[l.currency] = (spentByCurrency[l.currency] ?? 0) + l.amount;
    }

    const pct =
      budgetCurrency && budgetAmount && spentByCurrency[budgetCurrency] !== undefined
        ? Math.round((spentByCurrency[budgetCurrency] / budgetAmount) * 1000) / 10
        : null;

    return {
      code: norm(pick(r, "Project Code")),
      name,
      client: norm(pick(r, "Client")),
      location: norm(pick(r, "Location")),
      manager: norm(pick(r, "Project Manager")),
      phase: norm(pick(r, "Phase")),
      status: norm(pick(r, "Status")),
      startDate: fmtDate(toDate(pick(r, "Start Date"))) || norm(pick(r, "Start Date")),
      estFinish: fmtDate(toDate(pick(r, "Estimated Finish"))) || norm(pick(r, "Estimated Finish")),
      budgetRaw,
      budgetAmount,
      budgetCurrency,
      notes: norm(pick(r, "Notes")),
      spentByCurrency,
      pct,
    };
  });

  const employees: ErpEmployee[] = employeeRows
    .filter((r) => norm(pick(r, "Name")) !== "")
    .map((r, i) => ({
      id: norm(pick(r, "Employee ID")) || `EID-${String(i + 1).padStart(6, "0")}`,
      name: norm(pick(r, "Name")),
      position: norm(pick(r, "Position")),
      phone: norm(pick(r, "Phone")),
      status: norm(pick(r, "Status")),
    }));

  return {
    fileName: file.name,
    uploadedAt: Date.now(),
    totalEntries: log.length,
    statusCounts,
    balances,
    unassignedByCurrency,
    projects,
    employees,
    log,
  };
}

/* ─────────────── store ─────────────── */

type Status = "idle" | "loading" | "error";
type State = { data: ErpData | null; status: Status; error: string | null };

const KEY = "erp-data:v1";
const listeners = new Set<() => void>();
const EMPTY: State = { data: null, status: "idle", error: null };

let state: State = EMPTY;
let hydrated = false;

function load(): ErpData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ErpData;
    parsed.log = (parsed.log ?? []).map((r) => ({ ...r, rawDate: new Date(r.rawDate) }));
    return parsed;
  } catch {
    return null;
  }
}

function persist(data: ErpData | null) {
  if (typeof window === "undefined") return;
  try {
    if (data) window.localStorage.setItem(KEY, JSON.stringify(data));
    else window.localStorage.removeItem(KEY);
  } catch {
    /* ignore quota errors */
  }
}

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  state = { data: load(), status: "idle", error: null };
}

function set(next: State) {
  state = next;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useErpData(): State {
  return useSyncExternalStore(
    subscribe,
    () => {
      ensureHydrated();
      return state;
    },
    () => EMPTY,
  );
}

export async function uploadErpFile(file: File) {
  ensureHydrated();
  set({ ...state, status: "loading", error: null });
  try {
    const data = await parseErpWorkbook(file);
    persist(data);
    set({ data, status: "idle", error: null });
  } catch (e) {
    set({ ...state, status: "error", error: e instanceof Error ? e.message : "Could not read that file" });
  }
}

export function clearErpData() {
  ensureHydrated();
  persist(null);
  set({ data: null, status: "idle", error: null });
}
