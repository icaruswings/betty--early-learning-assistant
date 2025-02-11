import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { AppSidebar } from "~/components/layout/app-sidebar";
import Footer from "~/components/layout/footer";
import { SidebarProvider } from "~/components/ui/sidebar";
import ErrorBoundary from "~/components/error-boundary";
import { PageHeader } from "~/components/layout/page-header";

export const loader = async (args: LoaderFunctionArgs) => {
  const { sessionId } = await getAuth(args);

  if (!sessionId) {
    const returnUrl = new URL(args.request.url);
    throw redirect(`/sign-in?redirect_url=${returnUrl.pathname}`, {});
  }

  return null;
};

export default function Layout() {
  return (
    <SidebarProvider className="w-full">
      <AppSidebar />
      <div className="flex h-svh w-full flex-col overflow-hidden">
        <PageHeader includeSidebarTrigger />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}

export { ErrorBoundary };
