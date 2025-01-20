import { useRef, useEffect, useState } from "react";
import { LoaderFunctionArgs, redirect, type MetaFunction } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { useChatState } from "~/hooks/use-chat-state";
import MessageList from "~/components/chat/MessageList";
import ChatInput from "~/components/chat/ChatInput";
import { ChatScrollAnchor } from "~/components/chat/ChatScrollAnchor";
import { MessageSquare } from "lucide-react";
import { usePageHeader } from "~/hooks/use-page-header";
import ScrollToBottomButton from "~/components/scroll-to-bottom-button";
import { cn } from "~/lib/utils";
import { useParams } from "@remix-run/react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { ChatService } from "~/services/chat-service";
import { useStreamReader } from "~/hooks/use-stream-reader";

export const meta: MetaFunction = () => {
  return [{ title: "Ask Betty - Early Learning Assistant" }];
};

export async function loader(args: LoaderFunctionArgs) {
  const { sessionId } = await getAuth(args);
  if (!sessionId) return redirect("/");
  return null;
}

export default function Chat() {
  const { id } = useParams();

  const conversation = useQuery(api.chats.getConversation, {
    conversationId: id as Id<"conversations">,
  });

  const existingMessages =
    useQuery(api.chats.getMessages, {
      conversationId: id as Id<"conversations">,
    }) || [];

  const {
    messages,
    isLoading,
    model,
    startMessage,
    appendAssistantMessage,
    setError,
    setLoading,
    removeLastMessage,
    setMessages,
  } = useChatState();

  const { setTitle, setIcon } = usePageHeader();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Set the conversation title and messages once loaded
  useEffect(() => {
    if (conversation) {
      setTitle(conversation.title);
      setIcon(MessageSquare);
    }

    return () => {
      setTitle("");
      setIcon(null);
    };
  }, [conversation, setTitle, setIcon]);

  // Load existing messages
  useEffect(() => {
    if (!existingMessages) {
      return;
    }

    setMessages(existingMessages.map(({ role, content }) => ({ content, role })));

    // Scroll to bottom after a short delay to ensure messages are rendered
    setTimeout(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
          top: scrollAreaRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
  }, [existingMessages, setMessages]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;
    setIsAtBottom(isBottom);
  };

  const { streamReader } = useStreamReader();

  async function sendMessage(content: string) {
    startMessage(content);

    const response = await ChatService.sendMessage(messages, { role: "user", content }, model);

    const { content: streamContent, error: streamError } = await streamReader(response, {
      onChunk(chunk) {
        appendAssistantMessage(chunk);
      },
      onComplete(finalContent) {
        setLoading(false);
      },
    });

    if (streamError) {
      console.error(streamError);
      setError(streamError);
      removeLastMessage();
    }
  }

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  if (!conversation || !existingMessages) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollAreaRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4">
        <div className="mx-auto max-w-3xl space-y-4 py-4">
          <div className="relative h-full">
            <MessageList messages={messages} isStreaming={isLoading} />
            <ChatScrollAnchor
              trackVisibility={isLoading}
              isAtBottom={isAtBottom}
              scrollAreaRef={scrollAreaRef}
            />
          </div>
        </div>

        <div className={cn("sticky bottom-4 flex h-10 justify-center")}>
          <ScrollToBottomButton
            className={cn(
              "transition-[opacity,_display]",
              "duration-600 ease-in-out transition-discrete starting:opacity-0",
              !isAtBottom ? "visible opacity-100" : "hidden opacity-0"
            )}
            onClick={scrollToBottom}
          />
        </div>
      </div>

      <div className="border-t bg-background px-4">
        <div className="mx-auto max-w-3xl py-4">
          <ChatInput
            isLoading={isLoading}
            onSubmit={async (content) => {
              await sendMessage(content);
            }}
          />
        </div>
      </div>
    </div>
  );
}
