import { stripe } from "./stripe";
import { env } from "@/config/env";

export function verifyStripeWebhook(rawBody: string, signature: string | null) {
  if (!signature) throw new Error("Missing stripe-signature header");
  return stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
}
