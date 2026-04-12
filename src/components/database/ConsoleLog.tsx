import { useEffect, useRef, useState } from "react";
import { Terminal } from "lucide-react";

const logPool = [
  { level: "INFO", msg: "Intercepting encrypted call on CH-447..." },
  { level: "INFO", msg: "Satellite imagery updated — sector 7G." },
  { level: "WARN", msg: "Multiple BOLOs detected in Mission Row..." },
  { level: "INFO", msg: "Agent 1S-04 checked into field office." },
  { level: "CRITICAL", msg: "Vault breach in Progress: Pacific Standard..." },
  { level: "INFO", msg: "Running plate scan... 59BRK841... MATCH FOUND." },
  { level: "WARN", msg: "Suspect vehicle spotted near Sandy Shores Airfield." },
  { level: "INFO", msg: "Decrypting intercepted comms... 73% complete." },
  { level: "INFO", msg: "Surveillance drone #4 repositioned." },
  { level: "WARN", msg: "Unusual network traffic from Los Santos PD servers." },
  { level: "CRITICAL", msg: "Code 10-99: Officer needs assistance — Vinewood Blvd." },
  { level: "INFO", msg: "Database sync complete — 14,392 records updated." },
  { level: "INFO", msg: "Facial recognition match: 94.2% confidence." },
  { level: "WARN", msg: "Encrypted radio burst detected — frequency 148.3 MHz." },
  { level: "INFO", msg: "Patrol unit en route to Del Perro Pier." },
  { level: "CRITICAL", msg: "Shots fired reported — Strawberry Ave & Innocence Blvd." },
  { level: "INFO", msg: "Wiretap authorization renewed — Case FIB-2024-00482." },
  { level: "WARN", msg: "Informant #221 missed scheduled check-in." },
  { level: "INFO", msg: "Helicopter N-48 on standby at Vespucci Helipad." },
  { level: "INFO", msg: "Cross-referencing fingerprint database... standby." },
];

function getTimestamp() {
  const now = new Date();
  return now.toTimeString().slice(0, 8);
}

function getLevelColor(level: string) {
  switch (level) {
    case "WARN": return "text-yellow-400";
    case "CRITICAL": return "text-red-400";
    default: return "text-green-400";
  }
}

export default function ConsoleLog() {
  const [logs, setLogs] = useState<{ time: string; level: string; msg: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    // Seed initial logs
    const initial = Array.from({ length: 8 }, () => {
      const entry = logPool[indexRef.current % logPool.length];
      indexRef.current++;
      return { time: getTimestamp(), ...entry };
    });
    setLogs(initial);

    const interval = setInterval(() => {
      const entry = logPool[indexRef.current % logPool.length];
      indexRef.current++;
      setLogs((prev) => [...prev.slice(-50), { time: getTimestamp(), ...entry }]);
    }, 1800 + Math.random() * 1200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-gradient-card border border-gold rounded-lg p-3 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <Terminal className="h-3.5 w-3.5 text-primary" />
        <span className="text-[10px] font-bold text-primary font-mono tracking-[0.2em]">SYSTEM CONSOLE</span>
        <div className="ml-auto flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] text-green-400 font-mono">LIVE</span>
        </div>
      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto bg-background/60 rounded p-2 font-mono text-[10px] leading-relaxed space-y-0.5 scrollbar-thin"
        style={{ maxHeight: 400 }}
      >
        {logs.map((log, i) => (
          <div key={i} className="flex gap-1.5 opacity-90">
            <span className="text-muted-foreground shrink-0">{log.time}</span>
            <span className={`shrink-0 ${getLevelColor(log.level)}`}>[{log.level.padEnd(8)}]</span>
            <span className="text-foreground/70">{log.msg}</span>
          </div>
        ))}
        <span className="text-primary animate-pulse">█</span>
      </div>
    </div>
  );
}
