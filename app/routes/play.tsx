import { MetaFunction } from "@remix-run/node";
import { MessageSquare } from "lucide-react";
import { PageHeader } from "~/components/layout/page-header";
import { RootLayout } from "~/components/layout/root-layout";

export const meta: MetaFunction = () => {
  return [
    { title: "Play to Learn - AI Chat App" },
    {
      name: "description",
      content: "Interactive learning activities powered by AI",
    },
  ];
};

export default function Play() {
  return (
    <RootLayout>
      <PageHeader>
        <MessageSquare className="w-5 h-5" />
        <h1 className="text-lg font-semibold">Play to Learn</h1>
      </PageHeader>

      <div className="flex flex-col items-center justify-center p-4 h-[calc(100vh-65px)]">
        <div className="max-w-2xl text-center space-y-4">
          <p className="text-lg">
            Coming soon: An interactive space where learning meets play!
          </p>
          <p className="text-lg">
            We're building engaging activities that will help you learn through
            play, powered by AI. Stay tuned for:
          </p>
          <ul className="list-none space-y-2 mt-4">
            <li>🎮 Interactive learning games</li>
            <li>🧩 AI-powered puzzles</li>
            <li>🤝 Collaborative learning challenges</li>
            <li>📚 Personalized learning paths</li>
          </ul>
        </div>
      </div>
    </RootLayout>
  );
}
