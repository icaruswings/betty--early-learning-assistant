import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get all conversations for a user
export const listConversations = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();

    return conversations;
  },
});

// Get a single conversation by ID
export const getConversation = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    return conversation;
  },
});

// Get messages for a conversation
export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("conversationId"), args.conversationId))
      .order("asc")
      .collect();

    return messages;
  },
});

// Get recent conversations with their first message
export const getRecentConversations = query({
  args: {
    userId: v.string(),
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.null(), v.string()),
      id: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const { numItems, cursor } = args.paginationOpts;

    const conversations = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .paginate({ numItems, cursor });

    // Get the first message for each conversation
    const conversationsWithFirstMessage = await Promise.all(
      conversations.page.map(async (conversation) => {
        const firstMessage = await ctx.db
          .query("messages")
          .filter((q) => q.eq(q.field("conversationId"), conversation._id))
          .order("asc")
          .first();

        return {
          ...conversation,
          latestMessage: firstMessage,
        };
      })
    );

    return { ...conversations, page: conversationsWithFirstMessage };
  },
});

// Rename a conversation
export const renameConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const { conversationId, title } = args;
    await ctx.db.patch(conversationId, { title });
  },
});

// Delete a conversation and its messages
export const deleteConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const { conversationId } = args;
    
    // Delete all messages in the conversation
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("conversationId"), conversationId))
      .collect();
    
    await Promise.all(messages.map((msg) => ctx.db.delete(msg._id)));
    
    // Delete the conversation
    await ctx.db.delete(conversationId);
  },
});