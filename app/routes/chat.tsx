import { useState, useRef, useEffect } from "react";
import type { MetaFunction } from "@remix-run/node";
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

export const meta: MetaFunction = () => {
  return [
    { title: "Chat - AI Assistant" },
    { name: "description", content: "Chat with your AI Assistant" },
  ];
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<ModelId>("gpt-3.5-turbo");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto focus the input when the component mounts
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
  };

  const sendMessage = async (content: string) => {
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          model
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred while processing your request");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isEmpty = messages.length === 0 && !isLoading;

  return (
    <RootLayout>
      <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 pl-24">
        <div className="mb-4 flex justify-end">
          <ModelSelector model={model} onChange={setModel} />
        </div>
        <div className={cn(
          "flex-grow overflow-y-auto space-y-4 pb-4",
          isEmpty && "flex flex-col items-center justify-center"
        )}>
          {isEmpty ? (
            <div className="text-center space-y-6 w-full max-w-2xl mx-auto">
              <div className="space-y-2">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground" />
                <h2 className="text-2xl font-semibold">Start a Conversation</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Ask me anything about early education, lesson planning, or activities.
                </p>
              </div>
              <ConversationStarters onSelect={sendMessage} />
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <MarkdownMessage
                  key={index}
                  content={message.content}
                  isUser={message.role === "user"}
                />
              ))}
              {isLoading && (
                <div className="p-4 rounded-lg max-w-[80%] bg-gray-200 text-black">
                  <LoadingDots />
                </div>
              )}
              {error && (
                <div className="p-4 rounded-lg max-w-[80%] bg-destructive/10 text-destructive">
                  {error}
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className={cn(
          "flex space-x-2",
          isEmpty && "max-w-2xl mx-auto w-full"
        )}>
          <Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isEmpty ? "Type your question here..." : "Type your message..."}
            disabled={isLoading}
            className={cn(
              "flex-grow",
              isEmpty && "text-lg py-6"
            )}
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
    </RootLayout>
  );
}
