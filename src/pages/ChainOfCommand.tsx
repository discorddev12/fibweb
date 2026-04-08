import { Star, Award, Shield, ChevronDown } from "lucide-react";
import Layout from "@/components/Layout";

const ranks = [
  {
    tier: "Executive Leadership",
    icon: Star,
    members: [
      { rank: "Director", name: "1S-01 A.Aaron", role: "Oversees all FIB operations and reports to federal leadership." },
      { rank: "Deputy Director", name: "1S-02 Seb", role: "Second in command, manages day-to-day Bureau operations." },
      { rank: "Assistant Deputy Director", name: "1S-03 M.JJ", role: "Assists the Deputy Director and oversees divisional coordination." },
    ],
  },
  {
    tier: "Senior Command",
    icon: Award,
    members: [
      { rank: "Special Agent in Charge (SAC)", name: "Open Positions", role: "Commands field offices and major operation centers." },
    ],
  },
  {
    tier: "Field Leadership",
    icon: Shield,
    members: [
      { rank: "Supervisory Special Agent", name: "Open Positions", role: "Supervises field teams and active investigations." },
      { rank: "Senior Special Agent", name: "Open Positions", role: "Experienced agent leading critical operations." },
    ],
  },
  {
    tier: "Field Agents",
    icon: ChevronDown,
    members: [
      { rank: "Special Agent", name: "Open Positions", role: "Core investigative role handling cases and fieldwork." },
      { rank: "Agent Trainee", name: "Open Positions", role: "New recruits undergoing FIB academy training." },
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
            The FIB operates under a structured chain of command to ensure effective 
            leadership and accountability at every level.
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h3 className="font-bold text-primary text-sm tracking-wide uppercase">{m.rank}</h3>
                      <span className="text-foreground font-medium">{m.name}</span>
                    </div>
                    <p className="text-muted-foreground text-sm">{m.role}</p>
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
        </div>
      </section>
    </Layout>
  );
}
