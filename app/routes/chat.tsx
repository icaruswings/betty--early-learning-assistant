import { useRef, useEffect } from "react";
import { LoaderFunctionArgs, redirect, type MetaFunction } from "@remix-run/node";
import { RootLayout } from "~/components/layout/root-layout";
import { ConversationStarters } from "~/components/conversation-starters";
import { getAuth } from "@clerk/remix/ssr.server";
import { useChatState } from "~/hooks/use-chat-state";
import { useChatMessages } from "~/hooks/use-chat-messages";
import { useChatSuggestions } from "~/hooks/use-chat-suggestions";
import EmptyState from "~/components/chat/empty-state";
import MessageList from "~/components/chat/message-list";
import ChatInput from "~/components/chat/input";
import { ScrollArea } from "~/components/ui/scroll-area";

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

  // Suggestions handling
  const { fetchSuggestions } = useChatSuggestions({
    messages,
    onSuggestionsLoading: setLoadingSuggestions,
    onSuggestionsUpdate: setSuggestions,
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
    <RootLayout>
      {isEmpty ? (
        <div className="h-screen w-full max-w-3xl mx-auto p-4 ">
          <div className="h-full flex flex-col">
            <div className="flex-1 flex flex-col justify-center">
              <EmptyState />
              <div className="w-full">
                <ConversationStarters onSelect={sendMessage} />
              </div>
            </div>
            <div className="flex-shrink-0 pt-4">
              <ChatInput
                isLoading={isLoading}
                onSubmit={handleSubmit}
                placeholder="Message Betty"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen w-full max-w-3xl mx-auto p-4 ">
          <div className="h-full flex flex-col">
            <ScrollArea className="flex-1">
              <MessageList messages={messages} />
            </ScrollArea>
            <div className="flex-shrink-0">
              <ChatInput
                isLoading={isLoading}
                onSubmit={handleSubmit}
                placeholder="Ask a follow up..."
              />
            </div>
          </div>
        </div>
      )}
    </RootLayout>
  );
}
