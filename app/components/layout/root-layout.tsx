import { useLocation } from "@remix-run/react";
import { Sidebar } from "./sidebar";
import { useAtom } from "jotai";
import { sidebarOpenAtom } from "~/atoms";
import { Menu } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);
  const { pathname } = useLocation();

  return (
    <div className="relative flex overflow-hidden">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed h-12 top-[10px] left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} />

      <main className="flex-1">
        <div className="flex flex-col h-full w-full">{children}</div>
      </main>
    </div>
  );
}
