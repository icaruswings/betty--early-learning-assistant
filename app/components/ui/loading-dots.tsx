import { cn } from "~/lib/utils";

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn("space-x-1 flex items-center", className)}>
      <div className="w-2 h-2 bg-current rounded-full animate-[loading-dot_0.8s_ease-in-out_infinite]" />
      <div className="w-2 h-2 bg-current rounded-full animate-[loading-dot_0.8s_ease-in-out_0.2s_infinite]" />
      <div className="w-2 h-2 bg-current rounded-full animate-[loading-dot_0.8s_ease-in-out_0.4s_infinite]" />
    </div>
  );
}
