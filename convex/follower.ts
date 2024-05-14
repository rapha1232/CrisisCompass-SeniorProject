import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const create = mutation({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
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
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
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
      throw new ConvexError("This chat doesnt have any members");
    }
    const follower = await ctx.db
      .query("follows")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .unique();

    if (!follower) {
      throw new ConvexError("No follower found");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .collect();

    await ctx.db.delete(args.chatId);
    await ctx.db.delete(follower._id);

    await Promise.all(
      memberships.map(async (membership) => {
        await ctx.db.delete(membership._id);
      })
    );

    await Promise.all(
      messages.map(async (message) => {
        await ctx.db.delete(message._id);
      })
    );
  },
});

export const createForOrg = mutation({
  args: {
    orgId: v.id("organization"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }

    const org = await ctx.db.get(args.orgId);
    if (!org) {
      return null;
    }

    const follow = await ctx.db.insert("followOrg", {
      userId: currentUser._id,
      orgId: org._id,
    });
    return follow;
  },
});

export const deleteForOrg = mutation({
  args: {
    orgId: v.id("organization"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }

    const org = await ctx.db.get(args.orgId);
    if (!org) {
      return null;
    }

    const follow = await ctx.db
      .query("followOrg")
      .withIndex("by_userId_orgId", (q) =>
        q.eq("userId", currentUser._id).eq("orgId", org._id)
      )
      .unique();

    if (!follow) {
      return null;
    }

    const unfollow = await ctx.db.delete(follow._id);
    return unfollow;
  },
});
