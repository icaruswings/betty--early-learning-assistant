import { Waitlist } from "@clerk/clerk-react";

export default function WaitlistPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Join the Waitlist
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign up to get early access to our AI chat app
          </p>
        </div>
        <div className="mt-8">
          <Waitlist />
        </div>
      </div>
    </div>
  );
}
