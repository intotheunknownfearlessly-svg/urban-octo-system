import { supabaseServer } from "@/integrations/supabase/server";
import { rateLimit } from "@/core/security/rateLimit";

export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const rl = rateLimit(`dashboard:${ip}`, { capacity: 10, refillPerSec: 0.5 });
  if (!rl.ok) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const { data: revenue } = await supabaseServer.from("revenue_events").select("*").order("created_at", { ascending: false }).limit(50);
  const { data: logs } = await supabaseServer.from("agent_logs").select("*").order("created_at", { ascending: false }).limit(50);

  return Response.json({ ok: true, revenue: revenue ?? [], logs: logs ?? [] });
}
