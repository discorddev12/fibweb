import { useState } from "react";
import { FileText, X, CheckCircle, Stamp, AlertTriangle, ShieldAlert } from "lucide-react";

type WarrantType = "Search" | "Arrest" | "Tracking" | "Wiretap";
type RiskLevel = "Low" | "Medium" | "High";

interface WarrantData {
  requestingAgent: string;
  warrantType: WarrantType | "";
  targetName: string;
  location: string;
  probableCause: string;
  evidence: string[];
  risk: RiskLevel | "";
}

const emptyForm: WarrantData = {
  requestingAgent: "",
  warrantType: "",
  targetName: "",
  location: "",
  probableCause: "",
  evidence: ["", "", ""],
  risk: "",
};

export default function SearchWarrantForm() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<WarrantData>(emptyForm);
  const [warrant, setWarrant] = useState<WarrantData | null>(null);
  const [processing, setProcessing] = useState(false);

  const isValid =
    form.requestingAgent.trim() &&
    form.warrantType &&
    form.targetName.trim() &&
    form.location.trim() &&
    form.probableCause.trim() &&
    form.risk &&
    form.evidence.some((e) => e.trim());

  const handleSubmit = () => {
    if (!isValid) return;
    setProcessing(true);
    setTimeout(() => {
      setWarrant({ ...form, evidence: form.evidence.filter((e) => e.trim()) });
      setProcessing(false);
    }, 2000);
  };

  const handleClose = () => {
    setOpen(false);
    setWarrant(null);
    setForm(emptyForm);
  };

  const updateEvidence = (i: number, val: string) => {
    const next = [...form.evidence];
    next[i] = val;
    setForm({ ...form, evidence: next });
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-bold tracking-wider hover:opacity-90 transition-opacity border border-border"
      >
        <FileText className="h-4 w-4" /> REQUEST WARRANT
      </button>
    );
  }

  if (warrant) {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const warrantId = `${warrant.warrantType?.[0] ?? "W"}W-${now.getFullYear()}-${String(
      Math.floor(Math.random() * 99999),
    ).padStart(5, "0")}`;

    const swatStatus =
      warrant.risk === "High"
        ? { label: "SWAT DEPLOYMENT MANDATORY", color: "text-red-400", border: "border-red-500/60", bg: "bg-red-500/10", icon: ShieldAlert }
        : warrant.risk === "Medium"
        ? { label: "SWAT SUPPORT RECOMMENDED", color: "text-yellow-400", border: "border-yellow-500/60", bg: "bg-yellow-500/10", icon: AlertTriangle }
        : { label: "STANDARD ENTRY APPROVED", color: "text-green-400", border: "border-green-500/60", bg: "bg-green-500/10", icon: CheckCircle };

    const SwatIcon = swatStatus.icon;

    return (
      <div className="bg-gradient-card border border-gold rounded-lg overflow-hidden">
        <div className="bg-primary/10 border-b border-gold p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-400 text-sm font-mono font-bold tracking-wider">WARRANT APPROVED</span>
          </div>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="text-center space-y-1">
            <p className="text-[10px] text-muted-foreground font-mono tracking-[0.4em]">PARADISE STATE — FEDERAL INVESTIGATION BUREAU</p>
            <h3 className="text-xl font-bold text-primary font-serif tracking-wider">
              {warrant.warrantType?.toUpperCase()} WARRANT
            </h3>
            <p className="text-[10px] text-muted-foreground font-mono">Warrant No. {warrantId}</p>
          </div>

          <div className={`border ${swatStatus.border} ${swatStatus.bg} rounded-md p-3 flex items-center gap-3`}>
            <SwatIcon className={`h-5 w-5 ${swatStatus.color}`} />
            <div className="flex-1">
              <p className={`text-xs font-mono font-bold tracking-wider ${swatStatus.color}`}>{swatStatus.label}</p>
              <p className="text-[10px] text-muted-foreground font-mono">
                Risk Assessment: <span className="text-foreground font-bold">{warrant.risk.toUpperCase()}</span>
                {warrant.risk === "High" && " — Tactical team must be on-site prior to execution."}
                {warrant.risk === "Medium" && " — Agent should request SWAT support before execution."}
                {warrant.risk === "Low" && " — Standard agent execution authorized."}
              </p>
            </div>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-3 bg-background/50">
            <p className="text-xs text-foreground/80 font-mono leading-relaxed">
              The Federal Investigation Bureau, acting under the authority of the Paradise State Judiciary, hereby
              authorizes the following <span className="text-primary font-bold">{warrant.warrantType?.toUpperCase()}</span> warrant:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-muted-foreground font-mono tracking-wider">REQUESTING AGENT:</span>
                <p className="text-sm text-foreground font-mono font-bold">{warrant.requestingAgent}</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-mono tracking-wider">TARGET:</span>
                <p className="text-sm text-foreground font-mono font-bold">{warrant.targetName}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-[10px] text-muted-foreground font-mono tracking-wider">LOCATION:</span>
                <p className="text-sm text-foreground font-mono font-bold">{warrant.location}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-[10px] text-muted-foreground font-mono tracking-wider">PROBABLE CAUSE:</span>
                <p className="text-sm text-foreground/80 font-mono whitespace-pre-wrap">{warrant.probableCause}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-[10px] text-muted-foreground font-mono tracking-wider">EVIDENCE SUPPORTING REQUEST:</span>
                <ul className="mt-1 space-y-1">
                  {warrant.evidence.map((e, i) => (
                    <li key={i} className="text-sm text-foreground/80 font-mono">• {e}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-xs text-foreground/60 font-mono leading-relaxed">
              This warrant is valid for <span className="text-foreground">72 hours</span> from issuance. All evidence
              collected must be catalogued and submitted to the FIB Evidence Division within 48 hours of recovery.
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

  const warrantTypes: WarrantType[] = ["Search", "Arrest", "Tracking", "Wiretap"];
  const risks: RiskLevel[] = ["Low", "Medium", "High"];

  return (
    <div className="bg-gradient-card border border-gold rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground font-bold font-mono text-sm tracking-wider">WARRANT REQUEST FORM</h3>
        <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-muted-foreground font-mono tracking-wider block mb-1">REQUESTING AGENT *</label>
          <input
            value={form.requestingAgent}
            onChange={(e) => setForm({ ...form, requestingAgent: e.target.value })}
            placeholder="e.g. 2S-04 J.DOE"
            className="w-full bg-background border border-border rounded-md py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground font-mono tracking-wider block mb-1">TARGET NAME *</label>
          <input
            value={form.targetName}
            onChange={(e) => setForm({ ...form, targetName: e.target.value })}
            placeholder="e.g. Marcus 'Ghost' Rivera"
            className="w-full bg-background border border-border rounded-md py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] text-muted-foreground font-mono tracking-wider block mb-2">TYPE OF WARRANT *</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {warrantTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm({ ...form, warrantType: t })}
              className={`py-2 px-3 rounded-md border text-xs font-mono font-bold tracking-wider transition-colors ${
                form.warrantType === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:border-primary"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] text-muted-foreground font-mono tracking-wider block mb-1">LOCATION *</label>
        <input
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="e.g. 1422 Vinewood Blvd, Los Santos"
          className="w-full bg-background border border-border rounded-md py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono"
        />
      </div>

      <div>
        <label className="text-[10px] text-muted-foreground font-mono tracking-wider block mb-1">PROBABLE CAUSE * <span className="text-muted-foreground/60 normal-case">(explain clearly and lawfully)</span></label>
        <textarea
          value={form.probableCause}
          onChange={(e) => setForm({ ...form, probableCause: e.target.value })}
          rows={3}
          className="w-full bg-background border border-border rounded-md py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono resize-none"
        />
      </div>

      <div>
        <label className="text-[10px] text-muted-foreground font-mono tracking-wider block mb-1">EVIDENCE SUPPORTING REQUEST *</label>
        <div className="space-y-2">
          {form.evidence.map((e, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-primary font-mono">•</span>
              <input
                value={e}
                onChange={(ev) => updateEvidence(i, ev.target.value)}
                placeholder={`Evidence item ${i + 1}`}
                className="flex-1 bg-background border border-border rounded-md py-1.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] text-muted-foreground font-mono tracking-wider block mb-2">RISK ASSESSMENT *</label>
        <div className="grid grid-cols-3 gap-2">
          {risks.map((r) => {
            const colors =
              r === "Low"
                ? "border-green-500/60 text-green-400"
                : r === "Medium"
                ? "border-yellow-500/60 text-yellow-400"
                : "border-red-500/60 text-red-400";
            const active =
              form.risk === r
                ? r === "Low"
                  ? "bg-green-500/20"
                  : r === "Medium"
                  ? "bg-yellow-500/20"
                  : "bg-red-500/20"
                : "bg-background";
            return (
              <button
                key={r}
                type="button"
                onClick={() => setForm({ ...form, risk: r })}
                className={`py-2 px-3 rounded-md border font-mono font-bold tracking-wider text-xs transition-colors ${colors} ${active}`}
              >
                {r.toUpperCase()}
              </button>
            );
          })}
        </div>
        {form.risk === "Medium" && (
          <p className="mt-2 text-[11px] text-yellow-400 font-mono flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3" /> NOTE: You should request SWAT support for this operation.
          </p>
        )}
        {form.risk === "High" && (
          <p className="mt-2 text-[11px] text-red-400 font-mono flex items-center gap-1.5">
            <ShieldAlert className="h-3 w-3" /> MANDATORY: SWAT deployment required on-site before execution.
          </p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={processing || !isValid}
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
