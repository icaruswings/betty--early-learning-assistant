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

type ChunkParserOptions = {
  DATA_PREFIX: string;
};

interface StreamOptions {
  onComplete?: (finalContent: string) => void;
  onChunk?: (chunk: string) => void;
  parserOptions?: ChunkParserOptions;
}

interface StreamResult {
  content: string;
  error: string | null;
}

const TIMEOUT_MS = 10000; // 10 seconds timeout

const processEventStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onChunk: (chunk: string) => Promise<void>
) => {
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      await onChunk(new TextDecoder().decode(value));
    }
  } finally {
    reader.releaseLock();
  }
};

const createChunkParser = (options?: ChunkParserOptions) => {
  const { DATA_PREFIX = "data: " } = options || {};

  let buffer: string = "";

  return (chunk: string) => {
    const lines = (buffer + chunk).split("\n");
    buffer = lines.pop() || "";

    return lines
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith(DATA_PREFIX)) return null;

        const data = trimmed.substring(DATA_PREFIX.length);
        return JSON.parse(data);
      })
      .filter(Boolean);
  };
};

export function useStreamReader() {
  const streamReader = useCallback(
    async (response: Response, options?: StreamOptions): Promise<StreamResult> => {
      if (!response.ok) return { content: "", error: await response.text() };
      if (!response.body) return { content: "", error: "No response body available" };

      const reader = response.body.getReader();
      const parseChunk = createChunkParser(options?.parserOptions);

      let accumulatedContent = "";

      await processEventStream(reader, async (chunk: string) => {
        const events = parseChunk(chunk);

        events.forEach((event) => {
          if (event.event === "on_chat_model_stream") {
            accumulatedContent += event.data.chunk.kwargs.content;
            options?.onChunk?.(accumulatedContent);
          }

          if (event.event === "on_chat_model_end") {
            options?.onComplete?.(accumulatedContent);
            return { content: accumulatedContent, error: null };
          }
        });
      });

      return { content: accumulatedContent, error: null };
    },
    []
  );

  return { streamReader };
}
