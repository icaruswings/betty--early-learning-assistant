import { SignIn } from "@clerk/remix";
import { dark } from "@clerk/themes";
import { type MetaFunction } from "@remix-run/node";
import { useTheme } from "remix-themes";

export const meta: MetaFunction = () => {
  return [{ title: "Ask Betty - Early Learning Assistant" }];
};

export default function SignInPage() {
  const [theme] = useTheme();

  return <SignIn appearance={{ baseTheme: theme === "dark" ? dark : undefined }} />;
}
