import { Star, Award, Shield, ChevronDown, Users } from "lucide-react";
import Layout from "@/components/Layout";

const ranks = [
  {
    tier: "Executive Leadership",
    icon: Star,
    members: [
      { rank: "1S-01 — Director", name: "A.Aaron", role: "Responsible for leading the Federal Investigation Bureau. The Director oversees all department operations, ensuring growth and organizational structure. All major decisions within the department require approval from the Director, who ultimately makes executive decisions." },
      { rank: "1S-02 — Deputy Director", name: "S.Seb", role: "Responsibilities as deputy director include assisting the director and leading prominent investigations. All other FIB executives and special agents in charge report to the director through the deputy director." },
      { rank: "1S-03 — Assistant Deputy Director", name: "M.JJ", role: "Is the 3rd in command of the FIB, any reports of any of the agents below will be appointed to him. As the assistant deputy director, he works back-to-back with the deputy director to see who will be the next one up in charge of running a group." },
      { rank: "1S-04 — Deputy Chief of Staff", name: "N/A", role: "Is the 4th in command of the FIB, supports executives in their roles. Takes part on small responsibilities while also strategically and smoothly plan processes across the FIB department to ensure dedicated experience." },
      { rank: "1S-05 — Associate Deputy Director", name: "N/A", role: "Takes part as 5th in command of the FIB, they have the responsibility for any hands-on management activities. Handle daily basic responsibilities and tasks to keep FIB department running smoothly and consistently. They also typically set and communicate different goals to have the department run smoothly." },
    ],
  },
  {
    tier: "Special Coordinators",
    icon: Award,
    members: [
      { rank: "2S-06 → 2S-11 — Special Coordinator", name: "K.Krispy, J. Davis, O. Dory", role: "The Special Coordinators is a big step, they are tasked with helping with our daily and weekly task from posting Song of the Day to our weekly promotions. They are the Department Heads right hand when getting our tasks completed." },
    ],
  },
  {
    tier: "Low Command",
    icon: Shield,
    members: [
      { rank: "2S — Branch Director", name: "", role: "" },
      { rank: "2S — Assistant Branch Director", name: "", role: "" },
      { rank: "2S — Head Special Agent", name: "", role: "" },
      { rank: "2S — Assistant Special Agent in Charge", name: "", role: "" },
    ],
  },
  {
    tier: "Supervisor Eligible",
    icon: Users,
    members: [
      { rank: "3S — Executive Agent", name: "", role: "" },
      { rank: "3S — Supervisory Special Agent", name: "", role: "" },
      { rank: "3S — Senior Special Agent", name: "", role: "" },
    ],
  },
  {
    tier: "Field Agents",
    icon: ChevronDown,
    members: [
      { rank: "4S — Special Agent", name: "", role: "" },
      { rank: "4S — Field Agent", name: "", role: "" },
      { rank: "5S — Jr. Agent", name: "", role: "" },
      { rank: "5S — Agent II", name: "", role: "" },
      { rank: "5S — Agent I", name: "", role: "" },
      { rank: "6S — Agent Trainee", name: "", role: "Probationary Agent — Div Eligible" },
    ],
  },
];

export default function ChainOfCommand() {
  return (
    <Layout>
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-6">Chain of Command</h1>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-8" />
          <p className="text-foreground/70 text-lg">
            Our Command Staff is dedicated to nurturing strong relationships with our Agents, 
            ensuring their success both within the FIB and in their personal lives. With a focus on 
            personal development, training, and career advancement, our Command Staff is unmatched.
          </p>
        </div>
      </section>

      <section className="pb-24 px-4">
        <div className="container mx-auto max-w-3xl space-y-8">
          {ranks.map((tier, i) => (
            <div key={tier.tier}>
              <div className="flex items-center gap-3 mb-4">
                <tier.icon className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground font-serif">{tier.tier}</h2>
              </div>
              <div className="space-y-3 ml-9">
                {tier.members.map((m) => (
                  <div key={m.rank} className="bg-gradient-card rounded-lg p-5 border border-gold">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-primary text-sm tracking-wide uppercase">{m.rank}</h3>
                      {m.name && <span className="text-foreground font-medium">{m.name}</span>}
                    </div>
                    {m.role && <p className="text-muted-foreground text-sm">{m.role}</p>}
                  </div>
                ))}
              </div>
              {i < ranks.length - 1 && (
                <div className="flex justify-center my-6">
                  <div className="w-px h-8 bg-primary/30" />
                </div>
              )}
            </div>
          ))}
          <p className="text-center text-muted-foreground text-sm mt-8">
            If you have any questions, please consult the rank above you!
          </p>
        </div>
      </section>
    </Layout>
  );
}
