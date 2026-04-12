import { useState } from "react";
import { Satellite } from "lucide-react";

const blips = [
  { id: "HVT-9021", x: 35, y: 30, label: "VINEWOOD HILLS", speed: "120MPH", angle: 45 },
  { id: "HVT-4478", x: 65, y: 55, label: "MISSION ROW", speed: "87MPH", angle: 120 },
  { id: "HVT-1139", x: 20, y: 70, label: "SANDY SHORES", speed: "65MPH", angle: 200 },
  { id: "HVT-7760", x: 75, y: 25, label: "PALETO BAY", speed: "42MPH", angle: 310 },
];

export default function SatLinkRadar() {
  const [hoveredBlip, setHoveredBlip] = useState<string | null>(null);

  return (
    <div className="bg-gradient-card border border-gold rounded-lg p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <Satellite className="h-4 w-4 text-primary" />
        <span className="text-xs font-bold text-primary font-mono tracking-[0.3em]">LIVE SAT-LINK</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-green-400 font-mono">ACTIVE</span>
        </div>
      </div>

      {/* Radar container */}
      <div className="relative w-full aspect-square max-w-[300px] mx-auto rounded-full border border-primary/30 bg-background/80 overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-[1px] bg-primary/10" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-[1px] bg-primary/10" />
        </div>
        <div className="absolute inset-[15%] rounded-full border border-primary/10" />
        <div className="absolute inset-[35%] rounded-full border border-primary/10" />

        {/* Radar sweep */}
        <div className="absolute inset-0 animate-[radar-sweep_4s_linear_infinite] origin-center">
          <div
            className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
            style={{
              background: "conic-gradient(from 0deg at 0% 100%, transparent 0deg, hsl(42 78% 55% / 0.25) 30deg, transparent 60deg)",
            }}
          />
        </div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary/80" />

        {/* Blips */}
        {blips.map((b) => (
          <div
            key={b.id}
            className="absolute group cursor-pointer z-10"
            style={{ left: `${b.x}%`, top: `${b.y}%`, transform: "translate(-50%, -50%)" }}
            onMouseEnter={() => setHoveredBlip(b.id)}
            onMouseLeave={() => setHoveredBlip(null)}
          >
            {/* Ping ring */}
            <div className="absolute inset-[-6px] rounded-full border border-primary/40 animate-ping" />
            {/* Blip dot */}
            <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(42_78%_55%/0.6)]" />

            {/* Tooltip */}
            {hoveredBlip === b.id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-background border border-primary/50 rounded px-3 py-2 min-w-[200px] z-20 shadow-lg">
                <p className="text-primary text-[10px] font-bold font-mono tracking-wider mb-1">TRACKING {b.id}...</p>
                <p className="text-foreground/70 text-[10px] font-mono">LOCATION: {b.label}</p>
                <p className="text-foreground/70 text-[10px] font-mono">SPEED: {b.speed}</p>
                <p className="text-green-400 text-[10px] font-mono mt-1 animate-pulse">● SIGNAL LOCKED</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-muted-foreground/40 text-[9px] font-mono mt-3 tracking-wider">
        SAT-LINK v4.2 — ENCRYPTED FEED — PARADISE STATE
      </p>
    </div>
  );
}
