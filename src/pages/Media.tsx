import { Camera, Video, Newspaper } from "lucide-react";
import Layout from "@/components/Layout";
import heroBanner from "@/assets/hero-banner.jpg";

const newsItems = [
  { date: "2026-04-05", title: "FIB Successfully Dismantles Major Drug Ring", excerpt: "In a coordinated operation, FIB agents arrested 12 suspects linked to a large-scale narcotics trafficking network." },
  { date: "2026-03-28", title: "New Special Operations Unit Deployed", excerpt: "The FIB has activated a new tactical unit specializing in high-risk operations across Paradise State." },
  { date: "2026-03-15", title: "FIB Academy Graduates New Class of Agents", excerpt: "15 new agent trainees have completed the rigorous FIB training program and are now field-ready." },
];

export default function Media() {
  return (
    <Layout>
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-6">Media Center</h1>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-8" />
          <p className="text-foreground/70 text-lg">
            Stay updated with the latest news, press releases, and media from the Federal Investigation Bureau.
          </p>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <Camera className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground font-serif">Gallery</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-video rounded-lg overflow-hidden border border-gold glow-gold">
                <img
                  src={heroBanner}
                  alt={`FIB Operations ${i}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <Newspaper className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground font-serif">Latest News</h2>
          </div>
          <div className="space-y-4">
            {newsItems.map((n) => (
              <div key={n.title} className="bg-gradient-card rounded-lg p-6 border border-gold hover:glow-gold transition-shadow">
                <span className="text-xs text-primary font-medium tracking-wider uppercase">{n.date}</span>
                <h3 className="text-lg font-bold text-foreground mt-1 mb-2 font-serif">{n.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{n.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
