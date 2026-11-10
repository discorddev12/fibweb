import Layout from "@/components/Layout";

const executives = [
  {
    title: "Director",
    tag: "1S-01 | Aaron",
    desc: "Responsible for overall leadership, direction, and development of the FIB. Holds final approval over all departmental decisions, command appointments, policies, SOP changes, disciplinary actions, and structural modifications. The Director serves as the highest authority within the agency and ensures all divisions and command staff operate effectively.",
  },
  {
    title: "Deputy Director",
    tag: "1S-02 | J. Davis",
    desc: "Acts as the Director's second-in-command and oversees all executive operations within the department. Assists with strategic planning, command management, and department-wide initiatives. Assumes command authority in the Director's absence and ensures executive staff remain aligned with agency objectives.",
  },
  {
    title: "Assistant Deputy Director",
    sub: "Pre Command Oversight",
    tag: "1S-03 | M. Montoya",
    desc: "Responsible for overseeing all pre-command operations and ensuring departmental standards are maintained. Manages callsign assignments, inactivity reviews, activity requirements, and internal member tracking while ensuring personnel remain compliant with departmental expectations. Works closely with Executive Command to maintain organization, accountability, and readiness across the department.",
  },
  {
    title: "Chief of Staff",
    sub: "Division Oversight",
    tag: "LOA | 1S-04 | P. Exadora",
    desc: "Responsible for the oversight and coordination of all divisions, departmental regulations, and standard operating procedures. Works closely with Division Leads to ensure units remain active, effective, and compliant while maintaining the overall quality and consistency of departmental operations.",
  },
  {
    title: "Deputy Chief of Staff",
    sub: "Event Oversight",
    tag: "1S-05 | H. Kit",
    desc: "Responsible for the planning, organization, and supervision of all departmental events and agency activities. Ensures events are properly scheduled, documented, and executed while maintaining participation opportunities.",
  },
];

const coordinators = ["2S-06 | Little uwu Kitten", "2S-09 | A. Bucklord", "2S-10 | J. West", "2S-11 | B. Walsh"];

const ranks = [
  { tier: "2S", name: "Branch Director", note: "Low Command" },
  { tier: "2S", name: "Assistant Branch Director" },
  { tier: "2S", name: "Head Special Agent" },
  { tier: "2S", name: "Assistant Special Agent In Charge" },
  { tier: "3S", name: "Executive Agent" },
  { tier: "3S", name: "Supervisory Special Agent", note: "Supervisor Eligible" },
  { tier: "3S", name: "Senior Special Agent" },
  { tier: "4S", name: "Special Agent" },
  { tier: "4S", name: "Field Agent" },
  { tier: "5S", name: "Jr. Agent" },
  { tier: "5S", name: "Agent" },
  { tier: "6S", name: "Agent Trainee", note: "Probationary Agent · Div Eligible" },
];

function Entry({ title, sub, tag, desc }: { title: string; sub?: string; tag: string; desc: string }) {
  return (
    <div className="py-6">
      <h3 className="text-xl font-bold text-foreground mb-1">
        FIB - {title} - <span className="text-primary font-semibold">{tag}</span>
      </h3>
      {sub && <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">FIB - {sub}</p>}
      <div className="border-l-2 border-primary/40 pl-4 mt-2">
        <p className="text-foreground/70 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default function ChainOfCommand() {
  return (
    <Layout>
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-6">Chain of Command</h1>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-8" />
          <p className="text-foreground/70 text-lg">
            Our Command Staff is dedicated to nurturing strong relationships with our Agents,
            ensuring their success both within the FIB and in their personal lives.
          </p>
        </div>
      </section>

      <section className="pb-24 px-4">
        <div className="container mx-auto max-w-4xl divide-y divide-border">
          {executives.map((e) => <Entry key={e.title} {...e} />)}

          <div className="py-6">
            <h3 className="text-xl font-bold text-foreground mb-1">FIB - Special Coordinator</h3>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">2S-06 → 2S-11</p>
            <div className="border-l-2 border-primary/40 pl-4 mb-4">
              <p className="text-foreground/70 text-sm leading-relaxed">
                The Special Coordinators is a big step, they are tasked with helping with our daily and weekly task from posting Song of the Day to our weekly promotions. They are the Department Heads right hand when getting our tasks completed.
              </p>
            </div>
            <ul className="space-y-1 text-sm">
              {coordinators.map((c) => <li key={c} className="text-primary">{c}</li>)}
            </ul>
          </div>

          <div className="py-10">
            <h3 className="text-xl font-bold text-foreground mb-6 text-center">Rank Structure</h3>
            <div className="mx-auto flex max-w-md flex-col items-center">
              {ranks.map((r, i) => (
                <div key={r.name} className="flex w-full flex-col items-center">
                  {i > 0 && <span className="py-1 text-primary/70 text-sm">↑↑</span>}
                  <div className="w-full rounded border border-gold bg-card px-4 py-2 text-center">
                    <span className="mr-2 font-mono text-xs text-muted-foreground">{r.tier}</span>
                    <span className="font-semibold">FIB - {r.name}</span>
                    {r.note && <p className="text-xs text-primary">{r.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
