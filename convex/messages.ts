import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const get = query({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }

    const membership = await ctx.db
      .query("chatMembers")
      .withIndex("by_memberId_chatId", (q) =>
        q.eq("memberId", currentUser._id).eq("chatId", args.id)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("You are not a member of this chat");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.id))
      .order("desc")
      .collect();

    const messagesWithUsers = await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);
        if (!sender) {
          throw new ConvexError("Sender not found");
        }
        return {
          ...message,
          senderImage: sender.imageURL,
          senderName: sender.fullname,
          isCurrentUser: sender._id === currentUser._id,
        };
      })
    );

    return messagesWithUsers;
  },
});
