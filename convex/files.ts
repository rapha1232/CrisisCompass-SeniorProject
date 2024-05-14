import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { fileTypes } from "./schema";
import { getCurrentUser } from "./users";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// export async function hasAccessToOrg(
//   ctx: QueryCtx | MutationCtx,
//   orgId: string
// ) {
//   const identity = await ctx.auth.getUserIdentity();

//   if (!identity) {
//     return null;
//   }

//   const user = await ctx.db
//     .query("users")
//     .withIndex("by_token", (q) =>
//       q.eq("tokenIdentifier", identity.tokenIdentifier)
//     )
//     .first();

//   if (!user) {
//     return null;
//   }

//   const hasAccess =
//     user.orgIds.some((item) => item.orgId === orgId) ||
//     user.tokenIdentifier.includes(orgId);

//   if (!hasAccess) {
//     return null;
//   }

//   return { user };
// }

export const createFile = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.string(),
    type: fileTypes,
  },
  async handler(ctx, args) {
    const currUser = await getCurrentUser(ctx, args);
    if (!currUser) {
      throw new ConvexError("no user found");
    }

    // const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    // if (!hasAccess) {
    //   throw new ConvexError("you do not have access to this org");
    // }

    const fileId = await ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId,
      fileId: args.fileId,
      type: args.type,
      userId: currUser._id,
    });

    return fileId;
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    favorites: v.optional(v.boolean()),
    deletedOnly: v.optional(v.boolean()),
    type: v.optional(fileTypes),
  },
  async handler(ctx, args) {
    // const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    // if (!hasAccess) {
    //   return [];
    // }

    let files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();

    const query = args.query;

    if (query) {
      files = files.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (args.deletedOnly) {
      files = files.filter((file) => file.shouldDelete);
    } else {
      files = files.filter((file) => !file.shouldDelete);
    }

    if (args.type) {
      files = files.filter((file) => file.type === args.type);
    }

    const filesWithUrl = await Promise.all(
      files.map(async (file) => ({
        ...file,
        url: await ctx.storage.getUrl(file.fileId),
      }))
    );

    return filesWithUrl;
  },
});

export const deleteAllFiles = internalMutation({
  args: {},
  async handler(ctx) {
    const files = await ctx.db
      .query("files")
      .withIndex("by_shouldDelete", (q) => q.eq("shouldDelete", true))
      .collect();

    await Promise.all(
      files.map(async (file) => {
        await ctx.storage.delete(file.fileId);
        return await ctx.db.delete(file._id);
      })
    );
  },
});
