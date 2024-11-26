import { useCallback } from "react";
import { ChatService } from "~/services/chat-service";
import { useStreamReader } from "./use-stream-reader";
import type { Message } from "~/schemas/chat";
import type { ModelId } from "~/components/model-selector";

interface UseChatMessagesProps {
  messages: Message[];
  model: ModelId;
  onMessageStart: (content: string) => void;
  onMessageStream: (content: string) => void;
  onMessageComplete: () => void;
  onMessageError: (error: string) => void;
}

export function useChatMessages({
  messages,
  model,
  onMessageStart,
  onMessageStream,
  onMessageComplete,
  onMessageError,
}: UseChatMessagesProps) {
  const { streamReader } = useStreamReader();

  const sendMessage = useCallback(
    async (content: string) => {
      onMessageStart(content);

      try {
        const response = await ChatService.sendMessage(
          [...messages, { role: "user", content }],
          model
        );

        const { content: streamContent, error: streamError } =
          await streamReader(response, {
            onChunk: (chunk) => {
              onMessageStream(chunk);
            },
            onComplete: () => {
              onMessageComplete();
            },
          });

        if (streamError) {
          throw new Error(streamError);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        onMessageError(
          error instanceof Error ? error.message : "An error occurred"
        );
      }
    },
    [
      messages,
      model,
      onMessageStart,
      onMessageStream,
      onMessageComplete,
      onMessageError,
      streamReader,
    ]
  );

  return { sendMessage };
}
