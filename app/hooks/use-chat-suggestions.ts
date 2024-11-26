import { useCallback } from "react";
import { ChatService } from "~/services/chat-service";
import type { Message } from "~/schemas/chat";

interface UseChatSuggestionsProps {
  messages: Message[];
  onSuggestionsLoading: (loading: boolean) => void;
  onSuggestionsUpdate: (suggestions: string[]) => void;
}

export function useChatSuggestions({
  messages,
  onSuggestionsLoading,
  onSuggestionsUpdate,
}: UseChatSuggestionsProps) {
  const fetchSuggestions = useCallback(async () => {
    if (!messages.length) return;

    onSuggestionsLoading(true);
    try {
      const suggestions = await ChatService.fetchSuggestions(messages);
      onSuggestionsUpdate(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      onSuggestionsUpdate([]);
    } finally {
      onSuggestionsLoading(false);
    }
  }, [messages, onSuggestionsLoading, onSuggestionsUpdate]);

  return { fetchSuggestions };
}
