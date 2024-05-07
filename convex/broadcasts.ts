import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Called (GET_BROADCASTS) without authenticated user"
      );
    }
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const broadcasts = await ctx.db.query("broadcast").order("desc").collect();
    return broadcasts;
  },
});

// const sendEmails = action({
//   args: {
//     currentUser: v.any(),
//     description: v.string(),
//     usersToSend: v.array(v.any()),
//   },
//   handler: async (ctx, args) => {
//     await Promise.all(
//       args.usersToSend.map(async (user) => {
//         if (
//           process.env.NEXT_PUBLIC_MAIL_SERVICE_KEY === undefined ||
//           process.env.NEXT_PUBLIC_MAIL_TEMPLATE_KEY === undefined ||
//           process.env.NEXT_PUBLIC_MAIL_PUBLIC_KEY === undefined
//         )
//           throw new ConvexError("Email service not configured");
//         await emailjs
//           .send(
//             process.env.NEXT_PUBLIC_MAIL_SERVICE_KEY,
//             process.env.NEXT_PUBLIC_MAIL_TEMPLATE_KEY,
//             {
//               from_name: args.currentUser.fullname,
//               message: args.description,
//               reply_to: args.currentUser.email,
//               to_name: user.fullname,
//               to_email: user.email,
//             },
//             process.env.NEXT_PUBLIC_MAIL_PUBLIC_KEY
//           )
//           .then(() => console.log("Email sent"))
//           .catch((err) => {
//             console.log(err);
//             throw new ConvexError("Failed to send email");
//           });
//       })
//     );
//   },
// });

export const create = mutation({
  args: {
    location: v.array(v.number()),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Called (CREATE_BROADCAST) without authenticated user"
      );
    }
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const broadcast = await ctx.db.insert("broadcast", {
      title: args.title,
      description: args.description,
      location: args.location,
      senderId: currentUser._id,
      status: "Active",
    });

    return broadcast;
  },
});

export const deleteBroadcast = mutation({
  args: {
    id: v.id("broadcast"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Called (DELETE_BROADCAST) without authenticated user"
      );
    }
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    await ctx.db.delete(args.id);
  },
});

export const updateBroadcast = mutation({
  args: {
    id: v.id("broadcast"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Called (UPDATE_BROADCAST) without authenticated user"
      );
    }
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(args.id, {
      status: "Resolved",
    });
  },
});

export const getBroadcast = query({
  args: {
    id: v.id("broadcast"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Called (GET_BROADCAST) without authenticated user"
      );
    }
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      throw new ConvexError("User not found");
    }
    const broadcast = await ctx.db.get(args.id);
    return broadcast;
  },
});

export const getOngoingEmergencies = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Called (GET_ONGOING_EMERGENCIES) without authenticated user"
      );
    }
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const broadcasts = await ctx.db
      .query("broadcast")
      .withIndex("by_status")
      .filter((q) => q.eq(q.field("status"), "Active"))
      .order("desc")
      .collect();

    return broadcasts;
  },
});
