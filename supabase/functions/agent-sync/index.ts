import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { discord_id, username, avatar_url, rank, badge_number, division, clearance_level, callsign } = await req.json();

    if (!discord_id || !username || !badge_number) {
      return new Response(JSON.stringify({ error: "discord_id, username, and badge_number are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await supabase.from("agents").upsert(
      {
        discord_id,
        username,
        avatar_url: avatar_url || null,
        rank: rank || "Recruit",
        badge_number,
        division: division || "Unassigned",
        clearance_level: clearance_level || "LEVEL 1",
        callsign: callsign || null,
      },
      { onConflict: "discord_id" }
    ).select().single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, agent: data }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("agent-sync error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
