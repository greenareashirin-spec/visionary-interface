import { useSyncExternalStore } from "react";

export type AskMessage = { id: string; q: string; a: string; at: number };

type State = {
  messages: AskMessage[];
  activeId: string | null;
};

const KEY = "ask-os:v1";
const MEMORY_MS = 6 * 60 * 60 * 1000; // 6 hours
const prune = (msgs: AskMessage[]) => msgs.filter((m) => Date.now() - m.at < MEMORY_MS);
const listeners = new Set<() => void>();

function load(): AskMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AskMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(messages: AskMessage[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(messages));
  } catch {
    /* ignore */
  }
}

let state: State = { messages: [], activeId: null };
let hydrated = false;

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  state = { messages: prune(load()), activeId: null };
  save(state.messages);
  // Re-prune every 5 minutes so stale conversations drop off live.
  window.setInterval(() => {
    const kept = prune(state.messages);
    if (kept.length !== state.messages.length) {
      const activeId = state.activeId && kept.some((m) => m.id === state.activeId) ? state.activeId : null;
      set({ messages: kept, activeId });
    }
  }, 5 * 60 * 1000);
}

function set(next: State) {
  state = next;
  save(next.messages);
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function stubAnswer(q: string) {
  const trimmed = q.trim();
  if (!trimmed) return "";
  return `Here's what I found about "${trimmed}". Green Area OS is currently in visual preview — once the backend is wired, I'll pull real numbers from your latest ERP upload, cross-reference project ledgers, fuel logs and staff timesheets, and hand you a clear answer with sources you can trust.`;
}

export function useAskOS() {
  return useSyncExternalStore(
    subscribe,
    () => {
      ensureHydrated();
      return state;
    },
    () => ({ messages: [], activeId: null }),
  );
}

export function askOS(q: string) {
  ensureHydrated();
  const text = q.trim();
  if (!text) return;
  const id = (typeof crypto !== "undefined" && "randomUUID" in crypto)
    ? crypto.randomUUID()
    : `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const msg: AskMessage = { id, q: text, a: stubAnswer(text), at: Date.now() };
  set({ messages: [msg, ...state.messages].slice(0, 40), activeId: id });
}

export function openMessage(id: string) {
  ensureHydrated();
  set({ ...state, activeId: id });
}

export function closeAnswer() {
  ensureHydrated();
  if (state.activeId === null) return;
  set({ ...state, activeId: null });
}

export function clearHistory() {
  ensureHydrated();
  set({ messages: [], activeId: null });
}
