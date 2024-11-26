import { useState, useRef, useEffect, useMemo } from "react";
import {
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { RootLayout } from "~/components/layout/root-layout";
import { LoadingDots } from "~/components/ui/loading-dots";
import { MarkdownMessage } from "~/components/markdown-message";
import { cn } from "~/lib/utils";
import { MessageSquare } from "lucide-react";
import type { Message } from "~/schemas/chat";
import { ModelSelector, type ModelId } from "~/components/ui/model-selector";
import { ConversationStarters } from "~/components/ui/conversation-starters";
import { SuggestionList } from "~/components/ui/suggestion-list";
import { getAuth } from "@clerk/remix/ssr.server";
import { useUser } from "@clerk/remix";

export const meta: MetaFunction = () => {
  return [
    { title: "Chat - AI Assistant" },
    { name: "description", content: "Chat with your AI Assistant" },
  ];
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<ModelId>("gpt-4");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    const userMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setIsLoading(true);
    setSuggestions([]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "An error occurred while processing your request"
        );
      }

      const assistantMessage = { role: "assistant", content: data.content };
      setMessages((prev) => [...prev, assistantMessage]);

      const suggestionsResponse = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage, assistantMessage],
        }),
      });

      const suggestionsData = await suggestionsResponse.json();
      if (suggestionsResponse.ok && suggestionsData.suggestions) {
        setSuggestions(suggestionsData.suggestions);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError(
        error instanceof Error ? error.message : "An error occurred"
      );
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      setLoadingSuggestions(false);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <RootLayout>
      <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 pl-24">
        {!isLoaded ? (
          <div className="flex items-center justify-center flex-1">
            <LoadingDots />
          </div>
        ) : isSignedIn ? (
          <>
            <div className="mb-4 flex justify-end">
              <ModelSelector model={model} onChange={setModel} />
            </div>
            <div
              className={cn(
                "flex-grow overflow-y-auto space-y-4 pb-4",
                isEmpty && "flex flex-col items-center justify-center"
              )}
            >
              {isEmpty ? (
                <div className="text-center space-y-6 w-full max-w-2xl mx-auto">
                  <div className="space-y-2">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground" />
                    <h2 className="text-2xl font-semibold">Start a Conversation</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      Ask me anything about early education, lesson planning, or
                      activities.
                    </p>
                  </div>
                  <ConversationStarters onSelect={sendMessage} />
                </div>
              ) : (
                <>
                  {messages.map((message, i) => (
                    <div key={i} ref={i === messages.length - 1 ? messagesEndRef : null}>
                      <MarkdownMessage 
                        content={message.content}
                        isUser={message.role === "user"}
                      />
                    </div>
                  ))}
                  {isLoading && (
                    <div className="p-4 rounded-lg max-w-[80%] bg-gray-200 text-black">
                      <LoadingDots />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="space-y-4 pt-4">
              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-center">
                  {error}
                </div>
              )}

              {!isEmpty && (
                <SuggestionList
                  suggestions={suggestions}
                  onSelect={sendMessage}
                  isLoading={loadingSuggestions}
                />
              )}
              <form
                onSubmit={handleSubmit}
                className={cn(
                  "flex space-x-2",
                  isEmpty && "max-w-2xl mx-auto w-full"
                )}
              >
                <Input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isEmpty ? "Type your question here..." : "Type your message..."
                  }
                  disabled={isLoading}
                  className={cn("flex-grow", isEmpty && "text-lg py-6")}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  size={isEmpty ? "lg" : "default"}
                >
                  Send
                </Button>
              </form>
            </div>
          </>
        ) : null}
      </div>
    </RootLayout>
  );
}
