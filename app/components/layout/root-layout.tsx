import { useLocation } from "@remix-run/react";
import { Sidebar } from "./sidebar";

import { useAtom } from "jotai";
import { sidebarOpenAtom } from "~/atoms";

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  const [sidebarOpen] = useAtom(sidebarOpenAtom);
  const { pathname } = useLocation();

  return (
    <div className="relative flex min-h-screen">
      <Sidebar />

      <main className="flex-1 overflow-hidden">
        <div
          key={pathname}
          className="flex flex-col h-screen max-h-screen pl-24"
        >
          {children}
        </div>
      </main>
    </div>
  );
}
