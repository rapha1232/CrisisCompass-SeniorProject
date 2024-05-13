import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
type Props = {
  fromCurrentUser: boolean;
  senderImage: string;
  senderName: string;
  lastByUser: boolean;
  content: string[];
  createdAt: number;
  type: string;
  seen?: ReactNode;
};

const Message = ({
  fromCurrentUser,
  senderImage,
  senderName,
  lastByUser,
  content,
  createdAt,
  type,
  seen,
}: Props) => {
  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp), "HH:mm");
  };
  return (
    <div
      className={cn("flex items-end", {
        "justify-end": fromCurrentUser,
      })}
    >
      <div
        className={cn("flex flex-col w-full mx-2", {
          "order-1 items-end": fromCurrentUser,
          "order-2 items-start": !fromCurrentUser,
        })}
      >
        <div
          className={cn("px-4 py-2 rounded-lg max-w-[70%]", {
            "bg-primary-500": fromCurrentUser,
            "bg-accent-purple": !fromCurrentUser,
            "rounded-br-none": !lastByUser && fromCurrentUser,
            "rounded-bl-none": !lastByUser && !fromCurrentUser,
          })}
        >
          {type === "text" ? (
            <p className="text-dark100_light900 whitespace-pre-wrap text-wrap break-words">
              {content}
            </p>
          ) : type === "videoCall" ? (
            <Link href={`call/${content}`} className="text-dark100_light900">
              Press to join call
            </Link>
          ) : null}
          <p
            className={cn("text-xs flex w-full my-1 text-dark100_light900", {
              "justify-end": fromCurrentUser,
              "justify-start": !fromCurrentUser,
            })}
          >
            {formatTime(createdAt)}
          </p>
        </div>
        {seen}
      </div>
      <Avatar
        className={cn("relative size-8", {
          "order-2": fromCurrentUser,
          "order-1": !fromCurrentUser,
          invisible: lastByUser,
        })}
      >
        <AvatarImage src={senderImage} alt={senderName} />
        <AvatarFallback>
          {senderName.substring(0, 1).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Message;
