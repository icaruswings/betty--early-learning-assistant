import { PageHeader } from "~/components/layout/page-header";
import { Book } from "lucide-react";
import { usePageHeader } from "~/hooks/use-page-header";
import { useEffect } from "react";

export default function LearningObservations() {
  const { setIcon, setTitle } = usePageHeader();
  useEffect(() => {
    setIcon(Book);
    setTitle("Learning Observations");

    return () => {
      setIcon(null);
      setTitle("");
    };
  }, [setIcon, setTitle]);

  return (
    <div className="flex-1">
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Coming Soon</h2>
          <p className="mb-4 text-gray-600">
            Our learning observations feature is under development.
          </p>
        </div>
      </div>
    </div>
  );
}
