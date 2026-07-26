import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import logoAsset from "@/assets/greenarea-logo.png.asset.json";

export const Route = createFileRoute("/app")({
  component: AppShell,
});

const nav = [
  { to: "/app/dashboard", label: "Dashboard", hint: "Overview" },
  { to: "/app/daily-log", label: "Daily Log", hint: "Ledger" },
  { to: "/app/projects", label: "Projects", hint: "Portfolio" },
  { to: "/app/employees", label: "Team", hint: "People" },
  { to: "/app/settings", label: "Settings", hint: "System" },
] as const;

function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-border bg-card sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <img src={logoAsset.url} alt="" className="h-9 w-9" />
          <div>
            <p className="font-display text-lg leading-none">GreenArea</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">Operating System</p>
          </div>
        </div>
        <nav className="px-4 mt-4 flex-1">
          {nav.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center justify-between rounded-xl px-4 py-3 mb-1 transition ${
                  active ? "bg-forest text-background" : "text-foreground/80 hover:bg-secondary"
                }`}
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className={`text-[10px] uppercase tracking-[0.2em] ${active ? "opacity-70" : "text-muted-foreground"}`}>
                  {item.hint}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="p-6 m-4 rounded-2xl bg-secondary">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Studio</p>
          <p className="font-display text-lg mt-2 leading-tight">Green Area UK</p>
          <p className="text-xs text-muted-foreground mt-1">Data Engine v9.2</p>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-10 glass-card border-b border-border">
          <div className="px-6 lg:px-14 h-16 flex items-center justify-between">
            <Link to="/" className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition">
              ← Landing
            </Link>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground w-72">
                <span className="opacity-60">⌕</span>
                <span className="font-light">Search projects, entries, people…</span>
              </div>
              <button className="rounded-full bg-forest text-background px-4 py-2 text-sm">+ New entry</button>
              <div className="h-9 w-9 rounded-full bg-sand grid place-items-center text-forest-deep font-medium text-sm">GA</div>
            </div>
          </div>
        </header>
        <main className="flex-1 px-6 lg:px-14 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
