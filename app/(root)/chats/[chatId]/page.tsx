"use client";

import { Loading } from "@/components/Global/loading";
import Body from "@/components/chats/Body";
import ChatContainer from "@/components/chats/ChatContainer";
import ChatInput from "@/components/chats/ChatInput";
import Header from "@/components/chats/Header";
import DeleteGroupDialog from "@/components/dialogs/DeleteGroupDialog";
import LeaveGroupDialog from "@/components/dialogs/LeaveGroupDialog";
import RemoveFollowerDialog from "@/components/dialogs/RemoveFollowerDialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useState } from "react";

interface ChatProps {
  params: {
    chatId: Id<"chats">;
  };
}

const ChatPage = ({ params: { chatId } }: ChatProps) => {
  const chat = useQuery(api.chat.get, { id: chatId });
  const [removeFollowerDialogOpen, setRemoveFollowerDialogOpen] =
    useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false);
  // const [addToGroupDialogOpen, setAddToGroupDialogOpen] = useState(false);
  // const [callType, setCallType] = useState<"audio" | "video" | null>(null);
  return chat === undefined ? (
    <Loading />
  ) : chat === null ? (
    <div>Chat not found</div>
  ) : (
    <ChatContainer>
      <RemoveFollowerDialog
        open={removeFollowerDialogOpen}
        setOpen={setRemoveFollowerDialogOpen}
        chatId={chatId}
      />
      <DeleteGroupDialog
        open={deleteGroupDialogOpen}
        setOpen={setDeleteGroupDialogOpen}
        chatId={chatId}
      />
      <LeaveGroupDialog
        open={leaveGroupDialogOpen}
        setOpen={setLeaveGroupDialogOpen}
        chatId={chatId}
      />
      <Header
        chatId={chatId}
        name={
          (chat.isGroup
            ? chat.name
            : chat.otherMember?.username ?? chat.otherMember?.fullname) || ""
        }
        imageUrl={chat.otherMember?.imageURL || ""}
        options={
          chat.isGroup
            ? [
                // {
                //   label: "Add to Group",
                //   destructive: false,
                //   onClick() {
                //     setAddToGroupDialogOpen(true);
                //   },
                // },
                {
                  label: "Leave Group",
                  destructive: false,
                  onClick() {
                    setLeaveGroupDialogOpen(true);
                  },
                },
                {
                  label: "Delete Group",
                  destructive: true,
                  onClick() {
                    setDeleteGroupDialogOpen(true);
                  },
                },
              ]
            : [
                {
                  label: "Remove Follower",
                  destructive: true,
                  onClick() {
                    setRemoveFollowerDialogOpen(true);
                  },
                },
              ]
        }
      />
      <Body
        members={
          chat.isGroup
            ? chat.otherMembers
              ? chat.otherMembers
              : []
            : chat.otherMember
              ? [chat.otherMember]
              : []
        }
      />
      <ChatInput />
    </ChatContainer>
  );
};

export default ChatPage;
