import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Button } from "~/components/ui/button";
import { useUser } from "@clerk/remix";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { Check, Copy, Settings as SettingsIcon } from "lucide-react";
import { ModelSelector } from "~/components/model-selector";
import { ThemeToggle } from "~/components/theme-toggle";
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
    <div className="h-full flex-1">
      <PageHeader>
        <SettingsIcon className="h-5 w-5" />
        <h1 className="text-lg font-semibold">Settings</h1>
      </PageHeader>

      <div className="mx-auto flex max-w-4xl flex-col space-y-12 p-4">
        {/* Appearance Section */}
        <div>
          <div className="mb-6 flex items-center space-x-2">
            <h2 className="text-xl font-semibold">Appearance</h2>
            <p className="text-sm text-muted-foreground">Customize how the app looks and feels</p>
          </div>
          <div className="grid gap-6">
            <div className="space-y-2">
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

        <div className="h-px bg-border" aria-hidden="true" />

        {/* Chat Settings Section */}
        <div>
          <div className="mb-6 flex items-center space-x-2">
            <h2 className="text-xl font-semibold">Chat Settings</h2>
            <p className="text-sm text-muted-foreground">Configure your chat experience</p>
          </div>
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Model</label>
              <ModelSelector />
              <p className="text-sm text-muted-foreground">
                Select the AI model to use for your conversations
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-border" aria-hidden="true" />

        {/* Access Section */}
        <div>
          <div className="mb-6 flex items-center space-x-2">
            <h2 className="text-xl font-semibold">Access</h2>
            <p className="text-sm text-muted-foreground">
              Manage your API access and security settings
            </p>
          </div>
          <div className="grid gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">API Token</label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 rounded-lg bg-secondary p-4 font-mono text-sm">
                    {apiToken}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    className="h-14 w-14"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
          </div>
        </div>
      </div>
    </div>
  );
}
