import { Button } from "./ui/button";
import { MessageSquarePlus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { LoadingDots } from "./ui/loading-dots";
import { Skeleton } from "./ui/skeleton";
import { useAtom } from "jotai";
import { conversationStartersAtom } from "~/atoms";

interface ConversationStartersProps {
  onSelect: (starter: string) => void;
}

function LoadingState() {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex h-auto min-h-[52px] items-center rounded-md border bg-background px-4 py-3"
          >
            <div className="space-y-2 w-full">
              <Skeleton className="h-5 w-[80%]" />
              <Skeleton className="h-5 w-[85%]" />
              <Skeleton className="h-5 w-[60%]" />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/50">
        <LoadingDots />
      </div>
    </div>
  );
}

export function ConversationStarters({ onSelect }: ConversationStartersProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [startersState, setStartersState] = useAtom(conversationStartersAtom);

  const fetchStarters = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/starters");
      const data = await response.json();
      if (response.ok && data.starters) {
        setStartersState({
          starters: data.starters,
          lastFetched: Date.now(),
        });
      }
    } catch (error) {
      console.error("Error fetching starters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we haven't fetched before or if it's been more than 1 hour
    const shouldFetch =
      !startersState.lastFetched ||
      Date.now() - startersState.lastFetched > 3600000;

    if (shouldFetch) {
      fetchStarters();
    } else {
      setIsLoading(false);
    }
  }, [startersState.lastFetched]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquarePlus className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Start a conversation</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchStarters}
          className={cn("h-8 w-8", isLoading && "animate-spin")}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {startersState.starters.map((starter, i) => (
          <Button
            key={i}
            variant="outline"
            className="h-auto min-h-[52px] whitespace-normal text-left justify-start"
            onClick={() => onSelect(starter)}
          >
            {starter}
          </Button>
        ))}
      </div>
    </div>
  );
}
