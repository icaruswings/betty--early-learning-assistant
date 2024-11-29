import { useRef, useEffect } from "react";
import {
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { RootLayout } from "~/components/layout/root-layout";
import { MarkdownMessage } from "~/components/markdown-message";
import { cn } from "~/lib/utils";
import { MessageSquare } from "lucide-react";
import { ConversationStarters } from "~/components/conversation-starters";
import { SuggestionList } from "~/components/suggestion-list";
import { getAuth } from "@clerk/remix/ssr.server";
import { useUser } from "@clerk/remix";
import { useChatState } from "~/hooks/use-chat-state";
import { useChatMessages } from "~/hooks/use-chat-messages";
import { useChatSuggestions } from "~/hooks/use-chat-suggestions";
import { PageHeader } from "~/components/layout/page-header";
import EmptyState from "~/components/chat/empty-state";
import MessageList from "~/components/chat/message-list";
import ChatInput from "~/components/chat/input";

export const meta: MetaFunction = () => {
  return [{ title: "Chat - Early Learning Assistant" }];
};

export async function loader(args: LoaderFunctionArgs) {
  const { sessionId } = await getAuth(args);
  if (!sessionId) return redirect("/");
  return null;
}

export default function Chat() {
  const { isLoaded, isSignedIn } = useUser();
  const {
    messages,
    input,
    isLoading,
    model,
    suggestions,
    loadingSuggestions,
    setInput,
    startMessage,
    appendAssistantMessage,
    setError,
    setSuggestions,
    setLoadingSuggestions,
    setLoading,
    removeLastMessage,
  } = useChatState();

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
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

  // Auto-scroll to bottom
  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

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
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="max-w-3xl mx-auto p-4 flex flex-col gap-6">
            <EmptyState />
            <ChatInput
              isLoading={isLoading}
              onSubmit={handleSubmit}
              placeholder="Message Betty"
            />
            <ConversationStarters onSelect={sendMessage} />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto p-4 space-y-4">
            <MessageList messages={messages} />
            <ChatInput
              isLoading={isLoading}
              onSubmit={handleSubmit}
              placeholder="Ask a follow up..."
            />
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length >= 2 && (
            <SuggestionList
              suggestions={suggestions}
              onSelect={sendMessage}
              isLoading={loadingSuggestions}
            />
          )}
        </div>
      </div>
    </RootLayout>
  );
}
