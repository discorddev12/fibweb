import { useState } from "react";
import { Search, FileWarning, ShieldAlert, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import Layout from "@/components/Layout";

const fakeSubjects = [
  {
    name: "Marcus 'Ghost' Rivera",
    status: "WANTED",
    threat: "HIGH",
    lastSeen: "Vinewood Hills, Los Santos",
    charges: ["Armed Robbery", "Evading Law Enforcement", "██████████"],
    notes: "Subject is considered armed and dangerous. Last seen operating a black ████████ sedan. Known associates: ██████████, ██████████.",
    caseFile: "FIB-2024-00482",
  },
  {
    name: "Elena 'Ice' Vasquez",
    status: "UNDER SURVEILLANCE",
    threat: "MEDIUM",
    lastSeen: "Paleto Bay",
    charges: ["Money Laundering", "Conspiracy", "████████████"],
    notes: "Subject maintains a front business at ██████████ Ave. Intercepted communications suggest ties to ██████████ cartel operations.",
    caseFile: "FIB-2024-01197",
  },
  {
    name: "Derek 'Havoc' Thompson",
    status: "IN CUSTODY",
    threat: "LOW",
    lastSeen: "Bolingbroke Penitentiary",
    charges: ["Grand Theft Auto", "Assault on LEO"],
    notes: "Cooperating witness in Operation ██████████. Transferred to protective custody on ██/██/2024.",
    caseFile: "FIB-2024-00831",
  },
  {
    name: "████████ ██████",
    status: "CLASSIFIED",
    threat: "██████",
    lastSeen: "██████████████",
    charges: ["[REDACTED]", "[REDACTED]", "[REDACTED]"],
    notes: "██████████████████████████████████████████████████████████████████████████████████████████████████████.",
    caseFile: "FIB-████-█████",
  },
  {
    name: "Johnny 'Wrench' Kowalski",
    status: "WANTED",
    threat: "MEDIUM",
    lastSeen: "Sandy Shores",
    charges: ["Illegal Weapons Trafficking", "████████████"],
    notes: "Subject operates out of a scrapyard in ██████████. Surveillance ongoing since ██/██/2024. Linked to ██████████ MC.",
    caseFile: "FIB-2024-00295",
  },
];

const redactedFiles = [
  { name: "Operation BLACKTIDE — After Action Report", classification: "TOP SECRET", pages: 47 },
  { name: "██████████ Surveillance Transcripts", classification: "SECRET", pages: 132 },
  { name: "Informant Network — Pacific Region", classification: "TOP SECRET // NOFORN", pages: 23 },
  { name: "Internal Affairs Review — Case ██████", classification: "CLASSIFIED", pages: 18 },
  { name: "Operation IRON VEIL — Tactical Brief", classification: "SECRET", pages: 64 },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    WANTED: "bg-red-900/60 text-red-300 border-red-700",
    "UNDER SURVEILLANCE": "bg-yellow-900/60 text-yellow-300 border-yellow-700",
    "IN CUSTODY": "bg-green-900/60 text-green-300 border-green-700",
    CLASSIFIED: "bg-purple-900/60 text-purple-300 border-purple-700",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border ${colors[status] || "bg-muted text-muted-foreground border-border"}`}>
      {status}
    </span>
  );
}

export default function Database() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const filteredSubjects = fakeSubjects.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.caseFile.toLowerCase().includes(query.toLowerCase())
  );

  const handleLogin = () => {
    // Any password works — it's fake
    if (password.length >= 1) {
      setAccessGranted(true);
    } else {
      setLoginError(true);
    }
  };

  if (!accessGranted) {
    return (
      <Layout>
        <section className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="bg-gradient-card border border-gold rounded-lg p-8 text-center space-y-6">
              <ShieldAlert className="h-16 w-16 text-primary mx-auto" />
              <div>
                <h1 className="text-2xl font-bold text-primary font-serif tracking-wider">FIB SECURE DATABASE</h1>
                <p className="text-muted-foreground text-xs mt-2 tracking-wider">AUTHORIZED PERSONNEL ONLY</p>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Enter access code..."
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setLoginError(false); }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="w-full bg-background border border-border rounded-md py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                {loginError && (
                  <p className="text-red-400 text-xs">Access code required.</p>
                )}
                <button
                  onClick={handleLogin}
                  className="w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-bold tracking-wider hover:opacity-90 transition-opacity"
                >
                  ACCESS DATABASE
                </button>
              </div>
              <p className="text-muted-foreground/50 text-[10px] tracking-wider">
                UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE — 18 U.S.C. § 1030
              </p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="py-20 px-4 border-b border-gold">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShieldAlert className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary font-serif tracking-wider">
              FIB FEDERAL DATABASE
            </h1>
          </div>
          <p className="text-center text-muted-foreground text-xs tracking-[0.3em]">
            CLASSIFIED — FOR OFFICIAL USE ONLY — PARADISE STATE JURISDICTION
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 text-xs font-mono">SYSTEM ONLINE — CLEARANCE LEVEL: AGENT</span>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search subject name or case file number..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSearched(true); }}
              className="w-full bg-gradient-card border border-gold rounded-md py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono"
            />
          </div>
          {!searched && (
            <p className="text-muted-foreground/60 text-xs text-center mt-3 font-mono">
              Enter a query to search the federal database...
            </p>
          )}
        </div>
      </section>

      {/* Results */}
      {searched && (
        <section className="pb-10 px-4">
          <div className="container mx-auto max-w-3xl space-y-3">
            <p className="text-muted-foreground text-xs font-mono">
              {filteredSubjects.length} RECORD(S) FOUND
            </p>
            {filteredSubjects.map((subject, i) => (
              <div key={i} className="bg-gradient-card border border-gold rounded-lg p-5 space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="text-foreground font-bold font-mono">{subject.name}</h3>
                    <p className="text-muted-foreground text-xs font-mono">Case: {subject.caseFile}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={subject.status} />
                    <span className="text-[10px] font-bold tracking-wider text-muted-foreground border border-border rounded px-1.5 py-0.5">
                      THREAT: {subject.threat}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  <span className="text-foreground/60">Last Known Location:</span> {subject.lastSeen}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {subject.charges.map((c, j) => (
                    <span key={j} className="bg-background border border-border rounded px-2 py-0.5 text-[10px] text-foreground/70 font-mono">
                      {c}
                    </span>
                  ))}
                </div>
                <div className="bg-background/50 border border-border rounded p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] font-bold text-muted-foreground tracking-wider">INTEL NOTES</span>
                  </div>
                  <p className="text-xs text-foreground/60 font-mono leading-relaxed">{subject.notes}</p>
                </div>
              </div>
            ))}
            {filteredSubjects.length === 0 && (
              <div className="text-center py-10">
                <EyeOff className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm font-mono">NO RECORDS MATCH YOUR QUERY</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Redacted Files */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <FileWarning className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground font-serif">Classified Documents</h2>
          </div>
          <div className="space-y-2">
            {redactedFiles.map((file, i) => (
              <div key={i} className="bg-gradient-card border border-gold rounded-lg p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Lock className="h-4 w-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground font-mono truncate">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{file.pages} pages</p>
                  </div>
                </div>
                <span className="shrink-0 bg-red-900/40 text-red-300 border border-red-800 rounded px-2 py-0.5 text-[10px] font-bold tracking-wider">
                  {file.classification}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-gradient-card border border-gold rounded-lg p-6 text-center">
            <AlertTriangle className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-muted-foreground text-xs font-mono tracking-wider">
              NOTICE: ALL DATABASE ACTIVITY IS MONITORED AND LOGGED.
              <br />
              UNAUTHORIZED DISSEMINATION OF CLASSIFIED MATERIAL IS PUNISHABLE UNDER FEDERAL LAW.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
