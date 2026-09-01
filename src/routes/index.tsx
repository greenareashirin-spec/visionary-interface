import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import loginBg from "@/assets/login-bg.jpg";
import logoAsset from "@/assets/greenarea-logo.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

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
  const [socialPending, setSocialPending] = useState<"google" | "apple" | null>(null);
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

  async function signInWithSocial(provider: "google" | "apple") {
    setError(null);
    setSocialPending(provider);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    setSocialPending(null);
    if (result.error) {
      setError("Could not start sign-in. Please try again.");
      return;
    }
    if (!result.redirected) {
      setEntering(true);
      setTimeout(() => navigate({ to: "/os" }), 650);
    }
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

          <div className="relative flex items-center justify-center gap-3 py-1">
            <div className="h-px flex-1 bg-white/15" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Or</span>
            <div className="h-px flex-1 bg-white/15" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => signInWithSocial("google")}
              disabled={socialPending === "google"}
              className="flex items-center justify-center gap-2 rounded-full bg-white/8 hover:bg-white/12 border border-white/15 px-4 py-3 text-[13px] text-white/90 transition disabled:opacity-50"
            >
              <GoogleIcon className="h-4 w-4" />
              {socialPending === "google" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Google"}
            </button>
            <button
              type="button"
              onClick={() => signInWithSocial("apple")}
              disabled={socialPending === "apple"}
              className="flex items-center justify-center gap-2 rounded-full bg-white/8 hover:bg-white/12 border border-white/15 px-4 py-3 text-[13px] text-white/90 transition disabled:opacity-50"
            >
              <AppleIcon className="h-4 w-4" />
              {socialPending === "apple" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Apple"}
            </button>
          </div>
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

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.84-.91.65.03 2.49.26 3.66 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
