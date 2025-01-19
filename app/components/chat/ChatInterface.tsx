import { Message } from "~/schemas/chat";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import EmptyState from "./EmptyState";
import { ChatScrollAnchor } from "./ChatScrollAnchor";

type Props = {
  chatId: string;
  messages: Message[];
};

export default function ChatInterface({ chatId, messages }: Props) {
  return (
    <main className="flex h-full flex-col">
      <section className="flex-1">
        {messages.length === 0 && <EmptyState />}
        <MessageList messages={messages} />
        <ChatScrollAnchor trackVisibility={false} isAtBottom={false} scrollAreaRef={null} />
      </section>
      <footer>
        <ChatInput onSubmit={() => {}} placeholder="Type your message here." isLoading={false} />
      </footer>
    </main>
  );
}
