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
import { ScrollArea } from "~/components/ui/scroll-area";
import { ChatScrollAnchor } from "~/components/chat/chat-scroll-anchor";

export const meta: MetaFunction = () => {
  return [{ title: "Chat - Early Learning Assistant" }];
};

export async function loader(args: LoaderFunctionArgs) {
  const { sessionId } = await getAuth(args);
  if (!sessionId) return redirect("/");
  return null;
}

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

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

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

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (input: string) => {
    if (!input.trim()) return;
    await sendMessage(input);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="mx-auto flex h-screen w-full max-w-3xl flex-1 flex-col">
      {isEmpty ? (
        <div className="flex flex-1 flex-col justify-center gap-6">
          <EmptyState />
          <ConversationStarters onSelect={sendMessage} />
        </div>
      ) : (
        <ScrollArea ref={scrollAreaRef} onScroll={handleScroll} type="hover" className="flex-1">
          <MessageList messages={messages} />
          <ChatScrollAnchor
            trackVisibility={isLoading}
            isAtBottom={isAtBottom}
            scrollAreaRef={scrollAreaRef}
          />
        </ScrollArea>
      )}
      <div className="flex-none pt-4">
        <ChatInput isLoading={isLoading} onSubmit={handleSubmit} placeholder="Ask Betty ..." />
      </div>
    </div>
  );
}
