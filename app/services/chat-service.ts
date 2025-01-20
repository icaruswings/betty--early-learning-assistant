import type { Message } from "~/schemas/chat";
import type { ModelId } from "~/lib/constants";
import { ServerError } from "~/lib/responses";

export class ChatService {
  static async sendMessage(
    messages: Message[],
    newMessage: Message,
    model: ModelId
  ): Promise<Response> {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages, newMessage, model }),
    });

    if (!response.ok) {
      throw ServerError("Failed to send message");
    }

    return response;
  }

  static async generateTitle(messages: Message[]): Promise<string> {
    const response = await fetch("/api/generate-title", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw ServerError("Failed to send message");
    }

    return data.title || "New Conversation";
  }

  static async fetchSuggestions(messages: Message[]): Promise<string[]> {
    const response = await fetch("/api/suggestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw ServerError("Failed to fetch suggestions");
    }

    return data.suggestions || [];
  }
}
