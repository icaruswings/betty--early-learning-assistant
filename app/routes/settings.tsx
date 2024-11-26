import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Button } from "~/components/ui/button";
import { RootLayout } from "~/components/layout/root-layout";
import { useUser } from "@clerk/remix";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { Check, Copy } from "lucide-react";

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
      <div className="flex flex-col max-w-4xl mx-auto p-4 pl-24 space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your API tokens and preferences
          </p>
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
