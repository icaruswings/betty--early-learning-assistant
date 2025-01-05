import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { PropsWithChildren } from "react";
import { AppSidebar } from "~/components/layout/app-sidebar";
import Footer from "~/components/layout/footer";
import { SidebarProvider } from "~/components/ui/sidebar";
import ErrorBoundary from "~/components/error-boundary";
import { PageHeaderProvider } from "~/hooks/use-page-header";
import { PageHeader } from "~/components/layout/page-header";

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
    <PageHeaderProvider>
      <SidebarProvider className="w-full">
        <AppSidebar />
        <div className="flex h-svh w-full flex-col overflow-hidden">
          <main className="flex-1 overflow-hidden">{children}</main>
          <Footer />
        </div>
      </SidebarProvider>
    </PageHeaderProvider>
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
