import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import { User } from "lucide-react";
import Link from "next/link";

type Props = {
  id: Id<"chats">;
  imageUrl: string;
  name: string;
  additionalClasses?: string;
  lastMessageSender?: string;
  lastMessageContent?: string;
  unseenMessagesCount: number;
};

const DMChatItem = ({
  id,
  imageUrl,
  name,
  additionalClasses,
  lastMessageContent,
  lastMessageSender,
  unseenMessagesCount,
}: Props) => {
  return (
    <Link
      href={`/chats/${id}`}
      className={`w-full hover:bg-accent-purple ${additionalClasses}`}
    >
      <Card className="text-dark100_light900 flex flex-row items-center justify-between gap-4 truncate border-none p-2">
        <div className="flex flex-row items-center gap-4 truncate">
          <Avatar className="size-12">
            <AvatarImage src={imageUrl} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <h4 className="truncate">{name}</h4>
            {lastMessageSender && lastMessageContent ? (
              <span className="flex truncate text-sm">
                <span className="font-semibold">
                  {lastMessageSender}
                  {":"}&nbsp;
                  <p className="truncate">{lastMessageContent}</p>
                </span>
              </span>
            ) : (
              <p className="truncate text-sm">Start your conversation</p>
            )}
          </div>
        </div>
        <div className="m-0 p-0">
          {unseenMessagesCount > 0 && (
            <Badge className="bg-primary-500 text-light-900">
              {unseenMessagesCount}
            </Badge>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default DMChatItem;
