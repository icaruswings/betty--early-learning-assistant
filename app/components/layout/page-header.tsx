import { PropsWithChildren, useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/remix";
import { useTheme } from "remix-themes";
import { dark } from "@clerk/themes";
import { usePageHeader } from "~/hooks/use-page-header";
import { SidebarTrigger } from "../ui/sidebar";
import { cn } from "~/lib/utils";
import { ClassValue } from "clsx";
import { Link } from "@remix-run/react";

export function PageHeader({
  className,
  includeSidebarTrigger = false,
}: {
  className?: ClassValue;
  includeSidebarTrigger?: boolean;
}) {
  const [theme] = useTheme();
  const { title, Icon } = usePageHeader();

  return (
    <header
      className={cn(
        "flex h-12 items-center bg-background/30 py-2 pl-2 pr-4 backdrop-blur-lg sm:pl-4",
        className
      )}
    >
      <div className="flex h-full w-full flex-none items-center">
        <div className="flex flex-1 items-center gap-4">
          {includeSidebarTrigger && <SidebarTrigger className="md:hidden [&_svg]:size-5" />}
          {Icon && <Icon className="size-5" />}
          <h1 className="m-0 p-0 text-lg font-semibold">{title}</h1>
        </div>
        <div className="hidden h-full items-center md:flex">
          <UserButton
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
            }}
          />

          <SignedOut>
            <div className="flex flex-row gap-1.5 font-semibold">
              <Link to="/sign-in">Sign In</Link>
              <span className="font-normal">or</span>
              <Link to="/waitlist">Join the waitlist!</Link>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
