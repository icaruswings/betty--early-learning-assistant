import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useRouteLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";
import { themeSessionResolver } from "./sessions.server";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { ClerkApp, ClerkProvider } from "@clerk/remix";
import stylesheet from "~/tailwind.css?url";
import invariant from "tiny-invariant";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async (args: LoaderFunctionArgs) => {
  return await rootAuthLoader(args, async ({ request }) => {
    const { getTheme } = await themeSessionResolver(request);

    invariant(
      process.env.CLERK_PUBLISHABLE_KEY,
      "CLERK_PUBLISHABLE_KEY is required"
    );

    return {
      theme: getTheme(),
      ENV: {
        CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
      },
    };
  });
};

export const useRootLoaderData = () =>
  useRouteLoaderData<typeof loader>("root");

function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();

  return (
    <html lang="en" data-theme={theme} className={theme ?? ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <ScrollRestoration />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data?.theme)} />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  const { theme, ENV } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();
  return (
    <ThemeProvider specifiedTheme={theme} themeAction="/action/set-theme">
      <Layout>
        <Outlet />
      </Layout>
    </ThemeProvider>
  );
}

export default ClerkApp(App, { afterSignOutUrl: "/" });
