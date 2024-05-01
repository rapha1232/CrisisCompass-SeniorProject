import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useChat } from "@/hooks/useChat";
import { useQuery } from "convex/react";
import Message from "./Message";

type Props = {};

const Body = (props: Props) => {
  const chatId = useChat();
  const msgs = useQuery(api.messages.get, {
    id: chatId as Id<"chats">,
  });
  return (
    <div className="flex-1 w-full flex overflow-y-scroll flex-col-reverse gap-2 p-3 no-scrollbar">
      {msgs?.map(
        (
          {
            content,
            senderImage,
            senderName,
            isCurrentUser,
            _creationTime,
            type,
          },
          index
        ) => {
          const lastByUser = msgs[index - 1]?.senderId === msgs[index].senderId;
          return (
            <Message
              content={content}
              createdAt={_creationTime}
              fromCurrentUser={isCurrentUser}
              lastByUser={lastByUser}
              senderImage={senderImage || ""}
              senderName={senderName}
              type={type}
              key={index}
            />
          );
        }
      )}
    </div>
  );
};

export default Body;
