"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import DMChatItem from "./DMChatItem";

export const ChatList = () => {
  const pathname = usePathname();
  const chats = useQuery(api.chats.get);
  return (
    <div>
      {chats?.map((chat) => {
        if (chat.chat.isGroup) {
          return null;
        } else {
          return (
            <div key={chat.chat._id} className="flex flex-row text-white">
              <DMChatItem
                id={chat.chat._id}
                imageUrl={chat.otherMember?.imageURL || ""}
                name={chat.otherMember?.fullname || ""}
                additionalClasses={
                  pathname.includes(chat.chat._id)
                    ? "bg-accent-purple hover:bg-transparent"
                    : ""
                }
                lastMessageContent={chat.lastMessageDetails?.content}
                lastMessageSender={chat.lastMessageDetails?.sender}
              />
            </div>
          );
        }
      })}
    </div>
  );
};
