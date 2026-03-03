export async function GET() {
  return Response.json({ ok: true, service: "manus-enterprise", ts: new Date().toISOString() });
}
