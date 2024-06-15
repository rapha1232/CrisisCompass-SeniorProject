import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { InfoIcon, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

type Props = {
  chatId: Id<"chats">;
};

const ViewGroupMembers = (props: Props) => {
  const members = useQuery(api.chat.getGroupMembers, { id: props.chatId });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <InfoIcon size={24} />
      </DialogTrigger>
      <DialogContent className="text-dark100_light900 background-light700_dark300 border-none outline-none">
        <h1>Group Members</h1>
        {members ? (
          members.map(
            (member) =>
              member && (
                <Card
                  key={member._id}
                  className="text-dark100_light900 flex w-full flex-row items-center justify-between gap-2 border-none p-2"
                >
                  <div className="flex items-center gap-4 truncate">
                    <Avatar>
                      <AvatarImage src={member.imageURL} />
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate">
                      <h4 className="truncate">
                        {member.username ?? member.fullname}
                      </h4>
                      <p className="truncate text-xs">{member.email}</p>
                    </div>
                  </div>
                </Card>
              )
          )
        ) : (
          <p>No members</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewGroupMembers;
