import { useState } from "react";
import { MarkdownMessage } from "~/components/markdown-message";
import { type Message } from "~/schemas/chat";
import { useStreamReader } from "~/hooks/use-stream-reader";
import { ChatService } from "~/services/chat-service";
import ChatInput from "~/components/chat/input";

interface ObservationChatProps {
  onSave: (observation: string) => void;
}

export function ObservationChat({ onSave }: ObservationChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'll help you write an observation. To get started, tell me about what you observed. Include details about:\n\n- Who was involved\n- What happened\n- When it occurred\n- Where it took place\n- Any significant interactions or learning moments",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { streamReader } = useStreamReader();

  const handleSubmit = async (input: string) => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await ChatService.sendMessage(
        [...messages, userMessage],
        "gpt-4"
      );

      // Create a temporary assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const { content: streamContent, error: streamError } = await streamReader(
        response,
        {
          onChunk: (chunk) => {
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage?.role === "assistant") {
                lastMessage.content = chunk;
              }
              return newMessages;
            });
          },
        }
      );

      if (streamError) {
        throw new Error(streamError);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your message.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4 p-4">
          {messages.map((message, i) => (
            <MarkdownMessage
              key={i}
              content={message.content}
              isUserMessage={message.role === "user"}
            />
          ))}
        </div>
      </div>

      <div className="border-t p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            isLoading={isLoading}
            onSubmit={handleSubmit}
            placeholder="Type your message..."
          />
        </div>
      </div>
    </div>
  );
}
