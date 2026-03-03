import { stripe } from "@/integrations/stripe/stripe";
export async function POST() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{ price_data: { currency: "usd", product_data: { name: "MANUS Offer" }, unit_amount: 4900 }, quantity: 1 }],
    mode: "payment",
    success_url: `${appUrl}/?success=1`,
    cancel_url: `${appUrl}/?cancel=1`
  });
  return Response.json({ url: session.url });
}
