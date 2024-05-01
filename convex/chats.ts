import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";
import { MutationCtx, QueryCtx, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Called (GET_CHATS) without authenticated user");
    }
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      throw new ConvexError("User not found");
    }
    const chatMemberships = await ctx.db
      .query("chatMembers")
      .withIndex("by_memberId", (q) => q.eq("memberId", currentUser._id))
      .collect();

    const chats = await Promise.all(
      chatMemberships?.map(async (membership) => {
        const chat = await ctx.db.get(membership.chatId);
        if (!chat) {
          throw new ConvexError("Chat not found");
        }
        return chat;
      })
    );

    const chatsWithDetails = await Promise.all(
      chats?.map(async (chat, i) => {
        const members = await ctx.db
          .query("chatMembers")
          .withIndex("by_chatId", (q) => q.eq("chatId", chat?._id))
          .collect();

        const lastMessageDetails = await getLastMessageDetails({
          ctx,
          id: chat.lastMessageId,
        });
        if (chat.isGroup) {
          return { chat, lastMessageDetails };
        } else {
          const otherMembership = members.filter(
            (member) => member.memberId !== currentUser._id
          )[0];

          const otherMember = await ctx.db.get(otherMembership.memberId);
          return { chat, otherMember, lastMessageDetails };
        }
      })
    );

    return chatsWithDetails;
  },
});

const getLastMessageDetails = async ({
  ctx,
  id,
}: {
  ctx: QueryCtx | MutationCtx;
  id: Id<"messages"> | undefined;
}) => {
  if (!id) return null;
  const message = await ctx.db.get(id);
  if (!message) {
    return null;
  }
  const sender = await ctx.db.get(message.senderId);
  if (!sender) {
    return null;
  }

  const content = getMessageContent(
    message.type,
    message.content as unknown as string
  );

  return {
    content,
    sender: sender.fullname,
  };
};

const getMessageContent = (type: string, content: string) => {
  switch (type) {
    case "text":
      return content;
    default:
      return "[Non-Text]";
  }
};
