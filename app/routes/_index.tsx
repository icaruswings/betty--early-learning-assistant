import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { RootLayout } from "~/components/layout/root-layout";
import { Button } from "~/components/ui/button";
import { MessageSquare, LogIn } from "lucide-react";
import { useUser } from "@clerk/remix";

export const meta: MetaFunction = () => {
  return [
    { title: "Early Education Assistant" },
    {
      name: "description",
      content: "Your AI-powered early education assistant",
    },
  ];
};

export default function Index() {
  const { isSignedIn } = useUser();

  return (
    <RootLayout>
      <div className="flex flex-col items-center justify-center min-h-screen max-w-4xl mx-auto p-4 pl-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Meet Betty,</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Your AI-powered assistant for early education. Get help with lesson
          planning, activity ideas, and educational resources.
        </p>

        {isSignedIn ? (
          <Link to="/chat">
            <Button size="lg" className="gap-2">
              <MessageSquare className="w-5 h-5" />
              Start Chatting
            </Button>
          </Link>
        ) : (
          <Link to="/sign-in">
            <Button size="lg" className="gap-2">
              <LogIn className="w-5 h-5" />
              Sign in to Start
            </Button>
          </Link>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
          <div className="p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-2">Lesson Planning</h2>
            <p className="text-muted-foreground">
              Get creative lesson ideas and structured plans tailored to your
              needs.
            </p>
          </div>

          <div className="p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-2">Activity Generation</h2>
            <p className="text-muted-foreground">
              Generate engaging activities that make learning fun and effective.
            </p>
          </div>

          <div className="p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-2">Resource Library</h2>
            <p className="text-muted-foreground">
              Access a growing collection of educational resources and
              materials.
            </p>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
