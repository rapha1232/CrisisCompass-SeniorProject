import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }

    const follow1 = await ctx.db
      .query("follows")
      .withIndex("by_user1", (q) => q.eq("user1", currentUser._id))
      .collect();
    const follow2 = await ctx.db
      .query("follows")
      .withIndex("by_user2", (q) => q.eq("user2", currentUser._id))
      .collect();
    const follow = [...follow1, ...follow2];
    const followers = await Promise.all(
      follow.map(async (f) => {
        const follower = await ctx.db.get(
          f.user1 === currentUser._id ? f.user2 : f.user1
        );
        if (!follower) {
          throw new ConvexError("Follower not found");
        }
        return follower;
      })
    );
    return followers;
  },
});

export const createGroup = mutation({
  args: { members: v.array(v.id("users")), name: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }

    const chatId = await ctx.db.insert("chats", {
      isGroup: true,
      name: args.name,
    });
    await Promise.all(
      [...args.members, currentUser._id].map(async (memberId) => {
        await ctx.db.insert("chatMembers", {
          memberId,
          chatId,
        });
      })
    );
  },
});
