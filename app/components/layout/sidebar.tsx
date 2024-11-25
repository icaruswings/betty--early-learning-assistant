import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { MessageSquare, BookOpen, FileText, Settings } from "lucide-react";

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

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button variant="ghost" className="w-full justify-start">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
