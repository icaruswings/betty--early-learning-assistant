/**
 * A custom hook that manages chat suggestions based on the current message history.
 * It handles fetching and updating suggestions for the chat interface.
 * 
 * @param {Object} props - The hook's configuration object
 * @param {Message[]} props.messages - Array of current chat messages
 * @param {Function} props.onSuggestionsLoading - Callback fired when suggestions are being loaded
 * @param {Function} props.onSuggestionsUpdate - Callback fired when new suggestions are available
 * @returns {Function} A function to trigger fetching new suggestions
 */

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
