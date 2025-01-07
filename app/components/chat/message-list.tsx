import type { Message } from "~/schemas/chat";
import { MarkdownMessage } from "../markdown-message";
import { HeartHandshakeIcon } from "lucide-react";

export default function MessageList({ messages }: { messages: Message[] }) {
  return messages.map((message, i) => {
    const isUserMessage = message.role === "user";
    const isAssistantMessage = message.role === "assistant";

    return (
      <article key={i}>
        {isUserMessage && <h5 className="sr-only">You said:</h5>}
        {isAssistantMessage && <h6 className="sr-only">Betty said:</h6>}
        <div className="flex flex-row">
          {isAssistantMessage && (
            <div className="pt-2">
              <HeartHandshakeIcon className="size-10 rounded-full border border-foreground/10 p-2 text-foreground/20" />
            </div>
          )}
          <div className="flex-1">
            <MarkdownMessage content={message.content} isUserMessage={isUserMessage} />
          </div>
        </div>
      </article>
    );
  });
}
