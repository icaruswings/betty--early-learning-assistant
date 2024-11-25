import { Button } from "~/components/ui/button";
import { Menu } from "lucide-react";
import { useAtom } from "jotai";
import { sidebarOpenAtom } from "~/atoms";

interface TopBarProps {
}

export function TopBar() {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Early Education Assistant</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              Documentation
            </Button>
            <Button variant="ghost" size="sm">
              About
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
