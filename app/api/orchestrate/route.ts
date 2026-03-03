import { orchestrate } from "@/core/orchestrator";
import { AgentPayloadSchema } from "@/core/orchestrator/types";
import { rateLimit } from "@/core/security/rateLimit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const rl = rateLimit(`orchestrate:${ip}`, { capacity: 10, refillPerSec: 0.5 });
  if (!rl.ok) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429, headers: { "retry-after": String(rl.retryAfterSec) } });
  }

  const body = await req.json().catch(() => null);
  const parsed = AgentPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "invalid_payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const result = await orchestrate(parsed.data);
  return Response.json({ ok: true, result });
}
