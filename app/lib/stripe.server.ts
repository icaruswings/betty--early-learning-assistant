// app/lib/stripe.server.ts
import Stripe from "stripe";
import invariant from "tiny-invariant";

invariant(process.env.STRIPE_SECRET_KEY, "STRIPE_SECRET_KEY must be set");

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

// In the same stripe.server.ts file
export async function getOrCreateCustomer(userId: string, email: string) {
  const customers = await stripe.customers.list({ email });
  return (
    customers.data[0] ||
    stripe.customers.create({
      email,
      metadata: { userId },
    })
  );
}

export async function createPortalSession(
  customerId: string,
  returnUrl: string
) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}
