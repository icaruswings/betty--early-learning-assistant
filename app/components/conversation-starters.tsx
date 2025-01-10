import { Button } from "./ui/button";
import { MessageSquarePlus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { LoadingDots } from "./ui/loading-dots";
import { Skeleton } from "./ui/skeleton";
import { useAtom } from "jotai";
import { conversationStartersAtom } from "~/atoms";
import useIsMdScreen from "~/hooks/use-is-mobile";

interface ConversationStartersProps {
  onSelect: (starter: string) => void;
}

function LoadingState() {
  const isMdScreen = useIsMdScreen();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquarePlus className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Start a conversation</h2>
        </div>
        <div className="h-8 w-8" />
      </div>

      <div className="relative flex flex-row gap-2 md:grid md:grid-cols-2">
        {Array.from({ length: isMdScreen ? 2 : 4 }).map((_, i) => (
          <div
            key={i}
            className="h-auto min-h-[52px] flex-1 items-center rounded-md border bg-background px-4 py-3 md:flex-none"
          >
            <div className="w-full space-y-1">
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[60%]" />
              <Skeleton className="h-4 w-[40%]" />
            </div>
          </div>
        ))}
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <LoadingDots />
        </div>
      </div>
    </div>
  );
}

export function ConversationStarters({ onSelect }: ConversationStartersProps) {
  const [isLoading, setIsLoading] = useState(true);
  const isMdScreen = useIsMdScreen();
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
      !startersState.lastFetched || Date.now() - startersState.lastFetched > 3600000;

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
          <MessageSquarePlus className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Start a conversation</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchStarters}
          className={cn("h-8 w-8", isLoading && "animate-spin")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-row gap-2 md:grid md:grid-cols-2">
        {startersState.starters.slice(0, isMdScreen ? 2 : undefined).map((starter, i) => (
          <Button
            key={i}
            variant="outline"
            className="h-auto min-h-[52px] flex-1 justify-start whitespace-normal text-left md:flex-none"
            onClick={() => onSelect(starter)}
          >
            <span className="line-clamp-3">{starter}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
