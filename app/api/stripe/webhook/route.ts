import { headers } from "next/headers";
import { verifyStripeWebhook } from "@/integrations/stripe/verifyWebhook";
import { supabaseServer } from "@/integrations/supabase/server";
import { logEvent } from "@/core/telemetry/logger";

export async function POST(req: Request) {
  const sig = headers().get("stripe-signature");
  const rawBody = await req.text();

  const event = verifyStripeWebhook(rawBody, sig);

  await logEvent("stripe", "webhook_received", { id: event.id, type: event.type });

  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object;
    const amountTotal = Number(session.amount_total ?? 0) / 100;
    const currency = String(session.currency ?? "usd");
    const productName = "MANUS Offer";

    // Idempotent insert: stripe_event_id unique
    const { error } = await supabaseServer.from("revenue_events").insert({
      stripe_event_id: event.id,
      product_name: productName,
      currency,
      revenue_amount: amountTotal,
      source: "stripe"
    });

    // Ignore duplicate insert (unique violation), surface others
    if (error && !String(error.message).toLowerCase().includes("duplicate")) {
      throw error;
    }
  }

  return Response.json({ received: true });
}
