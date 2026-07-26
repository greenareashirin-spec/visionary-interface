import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Home, LayoutDashboard, BookOpen, Building2, Users, Package, Settings as SettingsIcon, Search, Bell } from "lucide-react";
import logoAsset from "@/assets/greenarea-logo.png.asset.json";

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
  { to: "/app/settings",  label: "Settings",       Icon: SettingsIcon },
] as const;

function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-[oklch(0.95_0.018_82)] text-foreground flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card/80 backdrop-blur sticky top-0 h-screen">
        <div className="px-6 py-7 flex items-center gap-3">
          <img src={logoAsset.url} alt="" className="h-9 w-9" />
          <div>
            <p className="font-medium tracking-[0.2em] text-sm leading-none">GREEN AREA</p>
            <p className="text-[9px] uppercase tracking-[0.32em] text-muted-foreground mt-1.5">Operating System</p>
          </div>
        </div>
        <nav className="px-3 mt-2 flex-1">
          {nav.map(({ to, label, Icon }) => {
            const active = to === "/os" ? pathname === "/os" : pathname === to || pathname.startsWith(to + "/");
            return (
              <Link
                key={to}
                to={to}
                className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 mb-0.5 transition ${
                  active ? "bg-forest text-background" : "text-foreground/80 hover:bg-secondary"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "opacity-90" : "opacity-70"}`} />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-5 m-3 rounded-2xl bg-secondary/70">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </div>
          <p className="text-sm mt-2">Green Area UK</p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">Data Engine v9.2</p>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-10 bg-background/70 backdrop-blur-xl border-b border-border">
          <div className="px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
            <Link to="/os" className="text-xs uppercase tracking-[0.28em] text-muted-foreground hover:text-foreground transition">
              ← Command Center
            </Link>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground w-80">
                <Search className="h-4 w-4 opacity-60" />
                <span className="font-light">Search…</span>
              </div>
              <button className="relative rounded-full p-2 hover:bg-secondary transition" aria-label="Notifications">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-forest text-background text-[9px] grid place-items-center">3</span>
              </button>
              <div className="h-9 w-9 rounded-full bg-sand grid place-items-center text-forest-deep font-medium text-sm">GA</div>
            </div>
          </div>
        </header>
        <main className="flex-1 px-6 lg:px-10 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
