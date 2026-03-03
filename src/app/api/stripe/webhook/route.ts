import { headers } from "next/headers";
import { verifyStripeWebhook } from "@/integrations/stripe/verifyWebhook";
import { supabaseServer } from "@/integrations/supabase/server";
export async function POST(req: Request) {
  const sig = headers().get("stripe-signature");
  const rawBody = await req.text();
  try {
    const event = verifyStripeWebhook(rawBody, sig);
    if (event.type === "checkout.session.completed") {
      await supabaseServer.from("revenue_events").insert({ product_name: "MANUS Offer", revenue_amount: 49, source: "stripe" });
    }
    return Response.json({ received: true });
  } catch (err: any) {
    return Response.json({ error: err?.message ?? "Webhook verification failed" }, { status: 400 });
  }
}
