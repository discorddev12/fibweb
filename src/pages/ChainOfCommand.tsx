import Layout from "@/components/Layout";

const executives = [
  {
    title: "Director of FIB",
    tag: "@1S-01 | Aaron",
    desc: "Responsible for leading the Federal Investigation Bureau, the premier federal law enforcement agency in the United States. The Director oversees all department operations, ensuring growth and organizational structure. All major decisions within the department require approval from the Director, who ultimately makes executive decisions.",
  },
  {
    title: "Deputy Director",
    tag: "@1S-02 | J. Davis",
    desc: "Responsibilities as deputy director include assisting the director and leading prominent investigations. All other FIB executives and special agents in charge report to the director through the deputy director.",
  },
  {
    title: "Assistant Deputy Director",
    tag: "@1S-03 | O. Dory",
    desc: "Is the 3rd in command of the FIB, any reports of any of the agents below will be appointed to him. As the assistant deputy director, he works back-to-back with the deputy director to see who will be the next one up in charge of running a group.",
  },
  {
    title: "Deputy Chief Of Staff",
    tag: "@1S-04 Oscatt",
    desc: "Is the 4th in command of the FIB, supports executives in their roles. Takes part on small responsibilities while also strategically and smoothly plan processes across the FIB department to ensure dedicated experience.",
  },
  {
    title: "Associate Deputy Director",
    tag: "@# 1S-05 | T. Williams",
    desc: "Takes part as 5th in command of the FIB, they have the responsibility for any activities that Special Coordinator's. handle daily basic responsibilities and tasks to keep the department running smoothly and consistently. They also typically set up different goals to have the department run at a high standard.",
  },
];

const coordinators = [
  { code: "2S-06", tag: "@2S-06 | Scratch" },
  { code: "2S-07", tag: "@2S-07 | H. Spirits" },
  { code: "2S-08", tag: "@2S-08 | H. Kit" },
  { code: "2S-09", tag: "@2S-09 | N/A" },
  { code: "2S-10", tag: "@2S-10 | N/A" },
  { code: "2S-11", tag: "2S-11 | P. Exadora" },
];

function Entry({ title, tag, desc }: { title: string; tag: string; desc: string }) {
  return (
    <div className="py-6">
      <h3 className="text-xl font-bold text-foreground mb-3">
        {title} - <span className="text-primary font-semibold">{tag}</span>
      </h3>
      <div className="border-l-2 border-primary/40 pl-4">
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
          {executives.map((e) => (
            <Entry key={e.title} {...e} />
          ))}

          <div className="py-6">
            <h3 className="text-xl font-bold text-foreground mb-3">Special Coordinator -</h3>
            <div className="border-l-2 border-primary/40 pl-4 mb-4">
              <p className="text-foreground/70 text-sm leading-relaxed">
                The Special Coordinators is a big step, they are tasked with helping with our daily and weekly task from reports and tickets to our weekly promotions. They are the Department Heads right hand when getting our tasks completed.
              </p>
            </div>
            <ul className="space-y-1 text-sm">
              {coordinators.map((c) => (
                <li key={c.code} className="text-muted-foreground">
                  {c.code} : <span className={c.tag === "N/A" ? "text-foreground/60" : "text-primary"}>{c.tag}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
}
