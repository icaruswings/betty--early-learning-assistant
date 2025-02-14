import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from "remix-themes";
import { themeSessionResolver } from "./sessions.server";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { useAuth, ClerkApp } from "@clerk/remix";
import stylesheet from "~/tailwind.css?url";
import invariant from "tiny-invariant";
import { useState } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { cn } from "./lib/utils";
import { PageHeaderProvider } from "./hooks/use-page-header";
import { TooltipProvider } from "./components/ui/tooltip";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }];

export const loader = async (args: LoaderFunctionArgs) => {
  return await rootAuthLoader(args, async ({ request }) => {
    const { getTheme } = await themeSessionResolver(request);

    invariant(process.env.CLERK_PUBLISHABLE_KEY, "CLERK_PUBLISHABLE_KEY is required");
    invariant(process.env.CONVEX_URL, "CONVEX_URL is required");

    return {
      theme: getTheme(),
      ENV: {
        CONVEX_URL: process.env.CONVEX_URL,
        CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
      },
    };
  });
};

export const useRootLoaderData = () => useRouteLoaderData<typeof loader>("root");

function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();

  return (
    <html lang="en" className={cn(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data?.theme)} />
      </head>
      <body className={cn("font-sans antialiased")}>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  const [convexClient] = useState(new ConvexReactClient(data.ENV.CONVEX_URL));

  return (
    <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
      <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
        <PageHeaderProvider>
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </PageHeaderProvider>
      </ThemeProvider>
    </ConvexProviderWithClerk>
  );
}

export default ClerkApp(AppWithProviders);
