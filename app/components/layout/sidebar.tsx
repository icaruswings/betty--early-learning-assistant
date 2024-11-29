import { Link, useLocation } from "@remix-run/react";
import {
  UserButton,
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/remix";
import { cn } from "~/lib/utils";
import {
  MessageSquare,
  BookOpen,
  Eye,
  Settings,
  Brain,
  Lightbulb,
  ArrowLeft,
  LogIn,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Tooltip, TooltipProvider } from "~/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import Logo from "~/assets/logo.svg";

const sidebarItems = [
  {
    title: "Ask Betty",
    icon: MessageSquare,
    href: "/chat",
  },
  {
    title: "Learning",
    icon: Brain,
    href: "/learning",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 h-screen border-none shadow-sm bg-background transition-all duration-300 ease-in-out",
        isOpen ? "w-[281px]" : "w-[50px]"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 py-4">
          <Link to="/">
            <img className="w-8 h-8" src={Logo} />
          </Link>

          <nav className="space-y-1 px-1 flex-1">
            {sidebarItems.map((item) => {
              const isActive = item.href === location.pathname;

              return (
                <TooltipProvider key={item.title} delayDuration={0}>
                  <Tooltip
                    side="right"
                    content={isOpen ? undefined : item.title}
                  >
                    <Link
                      to={item.href}
                      className={cn(
                        "relative w-full flex items-center h-10 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground rounded-md",
                        !isOpen && "justify-center px-0",
                        item.href === "/chat"
                          ? "border-1 border-gray-300 hover:border-accent"
                          : [
                              "px-2",
                              isActive && "bg-accent/50 text-accent-foreground",
                            ]
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          item.href === "/chat" && "text-foreground"
                        )}
                      />
                      {isOpen && (
                        <span
                          className={cn(
                            "ml-3 text-sm font-medium",
                            item.href === "/chat" && "text-foreground"
                          )}
                        >
                          {item.title}
                        </span>
                      )}
                    </Link>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto border-t px-2 py-4">
          <div className="flex items-center gap-2">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <TooltipProvider delayDuration={0}>
                <Tooltip side="right" content={isOpen ? undefined : "Sign in"}>
                  <SignInButton>
                    <div
                      className={cn(
                        "flex items-center h-10 text-muted-foreground transition-colors hover:text-foreground rounded-md",
                        isOpen && "w-full",
                        !isOpen && "justify-center px-0"
                      )}
                    >
                      <LogIn className="h-5 w-5 shrink-0" />
                      {isOpen && (
                        <span className="ml-3 text-sm font-medium">
                          Sign in
                        </span>
                      )}
                    </div>
                  </SignInButton>
                </Tooltip>
              </TooltipProvider>
            </SignedOut>
          </div>
        </div>
      </div>
    </aside>
  );
}
