import { Link, useLocation } from "@remix-run/react";
import { UserButton, SignInButton, SignOutButton, useUser } from "@clerk/remix";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import {
  MessageSquare,
  BookOpen,
  FileText,
  Settings,
  Brain,
  Lightbulb,
  Code,
  Book,
  ArrowLeft,
  LogIn,
  LogOut,
  Shapes,
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
  {
    title: "Chat",
    icon: MessageSquare,
    href: "/chat",
  },
  {
    title: "Learning",
    icon: Brain,
    children: [
      {
        title: "Learning Stories",
        icon: BookOpen,
        href: "/learning/stories",
      },
      {
        title: "Ideas",
        icon: Lightbulb,
        href: "/learning/ideas",
      },
    ],
  },
  {
    title: "Play",
    icon: Shapes,
    href: "/play",
  },
  {
    title: "Templates",
    icon: FileText,
    children: [
      {
        title: "Code",
        icon: Code,
        href: "/templates/code",
      },
      {
        title: "Docs",
        icon: Book,
        href: "/templates/docs",
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar() {
  const [activeParent, setActiveParent] = useState<string | null>(null);
  const location = useLocation();
  const { isSignedIn } = useUser();

  const handleItemClick = (item: (typeof sidebarItems)[0]) => {
    if (item.children) {
      setActiveParent(activeParent === item.title ? null : item.title);
    }
  };

  return (
    <>
      <aside className="fixed left-0 top-0 z-30 h-screen w-16 border-r bg-background">
        <div className="flex h-full flex-col py-2">
          <div className="flex flex-col items-center">
            <UserButton />
            <div className="my-4 h-[1px] w-8 bg-border" />
          </div>
          <nav className="space-y-1 px-1 flex-1">
            {sidebarItems.map((item) => {
              const isActive =
                item.href === location.pathname ||
                item.children?.some(
                  (child) => child.href === location.pathname
                ) ||
                activeParent === item.title;

              return item.children ? (
                <button
                  key={item.title}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "w-full flex flex-col items-center gap-0.5 rounded-lg py-1.5 px-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-[10px]">{item.title}</span>
                </button>
              ) : (
                <Link
                  key={item.title}
                  to={item.href}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "w-full flex flex-col items-center gap-0.5 rounded-lg py-1.5 px-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-[10px]">{item.title}</span>
                </Link>
              );
            })}
          </nav>
          <div className="px-1 pt-4 border-t">
            <div className="flex flex-col items-center gap-2">
              {!isSignedIn ? (
                <Link
                  to="/sign-in"
                  className="flex flex-col items-center gap-0.5 rounded-lg py-1.5 px-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="text-[10px]">Sign in</span>
                </Link>
              ) : (
                <SignOutButton>
                  <button className="flex flex-col items-center gap-0.5 rounded-lg py-1.5 px-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                    <LogOut className="h-4 w-4" />
                    <span className="text-[10px]">Sign out</span>
                  </button>
                </SignOutButton>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Sliding sub-sidebar */}
      <aside
        className={cn(
          "fixed left-16 top-0 z-20 h-screen w-16 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "transition-transform duration-300",
          activeParent ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col py-2">
          <div className="flex flex-col items-center">
            <button
              onClick={() => setActiveParent(null)}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="my-4 h-[1px] w-8 bg-border" />
          </div>
          <nav className="space-y-1 px-1">
            {activeParent &&
              sidebarItems
                .find((item) => item.title === activeParent)
                ?.children?.map((child) => (
                  <Link
                    key={child.href}
                    to={child.href}
                    className={cn(
                      "flex flex-col items-center gap-0.5 rounded-lg py-1.5 px-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                      location.pathname === child.href &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    <child.icon className="h-4 w-4" />
                    <span className="text-[10px]">{child.title}</span>
                  </Link>
                ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
