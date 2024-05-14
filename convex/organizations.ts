import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

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
