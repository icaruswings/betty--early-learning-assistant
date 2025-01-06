import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Button } from "~/components/ui/button";
import { useUser } from "@clerk/remix";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { Check, Copy, Settings as SettingsIcon } from "lucide-react";
import { ModelSelector } from "~/components/model-selector";
import { ThemeToggle } from "~/components/theme-toggle";
import { usePageHeader } from "~/hooks/use-page-header";
import { useSearchParams } from "react-router-dom";

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
  const [searchParams] = useSearchParams();
  const showDebug = searchParams.get("debug") === "true";

  const { setIcon, setTitle } = usePageHeader();

  useEffect(() => {
    setIcon(SettingsIcon);
    setTitle("Settings");

    // Cleanup function to reset the header when component unmounts
    return () => {
      setIcon(null);
      setTitle("");
    };
  }, [setIcon, setTitle]);

  useEffect(() => {
    // Generate token on component mount if none exists
    if (!apiToken) {
      generateToken();
    }
  }, [apiToken]);

  const generateToken = () => {
    const token = crypto.randomUUID();
    setApiToken(token);
    setCopied(false);
  };

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(apiToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy token:", err);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
      <div className="mx-auto flex max-w-4xl flex-col space-y-12 p-4">
        {/* Appearance Section */}
        <div>
          <h2 className="text-lg font-medium">Appearance</h2>
          <p className="text-sm text-muted-foreground">Customize how Betty looks on your device.</p>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-0.5">
                <label
                  htmlFor="theme"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Theme
                </label>
                <p className="text-[0.8rem] text-muted-foreground">Select your preferred theme</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {showDebug && (
          <>
            {/* Chat Settings Section */}
            <div>
              <h2 className="text-lg font-medium">Chat Settings</h2>
              <p className="text-sm text-muted-foreground">
                Configure chat behavior and model settings.
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-0.5">
                    <label
                      htmlFor="model"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Model
                    </label>
                    <p className="text-[0.8rem] text-muted-foreground">
                      Select which model to use for chat
                    </p>
                  </div>
                  <ModelSelector />
                </div>
              </div>
            </div>

            {/* Access Token Section */}
            <div>
              <h2 className="text-lg font-medium">Access Token</h2>
              <p className="text-sm text-muted-foreground">
                Your API access token for external integrations.
              </p>

              <div className="mt-4 space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 rounded-lg bg-secondary p-4 font-mono text-sm">
                      {apiToken}
                    </code>
                    <Button variant="outline" size="icon" onClick={copyToken} className="shrink-0">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full" onClick={generateToken}>
                    Generate New Token
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
