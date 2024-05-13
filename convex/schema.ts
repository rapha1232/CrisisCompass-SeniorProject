import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.string(),
    fullname: v.string(),
    username: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    location: v.optional(v.array(v.number())),
    imageURL: v.optional(v.string()),
    approveNotification: v.optional(v.boolean()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"])
    .index("by_notification", ["approveNotification"]),

  skills: defineTable({
    userId: v.id("users"),
    skill: v.union(
      v.literal("Medical"),
      v.literal("Food and Water"),
      v.literal("Shelter"),
      v.literal("Transportation"),
      v.literal("Clothing"),
      v.literal("Other")
    ),
  })
    .index("by_userId", ["userId"])
    .index("by_skill", ["skill"]),

  chats: defineTable({
    name: v.optional(v.string()),
    isGroup: v.boolean(),
    lastMessageId: v.optional(v.id("messages")),
  }),

  chatMembers: defineTable({
    memberId: v.id("users"),
    chatId: v.id("chats"),
    lastSeenMessage: v.optional(v.id("messages")),
  })
    .index("by_memberId", ["memberId"])
    .index("by_chatId", ["chatId"])
    .index("by_memberId_chatId", ["memberId", "chatId"]),

  messages: defineTable({
    senderId: v.id("users"),
    chatId: v.id("chats"),
    type: v.string(),
    content: v.array(v.string()),
  }).index("by_chatId", ["chatId"]),

  requests: defineTable({
    sender: v.id("users"),
    reciever: v.id("users"),
  })
    .index("by_reciever", ["reciever"])
    .index("by_reciever_sender", ["reciever", "sender"]),

  follows: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    chatId: v.id("chats"),
  })
    .index("by_user1", ["user1"])
    .index("by_user2", ["user2"])
    .index("by_chatId", ["chatId"]),

  broadcast: defineTable({
    senderId: v.id("users"),
    title: v.string(),
    description: v.string(),
    location: v.array(v.number()),
    status: v.union(v.literal("Active"), v.literal("Resolved")),
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
  })
    .index("by_sender", ["senderId"])
    .index("by_status", ["status"]),
  organization: defineTable({
    adminId: v.id("users"),
    name: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
    imageUrl: v.string(),
    description: v.string(),
    location: v.array(v.number()),
  }).index("by_adminId", ["adminId"]),
  organizationMembers: defineTable({
    memberId: v.id("users"),
    organizationId: v.id("organization"),
  })
    .index("by_memberId", ["memberId"])
    .index("by_organizationId", ["organizationId"])
    .index("by_memberId_organizationId", ["memberId", "organizationId"]),
});
