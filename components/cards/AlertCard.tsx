"use client";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutationState } from "@/hooks/useMutationState";
import { SquareArrowOutUpRight, Trash } from "lucide-react";
import Link from "next/link";
import { cn, getTimestamp } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface AlertProps {
  broadcast: Doc<"broadcast">;
  editable?: boolean;
}

/**
 * Functional component representing a alert card.
 * @param {Doc<"broadcast">} broadcast - Broadcast data.
 * @param {boolean} editable - Indicates if the card is editable.
 * @returns {JSX.Element} - Rendered AlertCard component.
 */

const AlertCard = ({ broadcast, editable = false }: AlertProps) => {
  const { mutate: updateBroadcast, pending: updatePending } = useMutationState(
    api.broadcasts.updateBroadcast
  );
  const { mutate: deleteBroad, pending: deletePending } = useMutationState(
    api.broadcasts.deleteBroadcast
  );
  const handleDeleteBroadcast = () => {
    deleteBroad({
      id: broadcast._id,
    });
  };
  const handleUpdateBroadcast = () => {
    updateBroadcast({
      id: broadcast._id,
    });
  };
  return (
    <div
      className={cn(
        "background-light900_dark300 relative flex w-11/12 flex-col items-start justify-between rounded-[10px] p-9 sm:px-11"
      )}
    >
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          {editable && (
            <Button
              size={"icon"}
              onClick={() => handleDeleteBroadcast()}
              disabled={deletePending}
              className="absolute bottom-2 right-2"
              variant={"destructive"}
            >
              <Trash className="text-dark300_light900" />
            </Button>
          )}
          <span className="text-dark400_light700 mt-2 line-clamp-1 flex flex-col text-xs ">
            <span>{getTimestamp(broadcast._creationTime)}</span>
          </span>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {broadcast.title}
          </h3>
        </div>
      </div>

      <div className="text-dark200_light900 mt-3.5 flex flex-wrap gap-2">
        {broadcast.description}
      </div>
      <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
        <Link
          href={`/maps/${broadcast._id}`}
          className="flex items-center gap-2 text-blue-500 visited:text-purple-500 hover:text-purple-500"
          target="_blank"
        >
          More Details
          <SquareArrowOutUpRight size={20} />
        </Link>
      </div>
      <div className="my-2 flex flex-row items-center gap-4 max-[480px]:flex-col">
        <p className="text-dark100_light900">Needs: </p>
        <div className="grid grid-cols-5 gap-3 max-[480px]:grid-cols-2">
          {broadcast.skills.map((skill, i) => {
            return (
              <div
                key={i}
                className="flex w-full flex-row items-center justify-between gap-2 rounded-md bg-gray-700 p-2"
              >
                <p className="text-dark100_light900 truncate text-sm">
                  {skill}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute right-2 top-2 h-8 w-16">
        <Badge
          className={cn(
            "size-full border text-dark300_light900 flex both-center",
            {
              "bg-green-500": broadcast.status === "Resolved",
              "border-green-700": broadcast.status === "Resolved",
              "bg-red-500": broadcast.status === "Active",
              "border-red-700": broadcast.status === "Active",
            }
          )}
        >
          {broadcast.status}
        </Badge>
      </div>
      {editable && broadcast.status === "Active" && (
        <Button
          className="text-dark300_light900 mt-2 bg-primary-500"
          onClick={() => {
            handleUpdateBroadcast();
          }}
          disabled={updatePending}
        >
          Set as Resolved
        </Button>
      )}
    </div>
  );
};

export default AlertCard;
