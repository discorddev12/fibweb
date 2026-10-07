import { useState } from "react";
import { Lock } from "lucide-react";
import Layout from "@/components/Layout";

const PASS = "fib2nd";

export default function SecondDept() {
  const [ok, setOk] = useState(() => sessionStorage.getItem("fib2nd") === "1");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === PASS) { sessionStorage.setItem("fib2nd", "1"); setOk(true); }
    else { setErr(true); setPw(""); }
  };
  return (
    <Layout>
      {ok ? <RankSheet /> : (
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <form onSubmit={submit} className="w-full max-w-sm rounded-lg border border-gold bg-card p-6 text-center">
            <Lock className="mx-auto h-10 w-10 text-primary" />
            <h1 className="mt-3 text-2xl font-bold tracking-widest text-primary">RESTRICTED</h1>
            <p className="mt-1 text-sm text-muted-foreground">2nd Department Hub — authorized ranks only.</p>
            <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(false); }} placeholder="Access code" className="mt-5 w-full rounded border border-border bg-background px-3 py-2 font-mono text-foreground" autoFocus />
            {err && <p className="mt-2 text-sm font-bold text-destructive">PERMISSION NOT GRANTED</p>}
            <button type="submit" className="mt-4 w-full rounded bg-primary py-2 font-bold tracking-wider text-primary-foreground hover:opacity-90">UNLOCK</button>
          </form>
        </div>
      )}
    </Layout>
  );
}

type Tier = "command" | "super" | "officer" | "locked";
type Rank = { name: string; tier: Tier };

const mk = (pink: string[], red: string[], blue: string[]): Rank[] => [
  ...pink.map((name) => ({ name, tier: "command" as Tier })),
  ...red.map((name) => ({ name, tier: "super" as Tier })),
  ...blue.map((name) => ({ name, tier: "officer" as Tier })),
];

const FIB: Rank[] = [
  { name: "Branch Director", tier: "locked" },
  { name: "Asst. Branch Director", tier: "locked" },
  { name: "Head Special Agent", tier: "locked" },
  ...mk(
    ["Asst. Special Agent", "Executive Agent"],
    ["Supervisory Special Agent", "Senior Special Agent", "Special Agent", "Field Agent", "Jr. Agent", "Agent"],
    ["Agent Trainee"],
  ),
];

const DEPTS: Record<string, Rank[]> = {
  BCSO: mk(["Colonel"], ["Lieutenant Colonel", "Major", "Captain", "Lieutenant", "Master Sergeant", "Staff Sergeant", "First Sergeant"], ["Corporal", "Lance Corporal", "Junior Corporal", "Senior Deputy", "Deputy First Class", "Probationary Deputy"]),
  LSPD: mk(["Major"], ["Lieutenant Major", "Captain", "Lieutenant", "Watch Commander", "Staff Sergeant", "Sergeant"], ["Corporal", "Senior Officer", "Patrol Officer II", "Patrol Officer I", "Probationary Officer"]),
  PBPD: mk(["Major"], ["Captain", "Lieutenant", "Sergeant First Class"], ["Staff Sergeant", "Sergeant", "Corporal", "Master Officer", "Senior Officer", "Officer", "Probationary Officer"]),
  SAHP: mk(["Lt. Colonel"], ["Major", "Captain", "Lieutenant", "Deputy Lieutenant", "Staff Sergeant", "Sergeant"], ["Master Corporal", "Corporal", "Master Officer", "Officer III", "Officer II", "Officer I"]),
  SAST: mk(["Sergeant Commander"], ["Commander", "Major", "Captain", "Lieutenant", "Sergeant First Class", "Corporal"], ["Master Trooper", "Senior Trooper", "Trooper First Class", "Trooper", "Probationary Trooper"]),
};

const TIER_CLS: Record<Tier, string> = {
  command: "tier-command",
  super: "tier-super",
  officer: "tier-officer",
  locked: "tier-locked",
};
const TIER_LABEL: Record<Tier, string> = { command: "Pink · Command", super: "Red · Supervisor", officer: "Blue · Officer", locked: "Yellow · Not transferable" };

const RULES = [
  "You can only be in 1 Federal Department and 1 Local/County Department.",
  "If you have been striked in the last 7 days you are ineligible for joining a 2nd Department.",
  "Probationary units are not eligible to open a 2nd Department ticket.",
  "Units below Supervisor are placed within the lower ranks (typically Rank 1–3), at the discretion of the department handler.",
  "Supervisor+ units may be placed at Pre-Supervisor or below and must complete an interview before advancing.",
  "Low Command+ units may be placed within the first three Supervisor ranks, based on discretion and department needs.",
];

function RankSheet() {
  const [sel, setSel] = useState<{ dept: string; rank: Rank } | null>(null);
  const probationary = sel?.rank.name.toLowerCase().includes("probationary");
  const results = sel && !probationary ? FIB.filter((r) => r.tier === sel.rank.tier) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-8 text-center">
        <p className="font-bold tracking-[0.4em] text-primary text-sm">FEDERAL INVESTIGATION BUREAU</p>
        <h1 className="font-bold text-5xl md:text-6xl font-bold uppercase mt-2">2nd Dept Rank Sheet</h1>
        <p className="text-muted-foreground mt-3">Click a unit's current rank to see which FIB ranks they can be given.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Object.entries(DEPTS).map(([dept, ranks]) => (
            <div key={dept} className="rounded-lg border bg-card p-2">
              <h2 className="font-bold text-xl text-center py-1 tracking-wider">{dept}</h2>
              <div className="flex flex-col gap-1">
                {ranks.map((r) => {
                  const active = sel?.dept === dept && sel.rank.name === r.name;
                  return (
                    <button
                      key={r.name}
                      onClick={() => setSel({ dept, rank: r })}
                      className={`${TIER_CLS[r.tier]} rounded px-2 py-1.5 text-sm font-semibold transition hover:brightness-125 ${active ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""}`}
                    >
                      {r.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <aside className="lg:sticky lg:top-6 h-fit rounded-lg border-2 border-primary/50 bg-card p-5">
          <h2 className="font-bold text-2xl uppercase text-primary">Available FIB Ranks</h2>
          {!sel && <p className="text-muted-foreground mt-3 text-sm">Select a rank on the left.</p>}
          {sel && (
            <>
              <p className="mt-3 text-sm text-muted-foreground">Transferring from</p>
              <p className="font-semibold">{sel.dept} — {sel.rank.name}</p>
              <span className={`${TIER_CLS[sel.rank.tier]} inline-block mt-2 rounded px-2 py-0.5 text-xs font-bold`}>{TIER_LABEL[sel.rank.tier]}</span>
              {probationary ? (
                <p className="mt-4 rounded border border-destructive bg-muted p-3 text-sm">Probationary units are <b>not eligible</b> to open a 2nd Department ticket.</p>
              ) : (
                <div className="mt-4 flex flex-col gap-1.5">
                  {results.map((r) => (
                    <div key={r.name} className={`${TIER_CLS[r.tier]} rounded px-3 py-2 font-semibold`}>{r.name}</div>
                  ))}
                  <p className="text-xs text-muted-foreground mt-2">Only these ranks may be given. Final pick is at the department handler's discretion.</p>
                </div>
              )}
            </>
          )}
        </aside>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-5">
          <h2 className="font-bold text-2xl uppercase mb-3">FIB Roster</h2>
          <div className="flex flex-col gap-1">
            {FIB.map((r) => <div key={r.name} className={`${TIER_CLS[r.tier]} rounded px-3 py-1.5 text-sm font-semibold`}>{r.name}</div>)}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <h2 className="font-bold text-2xl uppercase mb-3">Rules</h2>
          <ol className="list-decimal pl-5 space-y-2 text-sm">{RULES.map((r) => <li key={r}>{r}</li>)}</ol>
          <h3 className="font-bold text-xl uppercase mt-6 mb-2">Color Mapping</h3>
          <ul className="space-y-1.5 text-sm">
            {(Object.keys(TIER_LABEL) as Tier[]).map((t) => (
              <li key={t} className="flex items-center gap-2"><span className={`${TIER_CLS[t]} h-4 w-4 rounded`} />{TIER_LABEL[t]}{t !== "locked" && " → same color in FIB"}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
