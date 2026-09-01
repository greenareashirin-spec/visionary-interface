import { useSyncExternalStore } from "react";

export type LocalEmployee = {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  status: string;
  createdAt: number;
  hasContract: boolean;
};

const KEY = "local-employees:v1";
const listeners = new Set<() => void>();
const EMPTY: LocalEmployee[] = [];

let state: LocalEmployee[] = EMPTY;
let hydrated = false;

function load(): LocalEmployee[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as LocalEmployee[];
    return Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
}

function persist(list: LocalEmployee[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore quota errors */
  }
}

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  state = load();
}

function set(next: LocalEmployee[]) {
  state = next;
  persist(next);
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useLocalEmployees(): LocalEmployee[] {
  return useSyncExternalStore(
    subscribe,
    () => {
      ensureHydrated();
      return state;
    },
    () => EMPTY,
  );
}

function nextId(list: LocalEmployee[]) {
  const max = list.reduce((m, e) => {
    const n = parseInt(e.id.replace(/\D/g, ""), 10);
    return isFinite(n) && n > m ? n : m;
  }, 0);
  return `EID-LOCAL-${String(max + 1).padStart(6, "0")}`;
}

export function addLocalEmployee(input: {
  name: string;
  position: string;
  phone: string;
  email: string;
  status: string;
}): LocalEmployee {
  ensureHydrated();
  const name = input.name.trim();
  const position = input.position.trim();
  const phone = input.phone.trim();
  const email = input.email.trim();
  const status = input.status.trim();

  if (!name) throw new Error("Name is required.");
  if (!position) throw new Error("Position is required.");
  if (!status) throw new Error("Status is required.");
  if (!phone && !email) throw new Error("Add a phone number or email so this person can be reached.");

  const record: LocalEmployee = {
    id: nextId(state),
    name,
    position,
    phone,
    email,
    status,
    createdAt: Date.now(),
    hasContract: false,
  };
  set([...state, record]);
  return record;
}

export function removeLocalEmployee(id: string) {
  ensureHydrated();
  set(state.filter((e) => e.id !== id));
}
