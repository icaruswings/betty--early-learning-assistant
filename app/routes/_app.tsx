import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { PropsWithChildren } from "react";
import { AppSidebar } from "~/components/layout/app-sidebar";
import Footer from "~/components/layout/footer";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
// import ErrorBoundary from "~/components/ErrorBoundary";

export const loader = async (args: LoaderFunctionArgs) => {
  const { sessionId } = await getAuth(args);

  if (!sessionId) {
    const returnUrl = new URL(args.request.url);
    throw redirect(`/sign-in?redirect_url=${returnUrl.pathname}`, {});
  }

  return null;
};

function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full max-w-4xl">
        <SidebarTrigger />
        {children}
        <Footer />
      </main>
    </SidebarProvider>
  );
}

export default function () {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export { ErrorBoundary };
