import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// const clerkClient = createClerkClient({
//   secretKey: process.env.CLERK_SECRET_KEY!,
// });

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    location: v.array(v.number()),
    logo: v.id("_storage"),
    email: v.string(),
    phoneNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const currUser = await getCurrentUser(ctx, args);
    if (!currUser) {
      throw new ConvexError("no user found");
    }
    const orgId = await ctx.db.insert("organization", {
      adminId: currUser._id,
      name: args.name,
      phoneNumber: args.phoneNumber,
      description: args.description,
      email: args.email,
      location: args.location,
      imageUrl: args.logo,
    });

    return orgId;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx, {});
    if (!currentUser) {
      return null;
    }
    const orgs = await ctx.db.query("organization").collect();
    const orgsModified = await Promise.all(
      orgs.map(async (org) => {
        const logo = await ctx.storage.getUrl(org.imageUrl);
        return { ...org, logo };
      })
    );

    return orgsModified;
  },
});

export const getOne = query({
  args: { orgName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, {});
    if (!currentUser) {
      return null;
    }
    const org = await ctx.db
      .query("organization")
      .withIndex("by_name", (q) => q.eq("name", args.orgName!))
      .unique();
    if (!org) {
      return null;
    }
    const logo = await ctx.storage.getUrl(org.imageUrl);
    return { ...org, logo };
  },
});

export const getOneById = query({
  args: { orgId: v.id("organization") },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, {});
    if (!currentUser) {
      return null;
    }
    const org = await ctx.db.get(args.orgId);
    if (!org) {
      return null;
    }
    const logo = await ctx.storage.getUrl(org.imageUrl);
    return { ...org, logo };
  },
});

export const deleteOrg = mutation({
  args: { orgId: v.id("organization") },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, {});
    if (!currentUser) {
      throw new ConvexError("no user found");
    }
    const org = await ctx.db.get(args.orgId);
    if (!org) {
      throw new ConvexError("no org found");
    }
    if (org.adminId !== currentUser._id) {
      throw new ConvexError("not authorized");
    }

    const broadcasts = await ctx.db
      .query("broadcast")
      .withIndex("by_sender", (q) => q.eq("senderId", args.orgId))
      .collect();

    await Promise.all(
      broadcasts.map(async (broadcast) => {
        await ctx.db.delete(broadcast._id);
      })
    );

    const followers = await ctx.db
      .query("followOrg")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();
    await Promise.all(
      followers.map(async (follow) => {
        await ctx.db.delete(follow._id);
      })
    );
    return await ctx.db.delete(args.orgId);
  },
});
