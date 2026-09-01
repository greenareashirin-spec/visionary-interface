import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import loginBg from "@/assets/login-bg.jpg";
import logoAsset from "@/assets/greenarea-logo.png.asset.json";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/os" });
  },
  component: Login,
  head: () => ({
    meta: [
      { title: "GreenArea OS" },
      { name: "description", content: "Sign in to GreenArea OS — the operating system for Green Area UK." },
      { property: "og:title", content: "GreenArea OS" },
      { property: "og:description", content: "The operating system for Green Area UK." },
    ],
  }),
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [entering, setEntering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    setError(null);
    setPending(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInError) {
      setPending(false);
      setError("Incorrect email or password.");
      return;
    }
    setEntering(true);
    setTimeout(() => navigate({ to: "/os" }), 650);
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <img
        src={loginBg}
        alt=""
        width={1920}
        height={1200}
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ${entering ? "scale-105 blur-sm" : "scale-100"}`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70" />

      <div className={`relative z-10 min-h-screen flex flex-col items-center justify-center px-6 transition-opacity duration-500 ${entering ? "opacity-0" : "opacity-100"}`}>
        <div className="flex flex-col items-center mb-14">
          <img src={logoAsset.url} alt="Green Area" className="h-16 w-16 mb-6 drop-shadow-lg" />
          <p className="font-display text-3xl tracking-wide">Green Area</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.4em] opacity-70">Operating System</p>
        </div>

        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5">
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              aria-label="Email"
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3.5 text-sm placeholder:text-white/60 focus:outline-none focus:border-white/50 transition"
            />
          </div>
          <div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              aria-label="Password"
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3.5 text-sm placeholder:text-white/60 focus:outline-none focus:border-white/50 transition"
            />
          </div>

          {error && (
            <p className="text-center text-[12px] text-red-300/90 tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-white text-neutral-900 py-3.5 text-sm font-medium tracking-wide hover:bg-white/90 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>

      {entering && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <p className="font-display text-2xl tracking-[0.3em] uppercase text-white/80 animate-pulse">Entering</p>
        </div>
      )}
    </div>
  );
}
