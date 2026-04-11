import { ShieldAlert } from "lucide-react";
import { AgentProfile } from "@/hooks/use-agent";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Props {
  agent: AgentProfile;
  welcomeMessage?: string;
}

export default function AgentIDCard({ agent, welcomeMessage }: Props) {
  return (
    <div className="bg-gradient-card border border-gold rounded-lg overflow-hidden">
      {/* Header stripe */}
      <div className="bg-primary/20 border-b border-gold px-5 py-2 flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-primary" />
        <span className="text-[10px] font-bold text-primary tracking-[0.3em] font-mono">FIB — FEDERAL AGENT IDENTIFICATION</span>
      </div>

      <div className="p-5 flex gap-5">
        {/* Avatar */}
        <div className="shrink-0">
          <Avatar className="h-20 w-20 border-2 border-primary/50">
            {agent.avatar_url ? (
              <AvatarImage src={agent.avatar_url} alt={agent.username} />
            ) : null}
            <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold font-mono">
              {agent.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-2 min-w-0">
          <div>
            <p className="text-foreground font-bold font-mono text-lg truncate">{agent.username}</p>
            <p className="text-primary text-xs font-mono font-bold">{agent.rank}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <div>
              <span className="text-[9px] text-muted-foreground font-mono tracking-wider">BADGE NO.</span>
              <p className="text-sm text-foreground font-mono font-bold">{agent.badge_number}</p>
            </div>
            <div>
              <span className="text-[9px] text-muted-foreground font-mono tracking-wider">CALLSIGN</span>
              <p className="text-sm text-foreground font-mono font-bold">{agent.callsign || "N/A"}</p>
            </div>
            <div>
              <span className="text-[9px] text-muted-foreground font-mono tracking-wider">DIVISION</span>
              <p className="text-sm text-foreground font-mono font-bold">{agent.division}</p>
            </div>
            <div>
              <span className="text-[9px] text-muted-foreground font-mono tracking-wider">CLEARANCE</span>
              <p className="text-sm text-foreground font-mono font-bold">{agent.clearance_level}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome message */}
      {welcomeMessage && (
        <div className="border-t border-border px-5 py-3 bg-background/50">
          <p className="text-xs text-foreground/70 font-mono leading-relaxed">{welcomeMessage}</p>
        </div>
      )}
    </div>
  );
}
