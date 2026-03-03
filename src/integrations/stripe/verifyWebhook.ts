import { stripe } from './stripe';
export function verifyStripeWebhook(rawBody:string, signature:string|null){const secret=process.env.STRIPE_WEBHOOK_SECRET!;if(!signature) throw new Error('Missing stripe-signature header');return stripe.webhooks.constructEvent(rawBody,signature,secret);}
