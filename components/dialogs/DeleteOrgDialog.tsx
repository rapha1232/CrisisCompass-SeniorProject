"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationState } from "@/hooks/useMutationState";
import { useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";

type Props = { orgId: Id<"organization"> };

const DeleteOrgDialog = ({ orgId }: Props) => {
  const currUser = useQuery(api.users.getCurrentUser);
  const { mutate: deleteOrg, pending: deletePending } = useMutationState(
    api.organizations.deleteOrg
  );
  const handleDeleteOrg = (orgId: Id<"organization">) => {
    if (!currUser) return;
    deleteOrg({
      orgId,
    })
      .then(() => toast.success("Deleted Successfully"))
      .catch((err) =>
        toast.error(err instanceof ConvexError ? err.data : "An error occured")
      );
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="text-dark100_light900 bg-red-500 hover:bg-red-700"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Delete this Organization
        </Button>
      </DialogTrigger>
      <DialogContent className="text-dark100_light900 background-light700_dark400">
        <DialogHeader>Delete this Organization?</DialogHeader>
        <p>Are you sure you want to delete this organization?</p>
        <DialogClose asChild>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteOrg(orgId);
            }}
            disabled={deletePending}
            className="text-dark100_light900 w-full bg-red-500"
          >
            Delete
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteOrgDialog;
