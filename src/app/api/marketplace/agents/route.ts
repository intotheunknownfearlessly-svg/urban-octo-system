import { listAgents } from "@/core/marketplace/registry";

export async function GET() {
  const agents = await listAgents();
  return Response.json({ ok: true, agents });
}
