import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  conversations: defineTable({
    userId: v.string(),
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    summary: v.optional(v.string()),
  }),

  messages: defineTable({
    conversationId: v.id("conversations"),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    createdAt: v.number(),
    metadata: v.optional(
      v.object({
        tokens: v.optional(v.number()),
        processingTime: v.optional(v.number()),
      })
    ),
  }).index("by_conversation", ["conversationId"]),
});
