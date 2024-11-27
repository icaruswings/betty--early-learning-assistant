// app/routes/account.billing.tsx
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { createPortalSession, getOrCreateCustomer } from "~/lib/stripe.server";

export async function loader(args: LoaderFunctionArgs) {
  const { userId, sessionClaims } = await getAuth(args);
  if (!userId) return redirect("/sign-in");

  const customer = await getOrCreateCustomer(
    userId,
    sessionClaims.email as string
  );

  const portalSession = await createPortalSession(
    customer.id,
    `${new URL(args.request.url).origin}/account`
  );

  return redirect(portalSession.url);
}
