import { Button } from "./button";
import { MessageSquarePlus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { LoadingDots } from "./loading-dots";
import { Skeleton } from "./skeleton";

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
  const [starters, setStarters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStarters = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/starters");
      const data = await response.json();
      if (response.ok && data.starters) {
        setStarters(data.starters);
      }
    } catch (error) {
      console.error("Error fetching starters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStarters();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-muted-foreground">
        <div className="flex items-center gap-2">
          <MessageSquarePlus className="h-5 w-5" />
          <span>Try asking about:</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchStarters}
          disabled={isLoading}
          className={cn("h-8 w-8", isLoading && "animate-spin")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {starters.map((starter) => (
            <Button
              key={starter}
              variant="outline"
              className="h-auto whitespace-normal text-left justify-start py-3"
              onClick={() => onSelect(starter)}
            >
              {starter}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
