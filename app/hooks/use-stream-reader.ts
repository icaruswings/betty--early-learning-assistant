import { useCallback } from "react";

interface StreamOptions {
  onComplete?: (finalContent: string) => void;
  onChunk?: (chunk: string) => void;
}

interface StreamResult {
  content: string;
  error: string | null;
}

export function useStreamReader() {
  const streamReader = useCallback(
    async (
      response: Response,
      options?: StreamOptions
    ): Promise<StreamResult> => {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      if (!reader) {
        return { content: "", error: "No response body" };
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          const events = text.split("\n\n").filter(Boolean);

          for (const event of events) {
            if (event.startsWith("data: ")) {
              try {
                const data = JSON.parse(event.slice(6));
                if (data.error) {
                  throw new Error(data.error);
                }
                if (data.content) {
                  accumulatedContent += data.content;
                  // Call onChunk with the new content
                  options?.onChunk?.(accumulatedContent);
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }
        }

        options?.onComplete?.(accumulatedContent);
        return { content: accumulatedContent, error: null };
      } catch (error) {
        console.error("Error reading stream:", error);
        return {
          content: accumulatedContent,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        };
      } finally {
        reader.releaseLock();
      }
    },
    []
  );

  return { streamReader };
}
