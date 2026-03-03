import { stripe } from "@/integrations/stripe/stripe";
import { systemConfig } from "@/configs/system";
import { rateLimit } from "@/core/security/rateLimit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const rl = rateLimit(`checkout:${ip}`, { capacity: 20, refillPerSec: 1 });
  if (!rl.ok) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const body = await req.json().catch(() => ({}));
  const sku = String(body?.sku ?? systemConfig.checkout.products[0].sku);
  const product = systemConfig.checkout.products.find(p => p.sku === sku) ?? systemConfig.checkout.products[0];

  const idempotencyKey = req.headers.get("idempotency-key") ?? `chk_${ip}_${Date.now()}`;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: systemConfig.checkout.defaultCurrency,
        product_data: { name: product.name, metadata: { sku: product.sku } },
        unit_amount: product.amountCents
      },
      quantity: 1
    }],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=1`
  }, { idempotencyKey });

  return Response.json({ ok: true, url: session.url, id: session.id });
}
