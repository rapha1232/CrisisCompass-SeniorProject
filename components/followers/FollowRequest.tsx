import { Doc, Id } from "@/convex/_generated/dataModel";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useMutationState } from "@/hooks/useMutationState";
import { ConvexError } from "convex/values";
import { Check, User, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface FollowRequestProps {
  otherUser: Doc<"users">;
  id: Id<"requests">;
}

export const FollowRequest = ({ otherUser, id }: FollowRequestProps) => {
  const { mutate: denyMutate, pending: denyPending } = useMutationState(
    api.request.deny
  );
  const { mutate: acceptMutate, pending: acceptPending } = useMutationState(
    api.request.accept
  );
  return (
    <Card className="text-dark100_light900 flex w-full flex-row items-center justify-between gap-2 border-none p-2">
      <div className="flex items-center gap-4 truncate">
        <Avatar>
          <AvatarImage src={otherUser.imageURL} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="truncate">
            {otherUser.username ?? otherUser.fullname}
          </h4>
          <p className="truncate text-xs">{otherUser.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          className="bg-green-500"
          onClick={() =>
            acceptMutate({ id })
              .then(() => toast.success("Request accepted."))
              .catch((err) =>
                toast.error(
                  err instanceof ConvexError
                    ? err.data
                    : "Unexpected Error Occured."
                )
              )
          }
          disabled={denyPending || acceptPending}
        >
          <Check />
        </Button>
        <Button
          size="icon"
          className="bg-red-500"
          onClick={() =>
            denyMutate({ id })
              .then(() => toast.success("Request denied."))
              .catch((err) =>
                toast.error(
                  err instanceof ConvexError
                    ? err.data
                    : "Unexpected Error Occured."
                )
              )
          }
          disabled={denyPending || acceptPending}
        >
          <X className="size-4" />
        </Button>
      </div>
    </Card>
  );
};
