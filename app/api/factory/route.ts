import { z } from "zod";
import { generateSaaS } from "@/core/factory/saas";
import { rateLimit } from "@/core/security/rateLimit";

const Body = z.object({ niche: z.string().min(2) });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const rl = rateLimit(`factory:${ip}`, { capacity: 10, refillPerSec: 0.2 });
  if (!rl.ok) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = Body.safeParse(body);
  if (!parsed.success) return Response.json({ ok: false, error: "invalid_payload" }, { status: 400 });

  const out = await generateSaaS(parsed.data.niche);
  return Response.json({ ok: true, result: out });
}
