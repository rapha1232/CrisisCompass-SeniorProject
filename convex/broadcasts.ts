import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getUserSkills } from "./skills";
import { getCurrentUser } from "./users";

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
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
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }

    const broadcast = await ctx.db.insert("broadcast", {
      title: args.title,
      description: args.description,
      location: args.location,
      senderId: currentUser._id,
      status: "Active",
      skills: args.skills,
    });
    return broadcast;
  },
});

export const deleteBroadcast = mutation({
  args: {
    id: v.id("broadcast"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }

    await ctx.db.delete(args.id);
  },
});

export const updateBroadcast = mutation({
  args: {
    id: v.id("broadcast"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
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
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }
    const broadcast = await ctx.db.get(args.id);
    return broadcast;
  },
});

export const getOngoingEmergencies = query({
  args: {},
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
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

export const getUserNewEmergencies = query({
  args: {},
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx, args);
    if (!currentUser) {
      return null;
    }
    const userSkills = await getUserSkills(ctx, { userId: currentUser._id });
    const userSkillNames = userSkills.map((skill) => skill.skill);
    const emergencies = await getOngoingEmergencies(ctx, args);
    const matchingEmergencies = emergencies
      ? emergencies.filter((emergency) =>
          emergency.skills.some((skill) => userSkillNames.includes(skill))
        )
      : null;

    return matchingEmergencies;
  },
});

export const clearResolvedEmergencies = internalMutation({
  args: {},
  handler: async (ctx, args) => {
    const resolvedEmergencies = await ctx.db
      .query("broadcast")
      .withIndex("by_status")
      .filter((q) => q.eq(q.field("status"), "Resolved"))
      .collect();

    await Promise.all(
      resolvedEmergencies.map(async (emergency) => {
        await ctx.db.delete(emergency._id);
      })
    );
  },
});
