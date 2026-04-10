import { useState } from "react";
import { FileText, X, CheckCircle, Stamp } from "lucide-react";

export default function SearchWarrantForm() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    subjectName: "",
    location: "",
    reason: "",
  });
  const [warrant, setWarrant] = useState<null | typeof form>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = () => {
    if (!form.subjectName.trim() || !form.location.trim() || !form.reason.trim()) return;
    setProcessing(true);
    setTimeout(() => {
      setWarrant({ ...form });
      setProcessing(false);
    }, 2000);
  };

  const handleClose = () => {
    setOpen(false);
    setWarrant(null);
    setForm({ subjectName: "", location: "", reason: "" });
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-bold tracking-wider hover:opacity-90 transition-opacity border border-border"
      >
        <FileText className="h-4 w-4" /> REQUEST SEARCH WARRANT
      </button>
    );
  }

  if (warrant) {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const warrantId = `SW-${now.getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`;

    return (
      <div className="bg-gradient-card border border-gold rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary/10 border-b border-gold p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-400 text-sm font-mono font-bold tracking-wider">WARRANT APPROVED</span>
          </div>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Document */}
        <div className="p-6 space-y-5">
          <div className="text-center space-y-1">
            <p className="text-[10px] text-muted-foreground font-mono tracking-[0.4em]">PARADISE STATE — FEDERAL INVESTIGATION BUREAU</p>
            <h3 className="text-xl font-bold text-primary font-serif tracking-wider">SEARCH WARRANT</h3>
            <p className="text-[10px] text-muted-foreground font-mono">Warrant No. {warrantId}</p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-3 bg-background/50">
            <p className="text-xs text-foreground/80 font-mono leading-relaxed">
              The Federal Investigation Bureau, acting under the authority of the Paradise State Judiciary,
              hereby authorizes a <span className="text-primary font-bold">SEARCH AND SEIZURE</span> operation
              pertaining to the following:
            </p>

            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-muted-foreground font-mono tracking-wider">SUBJECT:</span>
                <p className="text-sm text-foreground font-mono font-bold">{warrant.subjectName}</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-mono tracking-wider">LOCATION TO BE SEARCHED:</span>
                <p className="text-sm text-foreground font-mono font-bold">{warrant.location}</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-mono tracking-wider">PROBABLE CAUSE:</span>
                <p className="text-sm text-foreground/80 font-mono">{warrant.reason}</p>
              </div>
            </div>

            <p className="text-xs text-foreground/60 font-mono leading-relaxed">
              This warrant is valid for <span className="text-foreground">72 hours</span> from the time of issuance.
              All evidence collected under this warrant must be catalogued and submitted to the FIB Evidence
              Division within 48 hours of recovery.
            </p>
          </div>

          <div className="flex items-end justify-between pt-2">
            <div className="space-y-1">
              <p className="text-xs text-foreground font-mono font-bold">ACCESS PERMITTED</p>
              <p className="text-[10px] text-muted-foreground font-mono">Issued: {dateStr} at {timeStr}</p>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2 justify-end">
                <Stamp className="h-4 w-4 text-primary" />
                <span className="text-[10px] text-primary font-bold tracking-wider">AUTHORIZED</span>
              </div>
              <p className="text-sm text-foreground font-mono font-bold italic border-b border-foreground/30 pb-0.5 inline-block">
                A. Aaron
              </p>
              <p className="text-[10px] text-muted-foreground font-mono">1S-01 A.AARON</p>
              <p className="text-[10px] text-muted-foreground font-mono">FIB Senior Supervisory Agent</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-card border border-gold rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground font-bold font-mono text-sm tracking-wider">SEARCH WARRANT REQUEST</h3>
        <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-muted-foreground font-mono tracking-wider block mb-1">SUBJECT NAME *</label>
          <input
            value={form.subjectName}
            onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
            placeholder="e.g. Marcus 'Ghost' Rivera"
            className="w-full bg-background border border-border rounded-md py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground font-mono tracking-wider block mb-1">SEARCH LOCATION *</label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. 1422 Vinewood Blvd, Los Santos"
            className="w-full bg-background border border-border rounded-md py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] text-muted-foreground font-mono tracking-wider block mb-1">PROBABLE CAUSE / JUSTIFICATION *</label>
        <textarea
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          placeholder="Describe the reason for this search warrant request..."
          rows={3}
          className="w-full bg-background border border-border rounded-md py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono resize-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={processing || !form.subjectName.trim() || !form.location.trim() || !form.reason.trim()}
        className="w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-bold tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {processing ? "PROCESSING REQUEST..." : "SUBMIT WARRANT REQUEST"}
      </button>

      {processing && (
        <div className="text-center space-y-2">
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-[loading_2s_ease-in-out_forwards]" />
          </div>
          <p className="text-[10px] text-muted-foreground font-mono tracking-wider animate-pulse">
            ROUTING TO FIB JUDICIAL LIAISON... AWAITING AUTHORIZATION...
          </p>
        </div>
      )}
    </div>
  );
}
