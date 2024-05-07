import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";

export const getUserSkills = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const userId = args.userId;
    if (!userId) {
      throw new ConvexError("No user id provided");
    }
    const skills = await ctx.db
      .query("skills")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    if (!skills) return [];
    return skills;
  },
});
