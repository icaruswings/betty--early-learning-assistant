import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
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
    <div className="w-full flex-1">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-1 flex-col justify-center">
        <h1 className="mb-4 text-4xl font-bold">Meet Betty,</h1>
        <p className="mb-8 max-w-2xl text-xl text-muted-foreground">
          Your AI-powered assistant for early education. Get help with lesson planning, activity
          ideas, and educational resources.
        </p>

        {isSignedIn ? (
          <Link to="/chat">
            <Button size="lg" className="gap-2">
              <MessageSquare className="h-5 w-5" />
              Start Chatting
            </Button>
          </Link>
        ) : (
          <Link to="/sign-in">
            <Button size="lg" className="gap-2">
              <LogIn className="h-5 w-5" />
              Sign in to Start
            </Button>
          </Link>
        )}

        <div className="mt-12 grid grid-cols-1 gap-6 text-left md:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h2 className="mb-2 text-xl font-semibold">Lesson Planning</h2>
            <p className="text-muted-foreground">
              Get creative lesson ideas and structured plans tailored to your needs.
            </p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-2 text-xl font-semibold">Activity Generation</h2>
            <p className="text-muted-foreground">
              Generate engaging activities that make learning fun and effective.
            </p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-2 text-xl font-semibold">Resource Library</h2>
            <p className="text-muted-foreground">
              Access a growing collection of educational resources and materials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
