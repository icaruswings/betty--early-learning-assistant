import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const loader = async (args: LoaderFunctionArgs) => {
  const { sessionId } = await getAuth(args);

  if (!sessionId) {
    const returnUrl = new URL(args.request.url);
    throw redirect(`/sign-in?redirect_url=${returnUrl.pathname}`, {});
  }

  return null;
};

export default function () {
  return <Outlet />;
}
