/**
 * A custom hook that provides functionality for reading and processing streaming responses.
 * It handles the low-level details of reading a streaming response using the ReadableStream API
 * and provides callbacks for handling chunks of data and completion.
 * 
 * @returns {Object} An object containing a function that takes a Response object and options, 
 * and returns a Promise with the accumulated content and any error that occurred.
 * 
 * @example
 * const { streamReader } = useStreamReader();
 * const result = await streamReader(response, {
 *   onChunk: (chunk) => console.log(chunk),
 *   onComplete: (content) => console.log('Complete:', content)
 * });
 */

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
      let lastChunkTime = Date.now();
      const TIMEOUT_MS = 10000; // 10 seconds timeout

      if (!reader) {
        return { content: "", error: "No response body" };
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const currentTime = Date.now();
          if (currentTime - lastChunkTime > TIMEOUT_MS) {
            throw new Error("Stream timeout - no data received for 10 seconds");
          }
          lastChunkTime = currentTime;

          const text = decoder.decode(value);
          const events = text.split("\n\n").filter(Boolean);

          for (const event of events) {
            if (event.startsWith("data: ")) {
              try {
                const data = JSON.parse(event.slice(6));
                if (data.error) {
                  throw new Error(data.error);
                }
                if (data.content !== undefined) {
                  accumulatedContent += data.content;
                  options?.onChunk?.(accumulatedContent);
                }
                if (data.done) {
                  options?.onComplete?.(accumulatedContent);
                  return { content: accumulatedContent, error: null };
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e);
                if (e instanceof Error) {
                  return { content: accumulatedContent, error: e.message };
                }
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
          error: error instanceof Error ? error.message : "Unknown error occurred",
        };
      } finally {
        reader.releaseLock();
      }
    },
    []
  );

  return { streamReader };
}
