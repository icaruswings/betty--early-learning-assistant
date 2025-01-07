import { useRef, useEffect, useState } from "react";
import { LoaderFunctionArgs, redirect, type MetaFunction } from "@remix-run/node";
import { ConversationStarters } from "~/components/conversation-starters";
import { getAuth } from "@clerk/remix/ssr.server";
import { useChatState } from "~/hooks/use-chat-state";
import { useChatMessages } from "~/hooks/use-chat-messages";
import EmptyState from "~/components/chat/empty-state";
import MessageList from "~/components/chat/message-list";
import ChatInput from "~/components/chat/input";
import { ChatScrollAnchor } from "~/components/chat/chat-scroll-anchor";
import { MessageSquare } from "lucide-react";
import { usePageHeader } from "~/hooks/use-page-header";
import { Message } from "~/schemas/chat";
import ScrollToBottomButton from "~/components/scroll-to-bottom-button";
import { cn } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [{ title: "Ask Betty - Early Learning Assistant" }];
};

export async function loader(args: LoaderFunctionArgs) {
  const { sessionId } = await getAuth(args);
  if (!sessionId) return redirect("/");
  return null;
}

const EmptyStateContent = ({ onSelect }: { onSelect: (content: string) => Promise<void> }) => {
  return (
    <div className="flex flex-col gap-6">
      <EmptyState />
      <ConversationStarters onSelect={onSelect} />
    </div>
  );
};

const ConversationContent = ({
  messages,
  isLoading,
  scrollAreaRef,
  isAtBottom,
}: {
  messages: Message[];
  isLoading: boolean;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  isAtBottom: boolean;
}) => {
  return (
    <div className="relative h-full">
      <MessageList messages={messages} />
      <ChatScrollAnchor
        trackVisibility={isLoading}
        isAtBottom={isAtBottom}
        scrollAreaRef={scrollAreaRef}
      />
    </div>
  );
};

export default function Chat() {
  const {
    messages,
    isLoading,
    model,
    startMessage,
    appendAssistantMessage,
    setError,
    setLoading,
    removeLastMessage,
  } = useChatState();

  const { setTitle, setIcon } = usePageHeader();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    setTitle("Ask Betty");
    setIcon(MessageSquare);
  }, [setTitle, setIcon]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;
    setIsAtBottom(isBottom);
  };

  // Chat message handling
  const { sendMessage } = useChatMessages({
    messages,
    model,
    onMessageStart: startMessage,
    onMessageStream: appendAssistantMessage,
    onMessageComplete: () => {
      setLoading(false);
    },
    onMessageError: (error) => {
      setError(error);
      removeLastMessage();
    },
  });

  const isEmpty = messages.length === 0;

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div ref={scrollAreaRef} className="relative flex-1 overflow-y-auto" onScroll={handleScroll}>
        <div className="container max-w-3xl">
          {isEmpty ? (
            <EmptyStateContent onSelect={sendMessage} />
          ) : (
            <ConversationContent
              messages={messages}
              isLoading={isLoading}
              scrollAreaRef={scrollAreaRef}
              isAtBottom={isAtBottom}
            />
          )}
        </div>

        <div className={cn("sticky bottom-4 flex h-10 justify-center")}>
          <ScrollToBottomButton
            className={cn(
              "transition-[opacity,_display]",
              "starting:opacity-0 transition-discrete duration-600 ease-in-out",
              !isAtBottom && !isEmpty ? "visible opacity-100" : "hidden opacity-0"
            )}
            onClick={scrollToBottom}
          />
        </div>
      </div>
      <div className="sticky bottom-0 z-10 bg-background/80 backdrop-blur">
        <div className="container max-w-3xl pb-4">
          <ChatInput onSubmit={sendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
