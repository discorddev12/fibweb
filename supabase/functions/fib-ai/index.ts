import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are the FIB Federal Investigation Bureau's AI Intelligence System, codenamed "ORACLE".
You respond in a professional, authoritative, law-enforcement tone. You use formal language with occasional classified-document formatting.
When referencing an agent, always include their rank, badge number, and name formally.
Use redacted blocks (████) sparingly for dramatic effect.
Keep responses concise but thorough. Format with clear headings and structured sections.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, agent, context } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const agentLine = agent
      ? `The requesting agent is: ${agent.rank} ${agent.username}, Badge #${agent.badge_number}, Division: ${agent.division}, Clearance: ${agent.clearance_level}.`
      : "No agent data available.";

    const prompts: Record<string, string> = {
      welcome: `Generate a short, professional FIB welcome message for this agent who just logged in. ${agentLine} Include their rank, badge number, and a brief status update. Keep it 2-3 sentences. Be immersive.`,
      casefile_summary: `Generate a formal FIB casefile summary for the following case. ${agentLine} Context: ${JSON.stringify(context)}. Include: Case Overview, Threat Assessment, Recommended Actions. Format as a classified intelligence brief.`,
      warrant_justification: `Generate a formal probable cause justification for a search warrant. ${agentLine} Context: ${JSON.stringify(context)}. Write in legal law-enforcement language. Include specific probable cause elements.`,
      evidence_description: `Generate a formal FIB evidence description and chain-of-custody note. ${agentLine} Context: ${JSON.stringify(context)}. Include evidence ID, description, collection details, and forensic notes.`,
      suspect_profile: `Generate a detailed FIB suspect intelligence profile. ${agentLine} Context: ${JSON.stringify(context)}. Include: Physical Description, Known Associates, Criminal History, Behavioral Analysis, Threat Assessment.`,
      performance_summary: `Generate a formal FIB agent performance summary/review. ${agentLine} Include commendations, areas of excellence, and mission statistics. Keep it professional and immersive.`,
    };

    const userPrompt = prompts[type];
    if (!userPrompt) {
      return new Response(JSON.stringify({ error: `Unknown type: ${type}. Supported: ${Object.keys(prompts).join(", ")}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limited — try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "No response generated.";

    return new Response(JSON.stringify({ success: true, content }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fib-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
