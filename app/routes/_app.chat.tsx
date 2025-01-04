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
import { PageHeader } from "~/components/layout/page-header";
import { MessageSquare } from "lucide-react";
import { cn } from "~/lib/utils";
import { usePageHeader } from "~/hooks/use-page-header";
import { Message } from "~/schemas/chat";

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
    <div className="flex flex-col">
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

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    console.log({ scrollTop, scrollHeight, clientHeight });
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

  const { setTitle, setIcon } = usePageHeader();

  useEffect(() => {
    setTitle("Chat");
    setIcon(MessageSquare);
  }, [setTitle, setIcon]);

  return (
    <div className="relative flex h-full w-full flex-col">
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto">
        <div className="relative flex h-full flex-col">
          <div className="sticky top-0 mb-4">
            <PageHeader />
          </div>

          <div className="m-auto w-full max-w-3xl flex-1 px-4 pb-2">
            {isEmpty && <EmptyStateContent onSelect={sendMessage} />}

            {!isEmpty && (
              <ConversationContent
                messages={messages}
                isLoading={isLoading}
                scrollAreaRef={scrollAreaRef}
                isAtBottom={isAtBottom}
              />
            )}
          </div>
        </div>
      </div>

      <div className="m-auto w-full max-w-3xl px-4 md:px-0">
        <ChatInput isLoading={isLoading} onSubmit={handleSubmit} placeholder="Ask Betty ..." />
      </div>
    </div>

    // <div className="relative h-full overflow-y-auto">
    //   <div className="h-[3000px] bg-purple-400">&nbsp;</div>

    //   {isEmpty && <EmptyStateContent onSelect={sendMessage} />}

    //     {!isEmpty && (
    //       <ConversationContent
    //         messages={messages}
    //         isLoading={isLoading}
    //         scrollAreaRef={scrollAreaRef}
    //         isAtBottom={isAtBottom}
    //       />
    //     )}

    //   <div className="sticky bottom-0 mt-4">
    //     <ChatInput isLoading={isLoading} onSubmit={handleSubmit} placeholder="Ask Betty ..." />
    //   </div>
    // </div>

    // <div className="flex h-full flex-col overflow-hidden bg-red-400">
    //   <div className="flex flex-1 flex-col bg-green-300">
    //     <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col bg-yellow-400">
    //       {isEmpty ? (
    //         <div className="flex flex-1 flex-col justify-center gap-6">
    //           <EmptyState />
    //           <ConversationStarters onSelect={sendMessage} />
    //           <div className="pt-4">
    //             <ChatInput
    //               isLoading={isLoading}
    //               onSubmit={handleSubmit}
    //               placeholder="Ask Betty ..."
    //             />
    //           </div>
    //         </div>
    //       ) : (
    //         <div ref={scrollAreaRef} onScroll={handleScroll} className="flex h-full flex-col">
    //           <div className="flex-1 overflow-y-auto">
    //             <MessageList messages={messages} />
    //             <ChatScrollAnchor
    //               trackVisibility={isLoading}
    //               isAtBottom={isAtBottom}
    //               scrollAreaRef={scrollAreaRef}
    //             />
    //           </div>

    //           <div className="pt-4">
    //             <ChatInput
    //               isLoading={isLoading}
    //               onSubmit={handleSubmit}
    //               placeholder="Ask Betty ..."
    //             />
    //           </div>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
}
