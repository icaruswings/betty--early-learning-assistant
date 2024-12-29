import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { PropsWithChildren } from "react";
import { AppSidebar } from "~/components/layout/app-sidebar";
import Footer from "~/components/layout/footer";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import ErrorBoundary from "~/components/error-boundary";

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

      <main className="relative flex flex-1 flex-col items-center">
        <SidebarTrigger className="absolute left-2 top-2 z-50" />
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
