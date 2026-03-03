import { z } from "zod";
import { semanticSearch } from "@/core/memory/store";

const Body = z.object({
  query: z.string().min(2),
  threshold: z.number().optional(),
  count: z.number().optional()
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Body.safeParse(body);
  if (!parsed.success) return Response.json({ ok: false, error: "invalid_payload" }, { status: 400 });

  const results = await semanticSearch(parsed.data.query, { threshold: parsed.data.threshold, count: parsed.data.count });
  return Response.json({ ok: true, results });
}
