import { useEffect, useRef, useState } from "react";
import { Sparkles, ChevronDown, ArrowUp, MessageSquare, Trash2 } from "lucide-react";
import { askOS, closeAnswer, clearHistory, openMessage, useAskOS } from "@/lib/ask-os-store";

/** Fixed text input — never moves. Lives inside layouts (center column on /os, sidebar on module pages). */
export function AskOSInput({ compact = false, placeholder = "Ask anything about Green Area…" }: { compact?: boolean; placeholder?: string }) {
  const [q, setQ] = useState("");
  const examples = ["Show fuel expenses", "Summarize today", "Missing receipts"];

  function submit() {
    if (!q.trim()) return;
    askOS(q);
    setQ("");
  }

  return (
    <div className={`rounded-2xl border border-white/10 bg-black/38 backdrop-blur-xl text-white ${compact ? "p-2.5" : "p-3"}`}>
      <div className="flex items-center gap-2">
        <span className="h-7 w-7 rounded-full bg-forest text-forest-deep grid place-items-center shrink-0">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[8.5px] uppercase tracking-[0.28em] text-white/55">Ask OS</p>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none text-[12.5px] placeholder:text-white/40 mt-0.5"
          />
        </div>
        <button
          onClick={submit}
          aria-label="Ask"
          className="h-7 w-7 rounded-full bg-forest text-forest-deep grid place-items-center hover:brightness-110 transition shrink-0"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </div>
      {!compact && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {examples.map((e) => (
            <button
              key={e}
              onClick={() => setQ(e)}
              className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/15 hover:text-white transition"
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Conversation history — used inside the module sidebar. */
export function AskOSHistory() {
  const { messages, activeId } = useAskOS();

  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white">
        <p className="text-[9px] uppercase tracking-[0.28em] text-white/55">Conversation</p>
        <p className="text-[11px] text-white/50 mt-1.5 leading-snug">Ask OS anything above. Your recent answers appear here so you can jump back in.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 text-white flex flex-col min-h-0">
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <p className="text-[9px] uppercase tracking-[0.28em] text-white/55">Conversation</p>
        <button
          onClick={clearHistory}
          aria-label="Clear history"
          className="text-white/45 hover:text-white transition"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      <ul className="px-1.5 pb-2 flex-1 overflow-y-auto space-y-0.5">
        {messages.map((m) => {
          const isActive = m.id === activeId;
          return (
            <li key={m.id}>
              <button
                onClick={() => openMessage(m.id)}
                className={`w-full flex items-start gap-2 rounded-lg px-2 py-1.5 text-left transition ${
                  isActive ? "bg-forest/20 border border-forest/30" : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <MessageSquare className={`h-3 w-3 mt-0.5 shrink-0 ${isActive ? "text-forest" : "text-white/50"}`} />
                <span className="text-[11.5px] leading-tight text-white/85 line-clamp-2">{m.q}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Roll-up answer panel. Only visible after an ask. On mobile it takes over the viewport. */
export function AskOSAnswerPanel() {
  const { messages, activeId } = useAskOS();
  const active = activeId ? messages.find((m) => m.id === activeId) : null;
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (active) {
      // enter next frame so transition plays
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      {/* Mobile: full takeover */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl text-white transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="h-full w-full flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-forest text-forest-deep grid place-items-center">
                <Sparkles className="h-3 w-3" />
              </span>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/70">Ask OS</p>
            </div>
            <button
              onClick={closeAnswer}
              className="flex items-center gap-1.5 text-[11px] text-white/70 hover:text-white rounded-full border border-white/15 px-3 py-1.5 bg-white/5"
            >
              <ChevronDown className="h-3.5 w-3.5" /> Roll down
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/50">You asked</p>
            <p className="text-[15px] text-white mt-1.5 leading-snug">{active.q}</p>
            <p className="mt-5 text-[11px] uppercase tracking-[0.24em] text-white/50">Answer</p>
            <p className="text-[13.5px] text-white/90 mt-2 leading-relaxed whitespace-pre-wrap">{active.a}</p>
          </div>
        </div>
      </div>

      {/* Desktop / tablet: bottom roll-up sheet */}
      <div
        className={`hidden md:block fixed left-1/2 -translate-x-1/2 bottom-0 z-40 w-[min(94vw,760px)] pointer-events-none`}
      >
        <div
          className={`pointer-events-auto rounded-t-3xl border border-white/10 border-b-0 bg-black/55 backdrop-blur-2xl text-white shadow-[0_-20px_60px_rgba(0,0,0,0.5)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-forest text-forest-deep grid place-items-center">
                <Sparkles className="h-3 w-3" />
              </span>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/70">Ask OS · Answer</p>
            </div>
            <button
              onClick={closeAnswer}
              className="flex items-center gap-1.5 text-[10.5px] text-white/70 hover:text-white rounded-full border border-white/15 px-2.5 py-1 bg-white/5"
            >
              <ChevronDown className="h-3.5 w-3.5" /> Roll down
            </button>
          </div>
          <div className="px-5 py-4 max-h-[46vh] overflow-y-auto">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/50">You asked</p>
            <p className="text-[13.5px] text-white mt-1 leading-snug">{active.q}</p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.24em] text-white/50">Answer</p>
            <p className="text-[12.5px] text-white/90 mt-1.5 leading-relaxed whitespace-pre-wrap">{active.a}</p>
          </div>
        </div>
      </div>
    </>
  );
}
