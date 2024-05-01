import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const create = mutation({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Called (GET_CHAT) without authenticated user");
    }
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      throw new ConvexError("User not found");
    }
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new ConvexError("Chat not found");
    }
    const memberships = await ctx.db
      .query("chatMembers")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .collect();

    if (!memberships || memberships.length !== 2) {
      throw new ConvexError("No members is this chat");
    }

    const follower = await ctx.db
      .query("follows")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .unique();

    if (!follower) {
      throw new ConvexError("Friend could not be found");
    }

    const msgs = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .collect();

    await ctx.db.delete(args.chatId);
    await ctx.db.delete(follower._id);
    await Promise.all(
      memberships?.map(async (membership) => {
        await ctx.db.delete(membership._id);
      })
    );
    await Promise.all(
      msgs?.map(async (msg) => {
        await ctx.db.delete(msg._id);
      })
    );
  },
});

export const remove = mutation({
  args: {},
  handler: async (ctx, args) => {},
});
