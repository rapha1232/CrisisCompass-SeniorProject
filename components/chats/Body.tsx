import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useChat } from "@/hooks/useChat";
import { useMutationState } from "@/hooks/useMutationState";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Message from "./Message";

type Props = {
  members: {
    lastSeenMessageId?: Id<"messages">;
    fullname?: string;
    [key: string]: any;
  }[];
};
const Body = ({ members }: Props) => {
  const chatId = useChat();
  const msgs = useQuery(api.messages.get, {
    id: chatId as Id<"chats">,
  });
  const { mutate: markAsRead } = useMutationState(api.chat.markRead);

  useEffect(() => {
    if (msgs && msgs.length > 0) {
      markAsRead({
        chatId,
        messageId: msgs[0]._id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgs?.length, chatId, markAsRead]);

  const formatSeenBy = (names: string[]) => {
    switch (names.length) {
      case 1:
        return (
          <p className="text-dark100_light900 text-right text-sm">{`Seen by ${names[0]}`}</p>
        );
      case 2:
        return (
          <p className="text-dark100_light900 text-right text-sm">{`Seen by ${names[0]} & ${names[1]}`}</p>
        );
      default:
        return (
          <Tooltip>
            <TooltipTrigger>
              <p className="text-dark100_light900 text-right text-sm">
                {`Seen by ${names[0]}, ${names[1]} & ${names.length - 2} more `}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <ul>
                {names.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        );
    }
  };

  const getSeenMessage = (messageId: Id<"messages">) => {
    const seenUsers = members
      .filter((member) => member.lastSeenMessageId === messageId)
      .map((user) =>
        user.username ? user.username : user.fullname!.split(" ")[0]
      );
    if (seenUsers.length === 0) return undefined;
    return formatSeenBy(seenUsers);
  };
  return (
    <div className="no-scrollbar flex w-full flex-1 flex-col-reverse gap-2 overflow-y-scroll p-3">
      {msgs?.map((msg, index) => {
        const lastByUser = msgs[index - 1]?.senderId === msgs[index].senderId;
        const seenMessage = msg.isCurrentUser
          ? getSeenMessage(msg._id)
          : undefined;
        return (
          <Message
            content={msg.content}
            createdAt={msg._creationTime}
            fromCurrentUser={msg.isCurrentUser}
            lastByUser={lastByUser}
            senderImage={msg.senderImage || ""}
            senderName={msg.senderName}
            type={msg.type}
            seen={seenMessage}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default Body;
