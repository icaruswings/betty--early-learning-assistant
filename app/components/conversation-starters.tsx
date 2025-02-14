import { Button } from "./ui/button";
import { MessageSquarePlus, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { LoadingDots } from "./ui/loading-dots";
import { Skeleton } from "./ui/skeleton";
import useIsMdScreen from "~/hooks/use-is-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";

interface ConversationStartersProps {
  onSelect: (starter: string) => void;
}

function LoadingState() {
  const isMdScreen = useIsMdScreen();
  return (
    <div className="space-y-4">
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
  const [isLoading, setIsLoading] = useState(false);
  const [starters, setStarters] = useState<string[]>([]);

  const fetchStarters = useCallback(async () => {
    setIsLoading(true);

    if (starters.length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching starters...");

      const response = await fetch("/api/starters");
      const data = await response.json();

      if (response.ok && data.starters) {
        setStarters(data.starters);
      }
    } catch (error) {
      console.error("Error fetching starters:", error);
      setStarters([]);
    } finally {
      setIsLoading(false);
    }
  }, [starters]);

  useEffect(() => {
    fetchStarters();
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      <div className="mx-3 mt-12 flex max-w-3xl flex-wrap items-stretch justify-center gap-4">
        <div className="flex max-w-3xl flex-wrap items-stretch justify-center gap-4">
          {starters.slice(0, 2).map((starter, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="flex h-auto w-40 flex-col items-start gap-2 rounded-2xl px-3 py-4 text-start text-[15px]"
                  onClick={() => onSelect(starter)}
                >
                  <span className="line-clamp-3 text-balance text-gray-600 dark:text-gray-400">
                    {starter}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <TooltipArrow />
                {starter}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {starters.length > 2 && (
          <div className="hidden max-w-3xl flex-wrap items-stretch justify-center gap-4 md:flex">
            {starters.slice(2).map((starter, index) => (
              <Tooltip key={index + 2}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex h-auto w-40 flex-col items-start gap-2 rounded-2xl px-3 py-4 text-start text-[15px]"
                    onClick={() => onSelect(starter)}
                  >
                    <span className="line-clamp-3 text-balance text-gray-600 dark:text-gray-400">
                      {starter}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <TooltipArrow />
                  {starter}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
