import { useState } from "react";
import { X, Paperclip } from "lucide-react";
import { addEmployee } from "@/lib/employees-store";

const STATUSES = ["Active", "On Leave", "Inactive"];

export function AddEmployeeModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Active");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!position.trim()) next.position = "Position is required.";
    if (!phone.trim() && !email.trim())
      next.contact = "Add a phone number or email so this person can be reached.";
    if (email.trim()) {
      const at = email.indexOf("@");
      if (at < 1 || email.indexOf(".", at) < at + 2 || email.endsWith("."))
        next.email = "That doesn't look like a valid email.";
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      const rec = await addEmployee({ name, position, phone, email, status });
      onAdded(rec.name);
      onClose();
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Could not save this employee." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-[oklch(0.20_0.02_165)] border border-white/10 p-6 max-h-[90vh] overflow-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white">
          <X className="h-4 w-4" />
        </button>
        <div className="mb-4">
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/55">Team</p>
          <h2 className="mt-1 font-display text-[22px] leading-none">Add Employee</h2>
          <p className="mt-1 text-[12px] text-white/60">Shared with everyone on your team instantly.</p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <Field label="Name" value={name} onChange={setName} error={errors.name} placeholder="Full name" />
          <Field label="Position" value={position} onChange={setPosition} error={errors.position} placeholder="e.g. Site Engineer" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Phone" value={phone} onChange={setPhone} placeholder="+964 …" />
            <Field label="Email" value={email} onChange={setEmail} error={errors.email} placeholder="name@greenarea.uk" />
          </div>
          {errors.contact && <p className="text-[11px] text-rose-300">{errors.contact}</p>}

          <label className="block">
            <span className="text-[9px] uppercase tracking-[0.22em] text-white/55">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-xs outline-none focus:border-forest/60"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} className="bg-[oklch(0.20_0.02_165)]">
                  {s}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-2xl border border-dashed border-white/12 bg-black/20 px-3 py-4 text-center opacity-60">
            <Paperclip className="h-4 w-4 mx-auto text-white/50" />
            <p className="mt-1.5 text-[12px]">Attach contract</p>
            <p className="text-[10.5px] text-white/50">You can add this after saving.</p>
          </div>

          {errors.form && <p className="text-[11px] text-rose-300">{errors.form}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs hover:bg-white/15 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-forest text-forest-deep px-4 py-1.5 text-xs font-medium hover:brightness-110 transition disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[9px] uppercase tracking-[0.22em] text-white/55">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-xl bg-black/30 border px-3 py-2 text-xs outline-none placeholder:text-white/35 focus:border-forest/60 ${
          error ? "border-rose-400/50" : "border-white/10"
        }`}
      />
      {error && <span className="mt-1 block text-[11px] text-rose-300">{error}</span>}
    </label>
  );
}
