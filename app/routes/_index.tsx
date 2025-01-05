import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { MessageSquare, LogIn, Check, Info } from "lucide-react";
import { useUser, UserButton } from "@clerk/remix";

export const meta: MetaFunction = () => {
  return [
    { title: "Ask Betty" },
    {
      name: "description",
      content: "Your AI-powered early education assistant",
    },
  ];
};

export default function Index() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex min-h-svh w-full flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
          <span className="text-xl font-bold">Ask Betty</span>
          <UserButton />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pb-16 pt-12">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 md:flex-row md:items-center md:gap-12">
            <div className="flex flex-1 flex-col">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                Empowering early childhood educators to excel
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">
                Streamline your workflow, enhance your teaching methods, and deliver better outcomes
                with our intuitive AI assistant
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
            </div>
            <div className="aspect-video w-full flex-1 overflow-hidden rounded-lg border bg-muted shadow-lg">
              <div className="h-full w-full bg-muted">
                {/* Video placeholder - replace src with actual demo video */}
                <video
                  className="h-full w-full object-cover"
                  poster="/video-placeholder.png"
                  controls
                >
                  <source src="/demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="mx-auto w-full max-w-5xl px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Features</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Your intelligent teaching companion that understands early childhood education.
                Get expert guidance on best practices, receive tailored advice for specific
                learning scenarios, and access professional development support whenever you need it.
              </p>
            </div>

            <div className="mb-16 grid gap-8 md:grid-cols-2">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Enhance teaching quality</h3>
                <p className="text-muted-foreground">
                  Get personalized guidance and feedback to improve your teaching methods and outcomes.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Develop professional skills</h3>
                <p className="text-muted-foreground">
                  Access continuous professional development resources and guidance at your own pace.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Reduce training costs</h3>
                <p className="text-muted-foreground">
                  Cut down on expensive external training with our comprehensive AI-powered support system.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">24/7 support at your fingertips</h3>
                <p className="text-muted-foreground">
                  Get instant help whenever you need it, day or night, completely free of charge.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="py-16">
          <div className="mx-auto w-full max-w-5xl px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Simple, transparent pricing</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Choose the plan that works best for you or your center. All plans include full access
                to Betty's features.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Free Trial */}
              <div className="relative rounded-lg border bg-card p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">Free Trial</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="ml-1 text-muted-foreground">/forever</span>
                  </div>
                </div>
                <ul className="mb-6 space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>10 requests included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>All features included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>No credit card required</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Start Free Trial
                </Button>
              </div>

              {/* Personal */}
              <div className="relative rounded-lg border bg-card p-6 shadow-sm">
                <div className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                  Most Popular
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">Personal</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold">$19</span>
                    <span className="ml-1 text-muted-foreground">/month per seat</span>
                  </div>
                </div>
                <ul className="mb-6 space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Unlimited requests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>All features included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full">Subscribe Now</Button>
              </div>

              {/* Center */}
              <div className="relative rounded-lg border bg-card p-6 shadow-sm">
                <div className="absolute -top-3 right-4 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  Coming Soon
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">Center</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold">$9</span>
                    <span className="ml-1 text-muted-foreground">/month per seat</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Minimum 5 seats</p>
                </div>
                <ul className="mb-6 space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Unlimited requests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>All features included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Center management tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline" disabled>
                  Join Waitlist
                </Button>
              </div>
            </div>

            <div className="mt-8 flex items-start gap-2 rounded-lg border bg-muted p-4 text-sm">
              <Info className="mt-0.5 h-4 w-4 flex-none" />
              <p className="text-muted-foreground">
                A request is defined as one chat interaction, one document generation, or one document
                refinement after creation.
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-gradient-to-t from-primary/5 to-background py-16">
          <div className="mx-auto w-full max-w-5xl px-4">
            <div className="rounded-lg border bg-card p-8 shadow-lg">
              <div className="mb-6 flex items-center gap-3">
                <h2 className="text-2xl font-semibold">Coming Soon</h2>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                  in-development
                </span>
              </div>
              <p className="mb-6 text-lg text-muted-foreground">
                Transform your teaching insights into meaningful documentation. Create detailed
                observations and engaging learning narratives that showcase children's growth.
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border bg-card/50 p-4">
                  <h3 className="mb-2 font-semibold">Rich learning observations</h3>
                  <p className="text-sm text-muted-foreground">
                    Document children's learning moments with AI-assisted observation tools.
                  </p>
                </div>
                <div className="rounded-lg border bg-card/50 p-4">
                  <h3 className="mb-2 font-semibold">Developmental narratives</h3>
                  <p className="text-sm text-muted-foreground">
                    Create engaging stories that capture and celebrate learning progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
