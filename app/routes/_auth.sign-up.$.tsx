import { SignUp } from "@clerk/remix";
import { dark } from "@clerk/themes";
import { type MetaFunction } from "@remix-run/node";
import { useTheme } from "remix-themes";

export const meta: MetaFunction = () => {
  return [{ title: "Ask Betty - Early Learning Assistant" }];
};

export default function SignUpPage() {
  const [theme] = useTheme();

  return <SignUp appearance={{ baseTheme: theme === "dark" ? dark : undefined }} />;
}
