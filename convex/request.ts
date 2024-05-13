import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const create = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }
    if (args.email === currentUser.email) {
      throw new ConvexError("You can't request yourself");
    }
    const reciever = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    if (!reciever) {
      return null;
    }

    const requestAlreadySent = await ctx.db
      .query("requests")
      .withIndex("by_reciever_sender", (q) =>
        q.eq("reciever", reciever._id).eq("sender", currentUser._id)
      )
      .unique();
    if (requestAlreadySent) {
      throw new ConvexError("Request already sent");
    }
    const requestAlreadyRecieved = await ctx.db
      .query("requests")
      .withIndex("by_reciever_sender", (q) =>
        q.eq("reciever", currentUser._id).eq("sender", reciever._id)
      )
      .unique();
    if (requestAlreadyRecieved) {
      throw new ConvexError("This user has already sent you a request");
    }

    const request = await ctx.db.insert("requests", {
      sender: currentUser._id,
      reciever: reciever._id,
    });
    console.log("created");
    return request;
  },
});

export const deny = mutation({
  args: {
    id: v.id("requests"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }
    const request = await ctx.db.get(args.id);
    if (!request || request.reciever !== currentUser._id) {
      throw new ConvexError("Error denying request");
    }

    await ctx.db.delete(request._id);
  },
});

export const accept = mutation({
  args: {
    id: v.id("requests"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }
    const request = await ctx.db.get(args.id);
    if (!request || request.reciever !== currentUser._id) {
      throw new ConvexError("Error accepting request");
    }

    const chatId = await ctx.db.insert("chats", { isGroup: false });
    await ctx.db.insert("follows", {
      user1: currentUser._id,
      user2: request.sender,
      chatId,
    });

    await ctx.db.insert("chatMembers", {
      chatId,
      memberId: currentUser._id,
    });
    await ctx.db.insert("chatMembers", {
      chatId,
      memberId: request.sender,
    });

    await ctx.db.delete(request._id);
  },
});
