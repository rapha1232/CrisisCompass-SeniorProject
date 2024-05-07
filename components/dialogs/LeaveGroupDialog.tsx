import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationState } from "@/hooks/useMutationState";
import { ConvexError } from "convex/values";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type Props = {
  chatId: Id<"chats">;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const LeaveGroupDialog = ({ chatId, open, setOpen }: Props) => {
  const { mutate: leaveGroup, pending } = useMutationState(api.chat.leaveGroup);

  const handleLeaveGroup = async () => {
    leaveGroup({ chatId })
      .then(() => {
        toast.success("Group left");
      })
      .catch((err) => {
        toast.error(
          err instanceof ConvexError ? err.data : "Failed to leave group"
        );
      });
  };
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="background-light700_dark300 text-dark100_light900 border-none">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You will not be able to access this
            group unless re-added by the admin. Individual chats will still work
            as normal.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setOpen(false)}
            disabled={pending}
            className="border-none bg-primary-500"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            onClick={handleLeaveGroup}
            className="bg-red-600"
          >
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LeaveGroupDialog;
