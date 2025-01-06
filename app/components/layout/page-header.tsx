import { PropsWithChildren, useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/remix";
import { useTheme } from "remix-themes";
import { dark } from "@clerk/themes";
import { usePageHeader } from "~/hooks/use-page-header";
import { SidebarTrigger } from "../ui/sidebar";
import { cn } from "~/lib/utils";
import { ClassValue } from "clsx";

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
          {includeSidebarTrigger && <SidebarTrigger className="md:hidden [&_svg]:size-4" />}
          {Icon && <Icon className="h-5 w-5" />}
          <h1 className="m-0 p-0 text-lg font-semibold">{title}</h1>
        </div>
        <div className="hidden md:block">
          <SignedIn>
            <UserButton
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
