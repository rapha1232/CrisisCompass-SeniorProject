"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import DMChatItem from "./DMChatItem";
import GroupChatItem from "./GroupChatItem";

export const ChatList = () => {
  const pathname = usePathname();
  const chats = useQuery(api.chats.get);
  return (
    <div>
      {chats?.map((chat) => {
        return chat.chat.isGroup ? (
          <GroupChatItem
            key={chat.chat._id}
            id={chat.chat._id}
            name={chat.chat.name || ""}
            additionalClasses={
              pathname.includes(chat.chat._id)
                ? "bg-accent-purple hover:bg-transparent"
                : ""
            }
            lastMessageContent={chat.lastMessageDetails?.content}
            lastMessageSender={chat.lastMessageDetails?.sender}
            unseenMessagesCount={chat.unSeenCount}
          />
        ) : (
          <DMChatItem
            key={chat.chat._id}
            id={chat.chat._id}
            imageUrl={chat.otherMember?.imageURL || ""}
            name={
              (chat.otherMember?.username ?? chat.otherMember?.fullname) || ""
            }
            additionalClasses={
              pathname.includes(chat.chat._id)
                ? "bg-accent-purple hover:bg-transparent"
                : ""
            }
            lastMessageContent={chat.lastMessageDetails?.content}
            lastMessageSender={chat.lastMessageDetails?.sender}
            unseenMessagesCount={chat.unSeenCount}
          />
        );
      })}
    </div>
  );
};
