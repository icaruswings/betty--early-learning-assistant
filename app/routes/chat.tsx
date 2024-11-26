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

  // Authentication check
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      window.location.href = "/";
    }
  }, [isLoaded, isSignedIn]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus input
  useEffect(() => {
    if (isSignedIn && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSignedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
  };

  const isEmpty = messages.length === 1 && messages[0].role === "assistant";

  return (
    <RootLayout>
      <PageHeader>
        <MessageSquare className="w-5 h-5" />
        <h1 className="text-lg font-semibold">Chat</h1>
      </PageHeader>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {messages.map((message, i) => (
            <MarkdownMessage
              key={i}
              content={message.content}
              isUser={message.role === "user"}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {isEmpty && <ConversationStarters onSelect={sendMessage} />}

          {messages.length >= 2 && (
            <SuggestionList
              suggestions={suggestions}
              onSelect={sendMessage}
              isLoading={loadingSuggestions}
            />
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              rows={3}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              className={cn(isLoading && "opacity-50")}
            />
            <Button type="submit" disabled={isLoading}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </RootLayout>
  );
}
