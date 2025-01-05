import { useRef, useEffect, useState } from "react";
import { LoaderFunctionArgs, redirect, type MetaFunction } from "@remix-run/node";
import { ConversationStarters } from "~/components/conversation-starters";
import { getAuth } from "@clerk/remix/ssr.server";
import { useChatState } from "~/hooks/use-chat-state";
import { useChatMessages } from "~/hooks/use-chat-messages";
import { useChatSuggestions } from "~/hooks/use-chat-suggestions";
import EmptyState from "~/components/chat/empty-state";
import MessageList from "~/components/chat/message-list";
import ChatInput from "~/components/chat/input";
import { ChatScrollAnchor } from "~/components/chat/chat-scroll-anchor";
import { PageHeader } from "~/components/layout/page-header";
import { MessageSquare, ArrowDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { usePageHeader } from "~/hooks/use-page-header";
import { Message } from "~/schemas/chat";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [{ title: "Chat - Early Learning Assistant" }];
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
    setSuggestions,
    setLoadingSuggestions,
    setLoading,
    removeLastMessage,
  } = useChatState();

  const { setTitle, setIcon } = usePageHeader();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    setTitle("Chat");
    setIcon(MessageSquare);
  }, [setTitle, setIcon]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;
    setIsAtBottom(isBottom);
  };

  // Suggestions handling
  const { fetchSuggestions } = useChatSuggestions({
    messages,
    onSuggestionsLoading: setLoadingSuggestions,
    onSuggestionsUpdate: setSuggestions,
  });

  // Chat message handling
  const { sendMessage } = useChatMessages({
    messages,
    model,
    onMessageStart: startMessage,
    onMessageStream: appendAssistantMessage,
    onMessageComplete: () => {
      setLoading(false);
      fetchSuggestions();
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
      <PageHeader className="flex-none" />
      <div 
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto relative" 
        onScroll={handleScroll}
      >
        <div className="mx-auto h-full w-full max-w-3xl px-4">
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
        {!isAtBottom && !isEmpty && (
          <div className="sticky bottom-4 flex justify-center">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full shadow-lg"
              onClick={scrollToBottom}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="sticky bottom-0 z-10 bg-background/80 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl px-4 pb-4">
          <ChatInput
            onSubmit={sendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
