import { useState, useEffect } from "react";
import { MarkdownMessage } from "./markdown-message";

interface StreamingMessageProps {
  messagePromise: Promise<Response>;
  onComplete?: (content: string) => void;
}

export function StreamingMessage({ messagePromise, onComplete }: StreamingMessageProps) {
  const [content, setContent] = useState("");

  useEffect(() => {
    let accumulated = "";

    async function readStream() {
      try {
        const response = await messagePromise;
        if (!response.ok) throw new Error("Stream response was not ok");
        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          accumulated += text;
          setContent(accumulated);
        }

        if (onComplete) {
          onComplete(accumulated);
        }
      } catch (error) {
        console.error("Error reading stream:", error);
      }
    }

    readStream();

    return () => {
      // Cleanup if needed
    };
  }, [messagePromise, onComplete]);

  return <MarkdownMessage content={content} isUser={false} />;
}
