import type { Message } from "~/schemas/chat";
import { MarkdownMessage } from "../markdown-message";
import { HeartHandshakeIcon } from "lucide-react";

export default function MessageList({
  messages,
  isStreaming = false,
}: {
  messages: Message[];
  isStreaming?: boolean;
}) {
  const lastAssistantIndex = [...messages].reverse().findIndex((m) => m.role === "assistant");

  return messages.map((message, i) => {
    const isUserMessage = message.role === "user";
    const isAssistantMessage = message.role === "assistant";
    const isLastAssistantMessage =
      isAssistantMessage && i === messages.length - 1 - lastAssistantIndex;

    return (
      <article key={i}>
        {isUserMessage && <h5 className="sr-only">You said:</h5>}
        {isUserMessage && (
          <div className="ml-auto flex max-w-[70%] flex-1 flex-row rounded-2xl rounded-br-none bg-gray-100 px-6 py-4 text-base text-gray-900 dark:bg-gray-800 dark:text-gray-100">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        )}

        {isAssistantMessage && <h6 className="sr-only">Betty said:</h6>}
        {isAssistantMessage && (
          <div className="flex flex-1 flex-row gap-4 px-2 py-4 text-base sm:gap-6 sm:px-6">
            <HeartHandshakeIcon className="size-10 flex-none rounded-full border border-foreground/10 p-2 text-foreground/20" />
            <MarkdownMessage
              isStreaming={isLastAssistantMessage && isStreaming}
              content={message.content}
            />
          </div>
        )}
      </article>
    );
  });
}
