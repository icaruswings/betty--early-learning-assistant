import { PageHeader } from "~/components/layout/page-header";
import { Book } from "lucide-react";

export default function LearningStories() {
  return (
    <div className="flex-1">
      <PageHeader>
        <Book className="h-5 w-5" />
        <h1 className="text-lg font-semibold">Learning Stories</h1>
      </PageHeader>
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Coming Soon</h2>
          <p className="mb-4 text-gray-600">Our learning stories feature is under development.</p>
        </div>
      </div>
    </div>
  );
}
