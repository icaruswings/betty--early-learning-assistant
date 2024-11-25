import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { MessageSquare, BookOpen, FileText, Settings } from "lucide-react";
import { useState } from "react";

const sidebarItems = [
  {
    title: "Chat",
    icon: MessageSquare,
    href: "/",
  },
  {
    title: "Learning Stories",
    icon: BookOpen,
    href: "/learning-stories",
  },
  {
    title: "Templates",
    icon: FileText,
    href: "/templates",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside
      className="fixed left-0 top-0 z-30 h-screen w-16 border-r bg-background transition-[width] duration-300 ease-in-out hover:w-56"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex h-full flex-col py-4">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "relative w-full justify-start",
                  !isHovered && "justify-center px-0"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  isHovered ? "mr-2" : "mr-0"
                )} />
                <span className={cn(
                  "absolute left-12 whitespace-nowrap opacity-0 transition-opacity duration-200",
                  isHovered && "relative left-0 opacity-100"
                )}>
                  {item.title}
                </span>
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
