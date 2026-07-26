import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Home, LayoutDashboard, BookOpen, Building2, Users, Package, Truck, Search, Bell, ChevronDown, X, Sparkles } from "lucide-react";
import logoAsset from "@/assets/greenarea-logo.png.asset.json";
import landscape from "@/assets/command-landscape.jpg";
import { AskOSInput, AskOSHistory } from "@/components/ask-os";

export const Route = createFileRoute("/app")({
  component: AppShell,
});

const nav = [
  { to: "/os",            label: "Command Center", Icon: Home },
  { to: "/app/dashboard", label: "Finance",        Icon: LayoutDashboard },
  { to: "/app/daily-log", label: "Daily Log",      Icon: BookOpen },
  { to: "/app/projects",  label: "Projects",       Icon: Building2 },
  { to: "/app/employees", label: "Employees",      Icon: Users },
  { to: "/app/materials", label: "Materials",      Icon: Package },
  { to: "/app/fleet",     label: "Fleet",          Icon: Truck },
] as const;


function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileAskOpen, setMobileAskOpen] = useState(false);
  return (
    <div className="app-dark relative h-screen w-screen overflow-hidden text-foreground">
      {/* landscape background */}
      <img src={landscape} alt="" className="fixed inset-0 h-full w-full object-cover" />
      <div className="fixed inset-0 bg-gradient-to-br from-black/75 via-black/65 to-black/80" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

      {/* mobile search overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/70 backdrop-blur-md p-4 pt-6 flex flex-col gap-3" onClick={() => setMobileSearchOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2.5">
            <Search className="h-4 w-4 text-white/70" />
            <input autoFocus placeholder="Search projects, entries, people…" className="bg-transparent text-sm outline-none flex-1 placeholder:text-white/45" />
            <button onClick={() => setMobileSearchOpen(false)} className="text-white/60 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/45 px-1">Tap anywhere to close</p>
        </div>
      )}

      {/* mobile Ask OS drawer */}
      {mobileAskOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/70 backdrop-blur-md p-4 pt-6 flex flex-col gap-3" onClick={() => setMobileAskOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-3 min-h-0">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/60">Ask OS</p>
              <button onClick={() => setMobileAskOpen(false)} className="text-white/60 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <AskOSInput />
            <div className="min-h-0 flex-1 overflow-hidden">
              <AskOSHistory />
            </div>
          </div>
        </div>
      )}

      {/* floating workspace */}
      <div className="relative z-10 h-screen w-screen p-2 sm:p-3 lg:p-4 flex gap-2 sm:gap-3 lg:gap-4">
        {/* sidebar card — icon rail on mobile, full label on md+ */}
        <aside className="flex w-20 md:w-56 lg:w-60 shrink-0 flex-col rounded-2xl md:rounded-3xl bg-black/35 backdrop-blur-xl border border-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="px-2 md:px-5 pt-4 md:pt-5 pb-3 md:pb-4 flex items-center gap-3 justify-center md:justify-start">
            <img src={logoAsset.url} alt="" className="h-8 w-8" />
            <div className="hidden md:block leading-tight">
              <p className="font-medium tracking-[0.2em] text-[13px]">GREEN AREA</p>
              <p className="text-[8.5px] uppercase tracking-[0.32em] text-white/55 mt-1">Operating System</p>
            </div>
          </div>

          {/* search — full input on md+, icon-button on mobile */}
          <div className="px-2 md:px-3 pb-2">
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden w-full flex flex-col items-center gap-1 rounded-xl py-2 text-white/70 hover:bg-white/5 transition"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
              <span className="text-[9px] tracking-wide">Search</span>
            </button>
            <div className="hidden md:flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-white/55 shrink-0" />
              <input placeholder="Search…" className="bg-transparent text-xs outline-none flex-1 min-w-0 placeholder:text-white/45" />
            </div>
          </div>

          <nav className="px-1.5 md:px-2.5 mt-1 flex-1 overflow-y-auto">
            {nav.map(({ to, label, Icon }) => {
              const active = to === "/os"
                ? pathname === "/os"
                : pathname === to || pathname.startsWith(to + "/");
              return (
                <Link
                  key={label}
                  to={to}
                  title={label}
                  className={`group flex flex-col md:flex-row items-center md:gap-3 gap-1 rounded-xl px-1.5 md:px-3 py-2 mb-0.5 transition justify-center md:justify-start ${
                    active
                      ? "bg-forest/20 text-forest border border-forest/30"
                      : "text-white/75 hover:bg-white/5"
                  }`}
                >
                  <Icon className={`h-4 w-4 md:h-3.5 md:w-3.5 shrink-0 ${active ? "opacity-100" : "opacity-70"}`} />
                  <span className="md:hidden text-[9px] leading-tight text-center tracking-wide">{label}</span>
                  <span className="hidden md:inline text-[12.5px]">{label}</span>
                </Link>
              );
            })}
          </nav>
          {/* Ask OS — mobile: icon button opens drawer; desktop: full input + history */}
          <div className="md:hidden px-1.5 pb-3">
            <button
              onClick={() => setMobileAskOpen(true)}
              className="w-full flex flex-col items-center gap-1 rounded-xl py-2 text-forest hover:bg-white/5 transition"
              aria-label="Ask OS"
            >
              <span className="h-7 w-7 rounded-full bg-forest text-forest-deep grid place-items-center">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="text-[9px] tracking-wide">Ask OS</span>
            </button>
          </div>
          <div className="hidden md:flex flex-col gap-2 m-2.5 min-h-0">
            <AskOSInput compact />
            <div className="min-h-0 flex-1 overflow-hidden">
              <AskOSHistory />
            </div>
          </div>
        </aside>

        {/* main workspace card */}
        <div className="flex-1 min-w-0 rounded-2xl md:rounded-3xl bg-black/35 backdrop-blur-xl border border-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden">
          <header className="h-14 shrink-0 px-4 md:px-5 lg:px-6 flex items-center justify-between gap-4 border-b border-white/10">
            <Link to="/os" className="text-[10px] uppercase tracking-[0.28em] text-white/60 hover:text-white transition whitespace-nowrap">
              ← Command Center
            </Link>
            <div className="flex items-center gap-2.5">
              <button className="relative rounded-full p-2 hover:bg-white/5 transition" aria-label="Notifications">
                <Bell className="h-3.5 w-3.5 text-white/70" />
                <span className="absolute top-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-forest text-forest-deep text-[9px] grid place-items-center font-medium">3</span>
              </button>
              <button className="flex items-center gap-1.5 rounded-full pl-1 pr-2 py-1 hover:bg-white/5 transition">
                <span className="h-7 w-7 rounded-full bg-forest/20 border border-forest/30 grid place-items-center text-forest font-medium text-[11px]">GA</span>
                <ChevronDown className="h-3 w-3 text-white/60" />
              </button>
            </div>
          </header>
          <main className="flex-1 min-h-0 overflow-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

