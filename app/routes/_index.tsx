import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  MessageSquare,
  Check,
  Info,
  Clock,
  BookOpen,
  GraduationCap,
  FileText,
  Brain,
  Heart,
  Loader,
  CalendarClock,
} from "lucide-react";
import { useUser } from "@clerk/remix";
import { useTheme } from "remix-themes";
import { PageHeader } from "~/components/layout/page-header";
import { usePageHeader } from "~/hooks/use-page-header";
import { useEffect } from "react";
import Footer from "~/components/layout/footer";

export const meta: MetaFunction = () => {
  return [{ title: "Ask Betty - Early Learning Assistant" }];
};

export default function Index() {
  const { isSignedIn, isLoaded } = useUser();
  const [theme] = useTheme();

  const { setIcon, setTitle } = usePageHeader();

  useEffect(() => {
    setIcon(null);
    setTitle("AskBetty");
  }, []);

  return (
    <div className="flex min-h-svh w-full flex-col">
      <PageHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pb-16 pt-12">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 md:flex-row md:items-center md:gap-12">
            <div className="flex flex-1 flex-col">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                Supporting early childhood educators to exceed
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">
                Save hours each week with your AI teaching assistant that understands EYLF and NQS.
                Streamline documentation, enhance teaching practices, and deliver exceptional
                outcomes aligned with Australian learning frameworks.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                {isSignedIn ? (
                  <Button asChild size="lg">
                    <Link to="/chat">
                      <MessageSquare className="h-5 w-5" />
                      Ask Betty...
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="lg">
                    {isLoaded ? (
                      <Link to="/waitlist">
                        <CalendarClock className="size-5" />
                        <span>Join the waitlist!</span>
                      </Link>
                    ) : (
                      <div>
                        <Loader className="size-5 animate-spin" />
                        <span>Loading...</span>
                      </div>
                    )}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="aspect-video w-full rounded-lg border bg-card shadow-lg" />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="pb-16 pt-12">
          <div className="mx-auto w-full max-w-5xl px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Transform Your Teaching Practice</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                AskBetty is your intelligent teaching companion that deeply understands early
                childhood education in Australia. Get framework-aligned guidance, save precious time
                on documentation, and elevate your professional practice.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div className="mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Save Time, Focus on Teaching</h3>
                <p className="text-muted-foreground">
                  Reduce documentation time by up to 50%. AskBetty helps you quickly create
                  high-quality observations, learning stories, and reflections that align with EYLF
                  outcomes.
                </p>
              </div>

              <div>
                <div className="mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Framework-Aligned Excellence</h3>
                <p className="text-muted-foreground">
                  Get instant guidance on EYLF outcomes and NQS quality areas. Ensure your practice
                  consistently meets and exceeds national quality standards.
                </p>
              </div>

              <div>
                <div className="mb-4">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Professional Growth</h3>
                <p className="text-muted-foreground">
                  Level-up your practice with personalized professional development aligned with
                  Australian frameworks. Get expert guidance on implementing best practices.
                </p>
              </div>

              <div>
                <div className="mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Quality Documentation</h3>
                <p className="text-muted-foreground">
                  Create rich, meaningful documentation that showcases children's learning journeys.
                  AskBetty helps you capture and communicate learning moments effectively.
                </p>
              </div>

              <div>
                <div className="mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Pedagogical Mentor & Coach</h3>
                <p className="text-muted-foreground">
                  Get personalized guidance on pedagogical practices, critical reflection, and
                  teaching strategies. AskBetty helps you deepen your understanding of early
                  childhood theory and practice.
                </p>
              </div>

              <div>
                <div className="mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Enhanced Learning Experiences</h3>
                <p className="text-muted-foreground">
                  When educators spend less time on paperwork, they have more quality time with
                  children. AskBetty helps create richer learning environments and more meaningful
                  interactions that support each child's unique journey.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-gradient-to-b from-background to-primary/5 pb-16 pt-12">
          <div className="mx-auto w-full max-w-5xl px-4">
            <div className="rounded-lg border bg-card p-8 shadow-lg">
              <div className="mb-6 flex items-center gap-3">
                <h2 className="text-2xl font-semibold">Launching mid-2025</h2>
              </div>
              <p className="mb-6 text-lg text-muted-foreground">
                Our Pedagogy coach is currently in beta testing phase and will be open for sign-ups
                in a matter of weeks, Join the waitlist we can share updates with you and stay tuned
                for our launch date and more exciting feature announcements!
              </p>
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
                <div className="rounded-lg border bg-card/50 p-4">
                  <h3 className="mb-2 font-semibold">Play-based learning ideas</h3>
                  <p className="text-sm text-muted-foreground">
                    Get inspired with creative play activities that support learning outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="py-16">
          <div className="mx-auto w-full max-w-5xl px-4">
            <div className="mb-12 text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                <span>🎉 Early-bird Pricing - Limited Time Only 🎉</span>
              </div>
              <h2 className="mb-4 text-3xl font-bold">Simple, transparent pricing</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Choose the plan that's right for you. All plans include unlimited access to
                AskBetty's core features.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Free Trial */}
              <div className="relative flex flex-col rounded-lg border bg-card p-6 shadow-sm">
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
                <Button className="mt-auto w-full" variant="outline" asChild>
                  <Link to="/waitlist">Join the waitlist!</Link>
                </Button>
              </div>

              {/* Educator */}
              <div className="relative -mx-2 flex scale-105 flex-col rounded-lg border bg-card p-8 shadow-lg">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">Educator</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold">$14</span>
                    <span className="ml-1 text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Billed monthly</p>
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
                <Button className="mt-auto w-full" asChild>
                  <Link to="/waitlist">Join the waitlist!</Link>
                </Button>
              </div>

              {/* Center */}
              <div className="relative flex flex-col rounded-lg border bg-card p-6 shadow-sm">
                {/* <div className="absolute -top-3 right-4 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  Coming Soon
                </div> */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">Centre</h3>
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
                    <span>Centre management tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="mt-auto w-full" variant="outline" asChild>
                  <Link to="/waitlist">Join the waitlist!</Link>
                </Button>
              </div>
            </div>

            <div className="mt-8 flex items-start gap-2 rounded-lg border bg-muted p-4 text-sm">
              <Info className="mt-0.5 h-4 w-4 flex-none" />
              <p className="text-muted-foreground">
                A request is defined as one chat interaction, one document generation, or one
                document refinement after creation.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
