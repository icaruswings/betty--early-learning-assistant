import { MarkdownMessage } from "./markdown-message";
import { useStreamReader } from "~/hooks/use-stream-reader";

interface StreamingMessageProps {
  messagePromise: Promise<Response>;
  onComplete?: (content: string) => void;
}

export function StreamingMessage({ messagePromise, onComplete }: StreamingMessageProps) {
  const { content, error } = useStreamReader(messagePromise, { onComplete });

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-50">
        Error: {error}
      </div>
    );
  }

  return <MarkdownMessage content={content} isUser={false} />;
}
