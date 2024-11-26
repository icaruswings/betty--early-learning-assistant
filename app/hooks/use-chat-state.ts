import { useReducer, useCallback } from "react";
import type { Message } from "~/schemas/chat";
import type { ModelId } from "~/components/model-selector";

interface ChatState {
  messages: Message[];
  input: string;
  isLoading: boolean;
  error: string | null;
  model: ModelId;
  suggestions: string[];
  loadingSuggestions: boolean;
}

type ChatAction =
  | { type: "SET_INPUT"; payload: string }
  | { type: "SET_MODEL"; payload: ModelId }
  | { type: "START_MESSAGE"; payload: Message }
  | { type: "APPEND_ASSISTANT_MESSAGE"; payload: string }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_SUGGESTIONS"; payload: string[] }
  | { type: "SET_LOADING_SUGGESTIONS"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "REMOVE_LAST_MESSAGE" };

const initialState: ChatState = {
  messages: [
    {
      role: "assistant",
      content:
        "Hi! I'm Betty, your Early Learning Assistant. I'm here to help with observations, documentation, teaching strategies, and professional development. How can I support you today?",
    },
  ],
  input: "",
  isLoading: false,
  error: null,
  model: "gpt-4",
  suggestions: [],
  loadingSuggestions: false,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, input: action.payload };

    case "SET_MODEL":
      return { ...state, model: action.payload };

    case "START_MESSAGE": {
      // Add the user message and prepare for assistant response
      const userMessage = action.payload;
      const assistantMessage: Message = { role: "assistant", content: "" };
      return {
        ...state,
        messages: [...state.messages, userMessage, assistantMessage],
        input: "",
        error: null,
        suggestions: [],
        isLoading: true,
      };
    }

    case "APPEND_ASSISTANT_MESSAGE": {
      // Update only the last message (assistant's message)
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === "assistant") {
        messages[messages.length - 1] = {
          ...lastMessage,
          content: action.payload,
        };
      }
      return { ...state, messages };
    }

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    case "SET_SUGGESTIONS":
      return { ...state, suggestions: action.payload };

    case "SET_LOADING_SUGGESTIONS":
      return { ...state, loadingSuggestions: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "REMOVE_LAST_MESSAGE": {
      // Remove both the assistant's message and the user's message
      const messages = state.messages.slice(0, -2);
      return { ...state, messages, isLoading: false };
    }

    default:
      return state;
  }
}

export function useChatState() {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const setInput = useCallback((input: string) => {
    dispatch({ type: "SET_INPUT", payload: input });
  }, []);

  const setModel = useCallback((model: ModelId) => {
    dispatch({ type: "SET_MODEL", payload: model });
  }, []);

  const startMessage = useCallback((content: string) => {
    const userMessage: Message = { role: "user", content };
    dispatch({ type: "START_MESSAGE", payload: userMessage });
  }, []);

  const appendAssistantMessage = useCallback((content: string) => {
    dispatch({ type: "APPEND_ASSISTANT_MESSAGE", payload: content });
  }, []);

  const setError = useCallback((error: string) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const setSuggestions = useCallback((suggestions: string[]) => {
    dispatch({ type: "SET_SUGGESTIONS", payload: suggestions });
  }, []);

  const setLoadingSuggestions = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING_SUGGESTIONS", payload: loading });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const removeLastMessage = useCallback(() => {
    dispatch({ type: "REMOVE_LAST_MESSAGE" });
  }, []);

  return {
    ...state,
    setInput,
    setModel,
    startMessage,
    appendAssistantMessage,
    setError,
    clearError,
    setSuggestions,
    setLoadingSuggestions,
    setLoading,
    removeLastMessage,
  };
}
