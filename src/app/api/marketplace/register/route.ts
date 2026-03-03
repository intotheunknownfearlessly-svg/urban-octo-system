import { z } from "zod";
import { registerAgent } from "@/core/marketplace/registry";

const Body = z.object({
  name: z.string().min(2),
  version: z.string().min(1),
  capabilities: z.array(z.any()).default([]),
  endpoint: z.string().url().optional()
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Body.safeParse(body);
  if (!parsed.success) return Response.json({ ok: false, error: "invalid_payload", details: parsed.error.flatten() }, { status: 400 });

  await registerAgent(parsed.data);
  return Response.json({ ok: true });
}
