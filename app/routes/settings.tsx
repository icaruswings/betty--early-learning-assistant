import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Button } from "~/components/ui/button";
import { RootLayout } from "~/components/layout/root-layout";
import { useUser } from "@clerk/remix";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { Check, Copy, Settings as SettingsIcon } from "lucide-react";
import { ModelSelector } from "~/components/ui/model-selector";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { PageHeader } from "~/components/layout/page-header";

export async function loader(args: LoaderFunctionArgs) {
  const { userId } = await getAuth(args);

  if (!userId) {
    return redirect("/");
  }

  return null;
}

export default function Settings() {
  const { isLoaded, isSignedIn } = useUser();
  const [apiToken, setApiToken] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate token on component mount if none exists
    if (!apiToken) {
      setApiToken(nanoid(32));
    }
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const regenerateToken = () => {
    setApiToken(nanoid(32));
    setCopied(false);
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <RootLayout>
      <PageHeader>
        <SettingsIcon className="w-5 h-5" />
        <h1 className="text-lg font-semibold">Settings</h1>
      </PageHeader>

      <div className="flex flex-col max-w-4xl mx-auto p-4 space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Preferences</h2>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Model</label>
              <ModelSelector />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <span className="text-sm text-muted-foreground">
                  Toggle between light and dark mode
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">API Token</h2>
          <div className="flex items-center space-x-2">
            <code className="flex-1 p-4 bg-secondary rounded-lg font-mono text-sm">
              {apiToken}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              className="h-14 w-14"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button onClick={regenerateToken} variant="outline">
            Regenerate Token
          </Button>
          <p className="text-sm text-muted-foreground">
            Use this token to authenticate API requests. Keep it secret and secure.
          </p>
        </div>
      </div>
    </RootLayout>
  );
}
