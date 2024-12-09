/**
 * A custom hook for managing chat message interactions and streaming responses.
 * This hook handles sending messages to the chat service and processing streaming responses.
 *
 * @param {Object} props - The hook's configuration object
 * @param {Message[]} props.messages - Array of existing chat messages
 * @param {ModelId} props.model - The ID of the AI model to use
 * @param {Function} props.onMessageStart - Callback fired when a new message starts
 * @param {Function} props.onMessageStream - Callback fired for each chunk of streamed message
 * @param {Function} props.onMessageComplete - Callback fired when message is complete
 * @param {Function} props.onMessageError - Callback fired if an error occurs
 * @returns {Function} A function to send new messages to the chat
 */

import { useCallback } from "react";
import { ChatService } from "~/services/chat-service";
import { useStreamReader } from "./use-stream-reader";
import type { Message } from "~/schemas/chat";
import { ModelId } from "~/lib/constants";

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

        const { content: streamContent, error: streamError } = await streamReader(response, {
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
        onMessageError(error instanceof Error ? error.message : "An error occurred");
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
