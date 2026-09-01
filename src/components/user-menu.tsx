import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function UserMenu({ solid = false }: { solid?: boolean }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account"
        className={`flex items-center gap-1.5 rounded-full pl-1 pr-2 py-1 transition ${
          solid ? "bg-black/38 backdrop-blur-xl border border-white/10 hover:bg-white/15" : "hover:bg-white/5"
        }`}
      >
        <span className="h-7 w-7 rounded-full bg-forest/25 border border-forest/30 grid place-items-center text-forest font-medium text-[11px]">
          GA
        </span>
        <ChevronDown className="h-3 w-3 text-white/70" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/12 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] overflow-hidden">
          {email && (
            <p className="px-4 pt-3 pb-2 text-[10px] uppercase tracking-[0.18em] text-white/45 truncate">{email}</p>
          )}
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 px-4 py-3 text-[13px] text-white/85 hover:bg-white/8 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
