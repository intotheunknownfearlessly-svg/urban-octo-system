import { supabaseServer } from "@/integrations/supabase/server";
export async function GET() {
  const { data: revenue } = await supabaseServer.from("revenue_events").select("*").order("created_at",{ascending:false}).limit(50);
  const { data: logs } = await supabaseServer.from("agent_logs").select("*").order("created_at",{ascending:false}).limit(50);
  const { data: memory } = await supabaseServer.from("agent_memory").select("id,agent,content,created_at").order("created_at",{ascending:false}).limit(20);
  return Response.json({ revenue, logs, memory });
}
