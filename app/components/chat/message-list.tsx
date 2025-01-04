import type { Message } from "~/schemas/chat";
import { MarkdownMessage } from "../markdown-message";

export default function MessageList({ messages }: { messages: Message[] }) {
  return messages.map((message, i) => {
    const isUserMessage = message.role === "user";
    const isAssistantMessage = message.role === "assistant";

    return (
      <article key={i}>
        {isUserMessage && <h5 className="sr-only">You said:</h5>}
        {isAssistantMessage && <h6 className="sr-only">Betty said:</h6>}
        <MarkdownMessage content={message.content} isUserMessage={isUserMessage} />
      </article>
    );
  });
}
