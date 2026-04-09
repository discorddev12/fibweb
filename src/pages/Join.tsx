import { CheckCircle, AlertTriangle } from "lucide-react";
import Layout from "@/components/Layout";

const requirements = [
  "Must be an active member of Paradise State Roleplay (PSRP)",
  "Minimum age of 16 years old",
  "Clean disciplinary record within PSRP",
  "Ability to follow chain of command and standard operating procedures",
  "Willingness to undergo FIB Academy training",
  "Active on Discord and in-server regularly",
];

export default function Join() {
  return (
    <Layout>
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-6">Join the FIB</h1>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-8" />
          <p className="text-foreground/70 text-lg">
            Think you have what it takes to serve in the Federal Investigation Bureau? 
            Review the requirements below and submit your application.
          </p>
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground font-serif mb-6">Requirements</h2>
          <div className="bg-gradient-card rounded-lg p-8 border border-gold space-y-4">
            {requirements.map((r) => (
              <div key={r} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground/80 text-sm">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground font-serif mb-6">Application Process</h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Submit Application", desc: "Fill out the application form on our Discord server in the designated channel." },
              { step: "2", title: "Interview", desc: "Selected applicants will be contacted for a brief interview with FIB command staff." },
              { step: "3", title: "Academy Training", desc: "Accepted recruits will undergo FIB Academy training covering procedures, tactics, and protocols." },
              { step: "4", title: "Field Assignment", desc: "Upon graduation, you'll be assigned as an Agent Trainee and begin active fieldwork." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 bg-gradient-card rounded-lg p-6 border border-gold">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-gradient-card rounded-lg p-8 border border-gold glow-gold text-center">
            <AlertTriangle className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground font-serif mb-3">Ready to Apply?</h3>
            <p className="text-muted-foreground mb-6">
              Applications are handled through our PSRP Discord server. Click below to join and find the FIB application channel.
            </p>
            <a
              href="https://discord.gg/b2tzYpZxuy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-bold tracking-wider text-primary-foreground transition-all hover:opacity-90 glow-gold"
            >
              JOIN DISCORD & APPLY
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
