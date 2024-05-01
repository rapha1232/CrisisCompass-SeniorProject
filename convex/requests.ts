import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Called (GET_REQUESTS) without authenticated user");
    }
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      throw new ConvexError("User not found");
    }
    const requests = await ctx.db
      .query("requests")
      .withIndex("by_reciever", (q) => q.eq("reciever", currentUser._id))
      .collect();
    const requestsWithSender = await Promise.all(
      requests.map(async (request) => {
        const sender = await ctx.db.get(request.sender);
        if (!sender) {
          throw new ConvexError("Sender not found");
        }
        return { sender, request };
      })
    );
    return requestsWithSender;
  },
});

export const count = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      throw new ConvexError("User not found");
    }
    const count = await ctx.db
      .query("requests")
      .withIndex("by_reciever", (q) => q.eq("reciever", currentUser._id))
      .collect();

    return count.length;
  },
});
