import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
};

const DMChatItem = ({
  id,
  imageUrl,
  name,
  additionalClasses,
  lastMessageContent,
  lastMessageSender,
}: Props) => {
  return (
    <Link
      href={`/chats/${id}`}
      className={`w-full hover:bg-accent-purple ${additionalClasses}`}
    >
      <Card className="p-2 flex flex-row items-center gap-4 truncate border-none">
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
              <span className="text-sm text-muted-foreground flex truncate overflow-ellipsis">
                <p className="font-semibold">
                  {lastMessageSender}
                  {":"}&nbsp;
                  <p className="truncate overflow-ellipsis">
                    {lastMessageContent}
                  </p>
                </p>
              </span>
            ) : (
              <p className="text-sm text-muted-foreground truncate">
                Start your conversation
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default DMChatItem;
