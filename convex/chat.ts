import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const get = query({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }

    const chat = await ctx.db.get(args.id);
    if (!chat) {
      throw new ConvexError("Chat not found");
    }

    const membership = await ctx.db
      .query("chatMembers")
      .withIndex("by_memberId_chatId", (q) =>
        q.eq("memberId", currentUser._id).eq("chatId", chat._id)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("You are not a member of this chat");
    }

    const allChatMemberships = await ctx.db
      .query("chatMembers")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.id))
      .collect();
    if (!chat.isGroup) {
      const otherMembership = allChatMemberships.filter(
        (member) => member.memberId !== currentUser._id
      )[0];
      const otherMemberDetails = await ctx.db.get(otherMembership.memberId);
      return {
        ...chat,
        otherMember: {
          ...otherMemberDetails,
          lastSeenMessageId: otherMembership.lastSeenMessage,
        },
        otherMembers: null,
      };
    } else {
      const otherMembers = await Promise.all(
        allChatMemberships
          .filter((member) => member.memberId !== currentUser._id)
          .map(async (membership) => {
            const member = await ctx.db.get(membership.memberId);
            if (!member) {
              throw new ConvexError("Member not found");
            }
            return {
              _id: membership._id,
              fullname: member.fullname,
              username: member.username,
            };
          })
      );
      return {
        ...chat,
        otherMembers,
        otherMember: null,
      };
    }
  },
});

export const deleteGroup = mutation({
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

    if (!memberships || memberships.length <= 1) {
      throw new ConvexError("This chat doesnt have any members");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .collect();

    await ctx.db.delete(args.chatId);

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

export const leaveGroup = mutation({
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

    const membership = await ctx.db
      .query("chatMembers")
      .withIndex("by_memberId_chatId", (q) =>
        q.eq("memberId", currentUser._id).eq("chatId", args.chatId)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("You are not a member of this chat");
    }

    await ctx.db.delete(args.chatId);
  },
});

export const markRead = mutation({
  args: {
    chatId: v.id("chats"),
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }

    const membership = await ctx.db
      .query("chatMembers")
      .withIndex("by_memberId_chatId", (q) =>
        q.eq("memberId", currentUser._id).eq("chatId", args.chatId)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("You are not a member of this chat");
    }

    const lastMessage = await ctx.db.get(args.messageId);
    await ctx.db.patch(membership._id, {
      lastSeenMessage: lastMessage ? lastMessage._id : undefined,
    });
  },
});
