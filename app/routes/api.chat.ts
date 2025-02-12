import { PEDAGOGY_PROMPT } from "~/config/prompts";
import type { ActionFunction } from "@remix-run/node";
import { ServerError } from "~/lib/responses";
import { ModelId } from "~/lib/constants";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Message } from "~/schemas/chat";
import { Id } from "convex/_generated/dataModel";
import { ensureHttpMethodAllowed, ensureSessionExists } from "~/lib/middleware";
import { streamChatCompletion } from "~/services/chat.server";
import useStreamingResponse from "~/hooks/useStreamingResponse";

export type ChatRequestBody = {
  messages: Message[];
  newMessage: string;
  chatId: Id<"conversations">;
  model: ModelId;
};

export const action: ActionFunction = async (args) => {
  const { request } = args;

  ensureHttpMethodAllowed(request, ["POST"]);
  await ensureSessionExists(args);

  const { messages, newMessage, chatId, model } = (await request.json()) as ChatRequestBody;

  console.log("API request: ", messages, newMessage, chatId, model);

  try {
    const langChainMessages = [
      new SystemMessage(PEDAGOGY_PROMPT),
      ...messages.map((message) =>
        message.role === "assistant" ? new AIMessage(message.content) : new HumanMessage(message)
      ),
      new HumanMessage(newMessage),
    ];

    const eventStream = await streamChatCompletion(langChainMessages, model);

    return new Response(eventStream, {
      headers: {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no", // Disable buffering for nginx which is required for SSE to work properly
      },
    });
  } catch (error) {
    console.error("Error in chat completion:", error);
    throw ServerError("Failed to get chat completion");
  }
};
