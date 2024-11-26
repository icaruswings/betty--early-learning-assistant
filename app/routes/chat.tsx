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
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Betty, your Early Learning Assistant. I'm here to help with observations, documentation, teaching strategies, and professional development. How can I support you today?",
    },
  ]);
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
    const assistantMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMessage]);
    setInput("");
    setError(null);
    setIsLoading(true);
    setSuggestions([]); // Clear suggestions immediately

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

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const events = text.split("\n\n").filter(Boolean);

        for (const event of events) {
          if (event.startsWith("data: ")) {
            try {
              const data = JSON.parse(event.slice(6));
              accumulatedContent += data.content;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: accumulatedContent,
                };
                return newMessages;
              });
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }

      // Set loading to false after streaming is complete
      setIsLoading(false);

      // Only fetch suggestions after streaming is complete
      setLoadingSuggestions(true);
      const suggestionsResponse = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage, { role: "assistant", content: accumulatedContent }],
        }),
      });

      const suggestionsData = await suggestionsResponse.json();
      if (suggestionsResponse.ok && suggestionsData.suggestions) {
        setSuggestions(suggestionsData.suggestions);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      setMessages((prev) => prev.slice(0, -1)); // Remove the failed message
      setIsLoading(false);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const isEmpty = messages.length === 1 && messages[0].role === "assistant";

  const renderSuggestions = () => {
    if (isLoading) return null; // Don't show suggestions while streaming
    if (loadingSuggestions) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <LoadingDots />
          <span>Loading suggestions...</span>
        </div>
      );
    }
    if (suggestions.length > 0 && !isEmpty) {
      return (
        <SuggestionList
          suggestions={suggestions}
          onSelect={sendMessage}
          isLoading={loadingSuggestions}
        />
      );
    }
    return null;
  };

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
                    <h2 className="text-2xl font-semibold">
                      Start a Conversation
                    </h2>
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
                    <div
                      key={i}
                      ref={i === messages.length - 1 ? messagesEndRef : null}
                    >
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
                    isEmpty
                      ? "Type your question here..."
                      : "Type your message..."
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

              {!isEmpty && renderSuggestions()}
            </div>
          </>
        ) : null}
      </div>
    </RootLayout>
  );
}
