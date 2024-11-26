import { useRef, useEffect } from "react";
import {
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { RootLayout } from "~/components/layout/root-layout";
import { LoadingDots } from "~/components/ui/loading-dots";
import { MarkdownMessage } from "~/components/markdown-message";
import { cn } from "~/lib/utils";
import { MessageSquare } from "lucide-react";
import { ModelSelector } from "~/components/ui/model-selector";
import { ConversationStarters } from "~/components/ui/conversation-starters";
import { SuggestionList } from "~/components/ui/suggestion-list";
import { getAuth } from "@clerk/remix/ssr.server";
import { useUser } from "@clerk/remix";
import { useStreamReader } from "~/hooks/use-stream-reader";
import { useChatState } from "~/hooks/use-chat-state";

export const meta: MetaFunction = () => {
  return [{ title: "Chat - Early Learning Assistant" }];
};

export async function loader(args: LoaderFunctionArgs) {
  const { userId } = await getAuth(args);

  if (!userId) {
    return redirect("/");
  }

  return null;
}

export default function Chat() {
  const { isLoaded, isSignedIn } = useUser();
  const {
    messages,
    input,
    isLoading,
    error,
    model,
    suggestions,
    loadingSuggestions,
    setInput,
    setModel,
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
  const { streamReader } = useStreamReader();

  // Redirect if not authenticated (client-side backup)
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      window.location.href = "/";
    }
  }, [isLoaded, isSignedIn]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const fetchSuggestions = async () => {
    if (!messages.length) return;

    setLoadingSuggestions(true);
    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages],
        }),
      });

      const data = await response.json();
      if (response.ok && data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const sendMessage = async (content: string) => {
    startMessage(content);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content }],
          model,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const { content: streamContent, error: streamError } = await streamReader(
        response,
        {
          onChunk: (chunk) => {
            appendAssistantMessage(chunk);
          },
          onComplete: () => {
            setLoading(false);
            fetchSuggestions();
          },
        }
      );

      if (streamError) {
        throw new Error(streamError);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      removeLastMessage();
    }
  };

  const isEmpty = messages.length === 1 && messages[0].role === "assistant";

  return (
    <RootLayout>
      <div className="flex flex-col h-screen max-h-screen pl-24">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <h1 className="text-lg font-semibold">Chat</h1>
          </div>
          <ModelSelector model={model} onChange={setModel} />
        </div>

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
      </div>
    </RootLayout>
  );
}
