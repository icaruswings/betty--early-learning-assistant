import { PageHeader } from "~/components/layout/page-header";
import { Book } from "lucide-react";

export default function LearningObservations() {
  return (
    <div className="h-full flex-1">
      <PageHeader>
        <Book className="h-5 w-5" />
        <h1 className="text-lg font-semibold">Learning Observations</h1>
      </PageHeader>
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
          <p className="text-gray-600 mb-4">Learning observations feature is under development.</p>
        </div>
      </div>
    </div>
  );
}