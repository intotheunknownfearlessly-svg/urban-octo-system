import { z } from "zod";
import { dispatchTask } from "@/controllers/multirepo";
const Body = z.object({ repoFullName: z.string().min(3), issueTitle: z.string().min(3), issueBody: z.string().min(1) });
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Body.safeParse(body);
  if (!parsed.success) return Response.json({ ok:false, error:"Invalid payload" }, { status: 400 });
  const result = await dispatchTask(parsed.data);
  return Response.json({ ok:true, result });
}
