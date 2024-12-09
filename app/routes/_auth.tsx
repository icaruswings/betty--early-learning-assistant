import { Outlet } from "@remix-run/react";
import { PropsWithChildren } from "react";
import Footer from "~/components/layout/footer";

function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <main className="mx-auto flex h-full w-full max-w-4xl flex-col">
      <div className="flex flex-1 flex-col items-center justify-center">{children}</div>
      <div className="flex-none">
        <Footer />
      </div>
    </main>
  );
}

export default function () {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
