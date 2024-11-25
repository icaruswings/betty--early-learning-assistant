import { TopBar } from "./top-bar";
import { Sidebar } from "./sidebar";
import { useAtom } from "jotai";
import { sidebarOpenAtom } from "~/atoms";

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  const [sidebarOpen] = useAtom(sidebarOpenAtom);

  return (
    <div className="relative flex min-h-screen flex-col">
      <TopBar />
      <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className={`fixed top-14 z-30 h-[calc(100vh-3.5rem)] w-[220px] lg:w-[240px] shrink-0 overflow-y-auto border-r md:sticky transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}>
          <Sidebar />
        </aside>
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
