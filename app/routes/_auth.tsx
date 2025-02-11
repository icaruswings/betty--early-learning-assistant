import { Outlet } from "@remix-run/react";
import Footer from "~/components/layout/footer";

export default function Layout() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-4xl flex-col">
      <div className="flex flex-1 flex-col items-center justify-center">
        <Outlet />
      </div>
      <div className="flex-none">
        <Footer />
      </div>
    </main>
  );
}
