import { orchestrate } from "@/core/orchestrator";
import { AgentPayloadSchema } from "@/core/orchestrator/types";
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = AgentPayloadSchema.safeParse(body);
  if (!parsed.success) return Response.json({ ok:false, error:"Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  const result = await orchestrate(parsed.data);
  return Response.json({ ok:true, result });
}
