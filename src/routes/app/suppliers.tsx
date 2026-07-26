import { createFileRoute } from "@tanstack/react-router";
import { Handshake, Package, Wallet, Star, Search, Filter, Plus, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/app/suppliers")({
  component: Suppliers,
  head: () => ({ meta: [{ title: "Suppliers · GreenArea OS" }] }),
});

const stats = [
  { label: "Total Suppliers", value: "24",       sub: "Active partners", Icon: Handshake },
  { label: "Preferred",       value: "8",        sub: "Top rated",       Icon: Star,    tone: "forest" as const },
  { label: "Open Orders",     value: "11",       sub: "In progress",     Icon: Package },
  { label: "Payables",        value: "$18,240",  sub: "3 due this week", Icon: Wallet,  tone: "amber"  as const },
  { label: "Spent (30d)",     value: "$42,180",  sub: "+6.2%",           Icon: Wallet },
  { label: "Avg Lead Time",   value: "4.2 d",    sub: "Delivery",        Icon: Package },
];

const suppliers = [
  { id: "SUP-01", name: "Al-Rasheed Stone Co.",   cat: "Stone & Tile",       contact: "Ahmed Salim",    phone: "+964 780 111 001", city: "Baghdad", rating: 4.8, terms: "Net 30", balance: "$4,820",  status: "Preferred" },
  { id: "SUP-02", name: "Green Nursery Erbil",    cat: "Plants & Soil",      contact: "Nawzad Barzan",  phone: "+964 750 222 004", city: "Erbil",   rating: 4.6, terms: "Net 15", balance: "$2,140",  status: "Active"    },
  { id: "SUP-03", name: "Baghdad Steel Works",    cat: "Metal & Fabrication",contact: "Yasin Kadhim",   phone: "+964 770 333 010", city: "Baghdad", rating: 4.2, terms: "Net 45", balance: "$6,480",  status: "Active"    },
  { id: "SUP-04", name: "Tigris Irrigation",      cat: "Irrigation",         contact: "Layla Hameed",   phone: "+964 771 444 022", city: "Baghdad", rating: 4.9, terms: "Net 30", balance: "$1,900",  status: "Preferred" },
  { id: "SUP-05", name: "Kurdistan Timber Ltd.",  cat: "Wood & Decking",     contact: "Serwan Ako",     phone: "+964 750 555 018", city: "Duhok",   rating: 4.4, terms: "Net 30", balance: "$3,200",  status: "Active"    },
  { id: "SUP-06", name: "Marina Pool Systems",    cat: "Water Features",     contact: "Rania Mahmoud",  phone: "+964 780 666 040", city: "Basra",   rating: 4.1, terms: "Net 60", balance: "-$720",   status: "On Hold"   },
];

const statusTone: Record<string, string> = {
  "Preferred": "bg-forest/15 text-forest",
  "Active":    "bg-white/10 text-white/80",
  "On Hold":   "bg-amber-500/15 text-amber-300",
};

function Suppliers() {
  return (
    <div className="flex flex-col h-full min-h-0 px-5 lg:px-6 py-4 gap-3.5">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/55">Network</p>
          <h1 className="mt-1 font-display text-[26px] leading-none">Suppliers</h1>
          <p className="mt-1 text-[12px] text-white/60">Partners, orders and payables across the studio.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs hover:bg-white/15 transition">Export</button>
          <button className="rounded-full bg-forest text-forest-deep px-4 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:brightness-110 transition">
            <Plus className="h-3.5 w-3.5" /> Add Supplier
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-6 gap-2.5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-black/32 backdrop-blur-xl border border-white/10 p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/55">{s.label}</p>
              <s.Icon className="h-3 w-3 text-white/45" />
            </div>
            <p className="mt-1 text-[13px] sm:text-lg md:text-xl font-medium tracking-tight">{s.value}</p>
            <p className={`text-[10.5px] mt-0.5 ${s.tone === "forest" ? "text-forest" : s.tone === "amber" ? "text-amber-300" : "text-white/55"}`}>{s.sub}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl bg-black/32 backdrop-blur-xl border border-white/10 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 flex-wrap">
          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 flex-1 min-w-[200px] max-w-md">
            <Search className="h-3.5 w-3.5 text-white/55" />
            <input placeholder="Search name, category or city…" className="bg-transparent text-xs outline-none flex-1 placeholder:text-white/45" />
          </div>
          <Select label="All Categories" />
          <Select label="All Cities" />
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition">
            <Filter className="h-3 w-3" /> More Filters
          </button>
        </div>
        <div className="flex gap-5 px-4 pt-2.5 text-xs border-b border-white/10">
          {["All Suppliers", "Preferred", "Active", "On Hold", "Archived"].map((t, i) => (
            <button key={t} className={`pb-2 border-b-2 transition ${i === 0 ? "border-forest text-white" : "border-transparent text-white/55 hover:text-white"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex-1 min-h-0 overflow-auto">
          <table className="w-full text-[12px]">
            <thead className="sticky top-0 bg-[oklch(0.22_0.02_165)]/95 backdrop-blur">
              <tr className="text-left text-[9px] uppercase tracking-[0.22em] text-white/55">
                <th className="py-2.5 px-4 font-normal">Supplier</th>
                <th className="py-2.5 px-3 font-normal">Category</th>
                <th className="py-2.5 px-3 font-normal">Contact</th>
                <th className="py-2.5 px-3 font-normal">City</th>
                <th className="py-2.5 px-3 font-normal">Rating</th>
                <th className="py-2.5 px-3 font-normal">Terms</th>
                <th className="py-2.5 px-3 font-normal">Status</th>
                <th className="py-2.5 px-3 font-normal text-right">Balance</th>
                <th className="py-2.5 px-4 font-normal text-right"> </th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} className="border-t border-white/5 hover:bg-black/30 transition">
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-forest/15 grid place-items-center text-forest">
                        <Handshake className="h-3.5 w-3.5" />
                      </div>
                      <div className="leading-tight">
                        <p className="font-medium">{s.name}</p>
                        <p className="text-[10.5px] text-white/50">{s.id} · {s.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-white/75">{s.cat}</td>
                  <td className="py-2.5 px-3">{s.contact}</td>
                  <td className="py-2.5 px-3 text-white/70">{s.city}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px]">
                      <Star className="h-3 w-3 text-amber-300 fill-amber-300" /> {s.rating.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-white/70 text-[11px]">{s.terms}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full ${statusTone[s.status]}`}>{s.status}</span>
                  </td>
                  <td className={`py-2.5 px-3 text-right font-medium ${s.balance.startsWith("-") ? "text-forest" : ""}`}>{s.balance}</td>
                  <td className="py-2.5 px-4 text-right">
                    <button className="text-white/50 hover:text-white"><MoreHorizontal className="h-3.5 w-3.5 inline" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Select({ label }: { label: string }) {
  return (
    <button className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition flex items-center gap-1.5">
      {label} <span className="text-white/50 text-[10px]">▾</span>
    </button>
  );
}
