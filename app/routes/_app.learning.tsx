import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { PropsWithChildren } from "react";

export const loader = async (args: LoaderFunctionArgs) => {
  const { sessionId } = await getAuth(args);

  if (!sessionId) {
    const returnUrl = new URL(args.request.url);
    throw redirect(`/sign-in?redirect_url=${returnUrl.pathname}`, {});
  }

  return null;
};

function Layout({ children }: PropsWithChildren<unknown>) {
  return <div className="mx-auto flex h-screen w-full max-w-3xl flex-1 flex-col">{children}</div>;
}

export default function () {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
