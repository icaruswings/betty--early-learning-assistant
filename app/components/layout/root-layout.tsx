import { AppSidebar } from "./app-sidebar";
import { useAtom } from "jotai";
import { sidebarOpenAtom } from "~/atoms";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);

  return (
    <div className="relative flex overflow-hidden">
      <SidebarProvider>
        <AppSidebar />

        <main className="flex-1">
          <SidebarTrigger />

          <div className="flex h-full w-full flex-col">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
