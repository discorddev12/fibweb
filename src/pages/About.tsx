import { Shield, Crosshair, Search, Zap } from "lucide-react";
import Layout from "@/components/Layout";

const divisions = [
  { icon: Search, name: "Criminal Investigation Division", desc: "Handles major criminal cases, organized crime, and high-profile investigations across Paradise State." },
  { icon: Shield, name: "Gang Task Force", desc: "Specialized unit dedicated to dismantling gang operations, tracking gang activity, and reducing organized street crime." },
  { icon: Zap, name: "H.E.A.T (High-Speed Enforcement & Apprehension Team)", desc: "High-speed pursuit unit specializing in vehicle interdiction, tactical driving, and rapid response operations." },
  { icon: Crosshair, name: "CRU (Crisis Response Unit)", desc: "The Bureau's elite SWAT team handling high-risk warrants, hostage situations, barricaded suspects, and counter-terrorism operations." },
];

export default function About() {
  return (
    <Layout>
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-6">About the FIB</h1>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-8" />
          <p className="text-foreground/70 text-lg leading-relaxed mb-6">
            The Federal Investigation Bureau is the top-tier federal law enforcement agency in 
            Paradise State Roleplay. Established to combat the most dangerous criminal organizations 
            and threats, the FIB operates with authority that transcends local jurisdiction.
          </p>
          <p className="text-foreground/60 leading-relaxed">
            Our agents undergo rigorous training and are held to the highest standards of 
            professionalism, integrity, and excellence. We work alongside local law enforcement 
            while maintaining federal oversight on matters of national security and organized crime.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gradient-gold text-center mb-12">Our Divisions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {divisions.map((d) => (
              <div key={d.name} className="bg-gradient-card rounded-lg p-8 border border-gold glow-gold">
                <d.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-3 font-serif">{d.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
