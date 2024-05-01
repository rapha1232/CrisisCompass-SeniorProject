import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.string(),
    fullname: v.string(),
    phoneNumber: v.optional(v.string()),
    location: v.optional(v.string()),
    imageURL: v.optional(v.string()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),

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
});
