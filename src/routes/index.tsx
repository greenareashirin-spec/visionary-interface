import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-landing.jpg";
import sceneImg from "@/assets/scene-projects.jpg";
import logoAsset from "@/assets/greenarea-logo.png.asset.json";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "GreenArea OS — The Operating System for Landscape" },
      { name: "description", content: "A calm, elegant operating system for Green Area UK. Projects, finance and teams in one refined workspace." },
      { property: "og:title", content: "GreenArea OS" },
      { property: "og:description", content: "A calm, elegant operating system for landscape architecture." },
    ],
  }),
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="absolute top-0 inset-x-0 z-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex items-center justify-between text-background">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoAsset.url} alt="GreenArea" className="h-9 w-9 rounded-md bg-background/90 p-1" />
            <span className="font-display text-xl tracking-tight">GreenArea<span className="opacity-70"> OS</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-10 text-sm font-light">
            <a href="#philosophy" className="opacity-80 hover:opacity-100 transition">Philosophy</a>
            <a href="#system" className="opacity-80 hover:opacity-100 transition">System</a>
            <a href="#studio" className="opacity-80 hover:opacity-100 transition">Studio</a>
          </nav>
          <Link to="/app/dashboard" className="rounded-full border border-background/40 px-5 py-2 text-sm hover:bg-background hover:text-foreground transition">
            Enter workspace
          </Link>
        </div>
      </header>

      <section className="relative h-[100svh] min-h-[720px] w-full overflow-hidden">
        <img src={heroImg} alt="Reflective pond in a landscape architecture project" width={1920} height={1200} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        <div className="relative z-10 h-full mx-auto max-w-7xl px-6 lg:px-10 flex flex-col justify-end pb-24 text-background">
          <p className="text-xs uppercase tracking-[0.3em] opacity-80 mb-6">Green Area UK · Landscape Studio</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-4xl">
            An operating system<br/>as calm as the land<br/>it stewards.
          </h1>
          <p className="mt-8 max-w-xl text-base md:text-lg font-light opacity-90">
            GreenArea OS unifies your projects, finances and team into a single, quiet workspace — designed with the same care as the landscapes you build.
          </p>
          <div className="mt-10 flex items-center gap-6">
            <Link to="/app/dashboard" className="rounded-full bg-background text-foreground px-7 py-3.5 text-sm font-medium hover:bg-background/90 transition">
              Enter the workspace
            </Link>
            <a href="#philosophy" className="text-sm font-light opacity-90 hover:opacity-100">Discover the vision →</a>
          </div>
        </div>
      </section>

      <section id="philosophy" className="mx-auto max-w-6xl px-6 lg:px-10 py-32">
        <div className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Philosophy</p>
          </div>
          <div className="md:col-span-8">
            <h2 className="font-display text-4xl md:text-6xl leading-[1] text-foreground">
              Software that recedes,<br/>so the work can breathe.
            </h2>
            <p className="mt-8 text-lg font-light text-muted-foreground max-w-2xl leading-relaxed">
              We built GreenArea OS the way we design gardens — with restraint, materials that age well, and generous negative space. Every screen has a single purpose. Every number, a source. Every action, a calm confirmation.
            </p>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-px bg-border rounded-3xl overflow-hidden">
          {[
            { k: "Elegant", d: "Editorial typography, generous margins, refined restraint." },
            { k: "Intelligent", d: "One data model. Projects, ledger and people, always in sync." },
            { k: "Organic", d: "Forest, stone and warm white — a palette drawn from the land." },
          ].map((f) => (
            <div key={f.k} className="bg-card p-10">
              <p className="font-display text-2xl text-forest">{f.k}</p>
              <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="system" className="relative bg-forest text-background py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5">
            <p className="text-xs uppercase tracking-[0.3em] opacity-70">The System</p>
            <h2 className="mt-6 font-display text-4xl md:text-5xl leading-tight">
              Four surfaces.<br/>One quiet workspace.
            </h2>
            <p className="mt-6 font-light opacity-80 leading-relaxed">
              Dashboard, daily log, projects and people — each a considered room in a single house. Multi-currency, multi-project, single source of truth.
            </p>
            <Link to="/app/dashboard" className="mt-10 inline-flex items-center gap-3 rounded-full bg-background text-forest-deep px-6 py-3 text-sm font-medium hover:opacity-90 transition">
              Open the workspace <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="md:col-span-7">
            <div className="relative rounded-3xl overflow-hidden hairline shadow-2xl">
              <img src={sceneImg} alt="Aerial garden project" width={1600} height={1000} loading="lazy" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      <section id="studio" className="mx-auto max-w-6xl px-6 lg:px-10 py-32">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">The Studio</p>
            <h2 className="mt-6 font-display text-4xl md:text-5xl leading-tight text-foreground">Built for Green Area UK.</h2>
          </div>
          <div className="md:col-span-7 space-y-8 text-lg font-light text-muted-foreground leading-relaxed">
            <p>GreenArea OS is a bespoke operating system — designed around the way our studio actually works. It preserves the discipline of our existing data engine while giving it a form worthy of the craft.</p>
            <p>Nothing here is generic. Every currency, every phase, every category is a decision we made together.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <img src={logoAsset.url} alt="" className="h-6 w-6" />
            <span>© {new Date().getFullYear()} Green Area UK</span>
          </div>
          <p className="font-light">GreenArea OS · v9.2 Data Engine</p>
        </div>
      </footer>
    </div>
  );
}
