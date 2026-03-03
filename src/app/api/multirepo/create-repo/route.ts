import { z } from "zod";
import { createRepo } from "@/controllers/multirepo";
const Body = z.object({ name: z.string().min(2), private: z.boolean().default(true), description: z.string().optional() });
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Body.safeParse(body);
  if (!parsed.success) return Response.json({ ok:false, error:"Invalid payload" }, { status: 400 });
  const result = await createRepo(parsed.data);
  return Response.json({ ok:true, result });
}
