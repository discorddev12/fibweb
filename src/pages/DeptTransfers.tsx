import { useState } from "react";
import Layout from "@/components/Layout";

type Rank = { name: string; purple?: boolean; blocked?: string };
type Dept = { key: string; label: string; offset: number; ranks: Rank[] };

const PROB = "Probationary / trainee ranks cannot transfer.";
const HEAD = "Department Heads cannot transfer.";

const DEPTS: Dept[] = [
  {
    key: "FIB",
    label: "FIB",
    offset: 0,
    ranks: [
      { name: "Branch Director", blocked: HEAD },
      { name: "Asst. Branch Director", purple: true },
      { name: "Head Special Agent" },
      { name: "Asst. Special Agent" },
      { name: "Executive Agent" },
      { name: "Supervisory Special Agent" },
      { name: "Senior Special Agent" },
      { name: "Special Agent" },
      { name: "Field Agent" },
      { name: "Jr. Agent" },
      { name: "Agent" },
      { name: "Agent Trainee", blocked: PROB },
    ],
  },
  {
    key: "SASM",
    label: "SASM",
    offset: 1,
    ranks: [
      { name: "Grand Marshal", purple: true },
      { name: "Senior Intelligence Marshal" },
      { name: "Intelligence Marshal" },
      { name: "Supervisory Inspector Marshal" },
      { name: "Supervisory Deputy Marshal" },
      { name: "Deputy Marshal" },
      { name: "Senior Inspector Marshal" },
      { name: "Inspector Marshal" },
      { name: "Tactical Marshal" },
      { name: "Field Operations Marshal" },
      { name: "Probationary Marshal", blocked: PROB },
    ],
  },
  {
    key: "HSB",
    label: "HSB",
    offset: 1,
    ranks: [
      { name: "Executive Special Agent", purple: true },
      { name: "Special Agent in Charge" },
      { name: "Assistant Special Agent in Charge" },
      { name: "Head Special Agent" },
      { name: "Assistant Head Special Agent" },
      { name: "Supervisory Special Agent" },
      { name: "Special Agent" },
      { name: "Sr. Field Agent" },
      { name: "Field Agent" },
      { name: "Jr. Field Agent" },
      { name: "Sr. Agent" },
      { name: "Agent" },
      { name: "JR Agent" },
      { name: "Cadet Agent", blocked: PROB },
    ],
  },
];

const RULES = [
  "Probationary LEO / Agent Trainee and any LEO Department Heads cannot transfer.",
  "All transfers will demote you 1 rank down.",
  "You will NOT receive a promotion the week of your transfer.",
  "You are only allowed to transfer once per month.",
  "Make your decision wisely — you are committing to that department until the next transfers open.",
  "You cannot transfer from a county department to a federal one or vice versa.",
];

// Rank in the target department for a unit coming from another one.
function resolve(from: Dept, rank: Rank, to: Dept): Rank {
  const idx = from.ranks.indexOf(rank);
  const purpleIdx = to.ranks.findIndex((r) => r.purple);
  let target: number;
  if (rank.purple) {
    target = purpleIdx + 1; // 1 under low command
  } else {
    const level = idx + from.offset; // shared "level" scale across departments
    target = level + 1 - to.offset; // demoted by 1
  }
  target = Math.max(0, Math.min(to.ranks.length - 1, target));
  return to.ranks[target];
}

export default function DeptTransfers() {
  const [sel, setSel] = useState<{ dept: Dept; rank: Rank } | null>(null);
  const others = sel ? DEPTS.filter((d) => d.key !== sel.dept.key) : [];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <header className="mb-8 text-center">
          <p className="text-sm font-bold tracking-[0.4em] text-primary">FEDERAL INVESTIGATION BUREAU</p>
          <h1 className="mt-2 text-4xl font-bold uppercase md:text-6xl">Dept Transfers Rank Sheet</h1>
          <p className="mt-3 text-muted-foreground">
            Monthly federal-to-federal transfers open on the <b className="text-primary">1st of every month</b>. Click your current rank to see what you would receive.
          </p>
        </header>

        <section className="mb-6 rounded-lg border-2 border-destructive/60 bg-card p-5">
          <h2 className="text-xl font-bold uppercase text-destructive">Read before transferring</h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm">
            {RULES.map((r) => <li key={r}>{r}</li>)}
          </ol>
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Lack of effort / reason in the request may result in a denial.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-3 md:grid-cols-3">
            {DEPTS.map((d) => (
              <div key={d.key} className="rounded-lg border bg-card p-2">
                <h2 className="py-1 text-center text-xl font-bold tracking-wider">{d.label}</h2>
                <div className="flex flex-col gap-1">
                  {d.ranks.map((r) => {
                    const active = sel?.dept.key === d.key && sel.rank.name === r.name;
                    return (
                      <button
                        key={r.name}
                        onClick={() => setSel({ dept: d, rank: r })}
                        className={`rounded px-2 py-1.5 text-sm font-semibold transition hover:brightness-125 ${
                          r.purple ? "tier-low" : "bg-secondary text-secondary-foreground"
                        } ${r.blocked ? "opacity-60" : ""} ${active ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""}`}
                      >
                        {r.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-lg border-2 border-primary/50 bg-card p-5 lg:sticky lg:top-24">
            <h2 className="text-2xl font-bold uppercase text-primary">Transfer Result</h2>
            {!sel && <p className="mt-3 text-sm text-muted-foreground">Select your current rank on the left.</p>}
            {sel && (
              <>
                <p className="mt-3 text-sm text-muted-foreground">Transferring from</p>
                <p className="font-semibold">{sel.dept.label} — {sel.rank.name}</p>
                {sel.rank.purple && <span className="tier-low mt-2 inline-block rounded px-2 py-0.5 text-xs font-bold">Low Command</span>}
                {sel.rank.blocked ? (
                  <p className="mt-4 rounded border border-destructive bg-muted p-3 text-sm">
                    <b>Not eligible.</b> {sel.rank.blocked}
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {others.map((d) => {
                      const res = resolve(sel.dept, sel.rank, d);
                      return (
                        <div key={d.key}>
                          <p className="text-xs font-bold tracking-wider text-muted-foreground">{d.label}</p>
                          <div className={`${res.purple ? "tier-low" : "bg-secondary text-secondary-foreground"} rounded px-3 py-2 font-semibold`}>
                            {res.name}
                          </div>
                        </div>
                      );
                    })}
                    <p className="text-xs text-muted-foreground">
                      Includes the 1-rank demotion. Final placement is at the department handler's discretion.
                    </p>
                  </div>
                )}
              </>
            )}
          </aside>
        </section>

        <p className="mt-6 flex items-center gap-2 text-sm">
          <span className="tier-low inline-block h-4 w-4 rounded" />
          Purple = low command in their department, so they get 1 rank under low command in ours.
        </p>
      </div>
    </Layout>
  );
}
