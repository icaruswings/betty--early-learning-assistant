import { SignIn } from "@clerk/remix";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-background",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton: "text-foreground",
            formFieldLabel: "text-foreground",
            formFieldInput: "bg-background text-foreground",
            footerAction: "text-muted-foreground",
            footer: "text-muted-foreground",
          },
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
