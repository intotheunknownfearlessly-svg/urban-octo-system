import { z } from "zod";
import { generateSaaS } from "@/core/factory/saas";
const Body = z.object({ niche: z.string().min(2) });
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Body.safeParse(body);
  if (!parsed.success) return Response.json({ ok:false, error:"Invalid payload" }, { status: 400 });
  const out = await generateSaaS(parsed.data.niche);
  return Response.json({ ok:true, ...out });
}
