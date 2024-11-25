import { z } from "zod";

export const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

export const chatMessagesSchema = z.array(messageSchema);

export const chatRequestSchema = z.object({
  messages: chatMessagesSchema,
});

export const chatResponseSchema = z.object({
  content: z.string(),
});

export type Message = z.infer<typeof messageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatResponse = z.infer<typeof chatResponseSchema>;
