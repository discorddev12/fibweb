import { useState } from "react";
import { Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STATUS_OPTIONS = ["WANTED", "UNDER SURVEILLANCE", "IN CUSTODY", "CLASSIFIED"];
const THREAT_OPTIONS = ["LOW", "MEDIUM", "HIGH", "██████"];

export default function CreateCaseForm({ onCreated, agent }: { onCreated: () => void; agent?: { rank?: string; badge_number?: string; username?: string } | null }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    status: "WANTED",
    threat: "MEDIUM",
    last_seen: "",
    charges: "",
    notes: "",
  });

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Subject name is required.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("cases").insert({
      name: form.name,
      status: form.status,
      threat: form.threat,
      last_seen: form.last_seen || null,
      charges: form.charges.split(",").map((c) => c.trim()).filter(Boolean),
      notes: agent ? `Filed by ${agent.rank || ""} ${agent.username || ""}, Badge #${agent.badge_number || "N/A"}. ${form.notes || ""}`.trim() : (form.notes || null),
    });
    setLoading(false);
    if (error) {
      toast.error("Failed to create case file.");
    } else {
      toast.success("Case file created successfully.");
      setForm({ name: "", status: "WANTED", threat: "MEDIUM", last_seen: "", charges: "", notes: "" });
      setOpen(false);
      onCreated();
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-bold tracking-wider hover:opacity-90 transition-opacity"
      >
        <Plus className="h-4 w-4" /> NEW CASE FILE
      </button>
    );
  }

  return (
    <div className="bg-gradient-card border border-gold rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground font-bold font-mono text-sm tracking-wider">CREATE NEW CASE FILE</h3>
        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-muted-foreground font-mono tracking-wider block mb-1">SUBJECT NAME *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. John 'Shadow' Doe"
            className="w-full bg-background border border-border rounded-md py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground font-mono tracking-wider block mb-1">LAST KNOWN LOCATION</label>
          <input
            value={form.last_seen}
            onChange={(e) => setForm({ ...form, last_seen: e.target.value })}
            placeholder="e.g. Vinewood Hills"
            className="w-full bg-background border border-border rounded-md py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground font-mono tracking-wider block mb-1">STATUS</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full bg-background border border-border rounded-md py-2 px-3 text-sm text-foreground focus:outline-none focus:border-primary font-mono"
          >
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground font-mono tracking-wider block mb-1">THREAT LEVEL</label>
          <select
            value={form.threat}
            onChange={(e) => setForm({ ...form, threat: e.target.value })}
            className="w-full bg-background border border-border rounded-md py-2 px-3 text-sm text-foreground focus:outline-none focus:border-primary font-mono"
          >
            {THREAT_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-[10px] text-muted-foreground font-mono tracking-wider block mb-1">CHARGES (comma-separated)</label>
        <input
          value={form.charges}
          onChange={(e) => setForm({ ...form, charges: e.target.value })}
          placeholder="e.g. Armed Robbery, Evading Law Enforcement"
          className="w-full bg-background border border-border rounded-md py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono"
        />
      </div>

      <div>
        <label className="text-[10px] text-muted-foreground font-mono tracking-wider block mb-1">INTEL NOTES</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Enter classified intel..."
          rows={3}
          className="w-full bg-background border border-border rounded-md py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono resize-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-bold tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? "FILING CASE..." : "SUBMIT CASE FILE"}
      </button>
    </div>
  );
}
