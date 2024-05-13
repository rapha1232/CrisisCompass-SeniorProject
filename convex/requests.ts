import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }
    const requests = await ctx.db
      .query("requests")
      .withIndex("by_reciever", (q) => q.eq("reciever", currentUser._id))
      .collect();
    const requestsWithSender = requests
      ? await Promise.all(
          requests.map(async (request) => {
            const sender = await ctx.db.get(request.sender);
            if (!sender) {
              throw new ConvexError("Sender not found");
            }
            return { sender, request };
          })
        )
      : [];
    return requestsWithSender;
  },
});

export const count = query({
  args: {},
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }
    const count = await ctx.db
      .query("requests")
      .withIndex("by_reciever", (q) => q.eq("reciever", currentUser._id))
      .collect();

    return count.length;
  },
});
