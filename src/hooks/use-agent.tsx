import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AgentProfile {
  id: string;
  discord_id: string;
  username: string;
  avatar_url: string | null;
  rank: string;
  badge_number: string;
  division: string;
  clearance_level: string;
  callsign: string | null;
}

interface AgentContextType {
  agent: AgentProfile | null;
  loading: boolean;
  loginWithDiscordId: (discordId: string) => Promise<boolean>;
  logout: () => void;
  generateAI: (type: string, context?: Record<string, unknown>) => Promise<string>;
}

const AgentContext = createContext<AgentContextType | null>(null);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const loginWithDiscordId = useCallback(async (discordId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("discord_id", discordId)
      .maybeSingle();
    setLoading(false);
    if (error || !data) return false;
    setAgent(data as AgentProfile);
    return true;
  }, []);

  const logout = useCallback(() => setAgent(null), []);

  const generateAI = useCallback(async (type: string, context?: Record<string, unknown>) => {
    const resp = await supabase.functions.invoke("fib-ai", {
      body: { type, agent, context },
    });
    if (resp.error) throw new Error(resp.error.message);
    return resp.data?.content || "No response generated.";
  }, [agent]);

  return (
    <AgentContext.Provider value={{ agent, loading, loginWithDiscordId, logout, generateAI }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgent must be used within AgentProvider");
  return ctx;
}
