import { Link } from "react-router-dom";
import { Shield, Target, Users, Eye } from "lucide-react";
import Layout from "@/components/Layout";
import heroBanner from "@/assets/hero-banner.jpg";
import fibBadge from "@/assets/fib-badge.png";

const values = [
  { icon: Shield, title: "Integrity", desc: "Upholding the highest standards of law and justice across Paradise State." },
  { icon: Target, title: "Precision", desc: "Every operation is executed with surgical accuracy and unwavering focus." },
  { icon: Users, title: "Unity", desc: "Working together as one force to protect and serve the citizens." },
  { icon: Eye, title: "Vigilance", desc: "Always watching, always ready to respond to threats against the state." },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <img src={heroBanner} alt="FIB Headquarters" className="absolute inset-0 w-full h-full object-cover opacity-40" width={1920} height={800} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <img src={fibBadge} alt="FIB Badge" className="mx-auto mb-6 h-28 w-28 drop-shadow-2xl" />
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gradient-gold mb-4">
            Federal Investigation Bureau
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 mb-2 tracking-widest uppercase text-sm font-medium">
            Paradise State Roleplay — PSRP
          </p>
          <p className="text-foreground/60 max-w-2xl mx-auto mt-4 mb-8 leading-relaxed">
            Protecting the citizens of Paradise State through unwavering dedication, 
            elite training, and absolute commitment to justice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/join"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-bold tracking-wider text-primary-foreground transition-all hover:opacity-90 glow-gold"
            >
              APPLY NOW
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center rounded-md border border-gold px-8 py-3 text-sm font-bold tracking-wider text-primary transition-all hover:bg-primary/10"
            >
              LEARN MORE
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-gold mb-6">Our Mission</h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-8" />
          <p className="text-foreground/70 text-lg leading-relaxed">
            The Federal Investigation Bureau (FIB) is the premier federal law enforcement agency 
            operating within Paradise State. Our mission is to protect the state and its citizens 
            from organized crime, corruption, terrorism, and high-profile criminal activity. We 
            operate with the full authority of the federal government, ensuring peace and order 
            across all jurisdictions.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-gold text-center mb-12">Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-gradient-card rounded-lg p-6 border border-gold glow-gold text-center">
                <v.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2 font-serif">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
