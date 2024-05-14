import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return;
    }

    // check if user is already stored
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (
      user &&
      !user.phoneNumber &&
      identity.phoneNumber &&
      identity.phoneNumberVerified
    ) {
      await ctx.db.patch(user._id, {
        phoneNumber: identity.phoneNumber,
      });
      return user._id;
    }

    if (user && user.username === undefined && identity.nickname) {
      await ctx.db.patch(user._id, {
        username: identity.nickname,
      });
      return user._id;
    }

    if (user !== null) {
      return user._id;
    }

    const userId = await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email!,
      fullname: identity.name!,
      imageURL: identity.pictureUrl,
      username: identity.nickname,
    });

    return userId;
  },
});

// export const get = query({
//   args: { userId: v.id("users") },
//   handler: async (ctx, { userId }) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       throw new Error("Called currentUser without authenticated user");
//     }

//     return await ctx.db.get(userId);
//   },
// });

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    location: v.array(v.number()),
    preferredRadius: v.optional(v.number()),
    approveNotification: v.boolean(),
    skills: v.array(
      v.union(
        v.literal("Medical"),
        v.literal("Food and Water"),
        v.literal("Shelter"),
        v.literal("Transportation"),
        v.literal("Clothing"),
        v.literal("Other")
      )
    ),
  },
  handler: async (
    ctx,
    { userId, approveNotification, location, skills, preferredRadius }
  ) => {
    const currentUser = await getCurrentUser(ctx, userId);
    if (!currentUser) {
      return null;
    }

    Promise.all(
      skills.map(async (skill) => {
        await ctx.db.insert("skills", {
          userId,
          skill,
        });
      })
    );

    await ctx.db.patch(userId, {
      location,
      preferredRadius,
      approveNotification,
    });
  },
});

export const getUsersWithNotif = query({
  args: {},
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }
    const users = await ctx.db
      .query("users")
      .withIndex("by_notification", (q) => q.eq("approveNotification", true))
      .collect();
    return users;
  },
});

export const getUsersWithNotifAndSkills = query({
  args: {},
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }
    const users = await ctx.db
      .query("users")
      .withIndex("by_notification", (q) => q.eq("approveNotification", true))
      .collect();
    const usersWithSkills = await Promise.all(
      users.map(async (user) => {
        const skills = await ctx.db
          .query("skills")
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
          .collect();
        return { ...user, skills };
      })
    );
    return usersWithSkills;
  },
});

export const getOrgsFollowedByUser = query({
  args: {},
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }
    const orgs = await ctx.db
      .query("followOrg")
      .withIndex("by_userId", (q) => q.eq("userId", currentUser._id))
      .collect();

    const orgsModified = await Promise.all(
      orgs.map(async (org) => {
        const orgData = await ctx.db.get(org.orgId);
        return orgData;
      })
    );

    return orgsModified;
  },
});
