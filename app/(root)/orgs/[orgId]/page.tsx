"use client";
import { Map } from "@/components/Maps/Map";
import AlertCard from "@/components/cards/AlertCard";
import { OrgImage } from "@/components/cards/OrgCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { customMarker } from "@/constants";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationState } from "@/hooks/useMutationState";
import { useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { LatLng } from "leaflet";
import { ChevronsDown, ChevronsUp, PlusIcon, X } from "lucide-react";
import { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { toast } from "sonner";
type Props = {
  params: {
    orgId: Id<"organization">;
  };
};

const Page = ({ params: { orgId } }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const organization = useQuery(api.organizations.getOneById, { orgId });
  const orgBroadcasts = useQuery(api.broadcasts.getOrgBroadcasts, { orgId });
  const currUser = useQuery(api.users.getCurrentUser);
  const doesFollow = useQuery(api.follower.doesFollowOrg, {
    orgId,
  });
  const { mutate: follow } = useMutationState(api.follower.createForOrg);
  const { mutate: unfollow } = useMutationState(api.follower.deleteForOrg);
  const onClickPlus = () => {
    if (!currUser) return;
    follow({
      orgId,
    })
      .then(() => toast.success("Followed Successfully"))
      .catch((err) =>
        toast.error(err instanceof ConvexError ? err.data : "An error occured")
      );
  };
  const onClickMinus = () => {
    if (!currUser) return;
    unfollow({
      orgId,
    })
      .then(() => toast.success("Unfollowed Successfully"))
      .catch((err) =>
        toast.error(err instanceof ConvexError ? err.data : "An error occured")
      );
  };
  if (!organization) return null;
  return (
    <div className="text-dark100_light900 no-scrollbar flex size-full flex-col items-center gap-2 overflow-y-scroll p-4">
      <div className="flex max-h-fit w-full items-center justify-evenly gap-6 max-sm:flex-col">
        <div className="relative m-0 select-none p-0">
          {organization.adminId !== currUser?._id ? (
            doesFollow ? (
              <Badge
                className="absolute right-0 top-0 bg-red-400 hover:bg-red-600"
                onClick={onClickMinus}
              >
                <X size={20} />
              </Badge>
            ) : (
              <Badge
                className="absolute right-0 top-0 bg-green-400 hover:bg-green-600"
                onClick={onClickPlus}
              >
                <PlusIcon size={20} />
              </Badge>
            )
          ) : null}
          <OrgImage logo={organization.logo} size={200}></OrgImage>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl">{organization.name}</h1>
          <p className="text-xl text-light-500">{organization.email}</p>
          <p className="text-base text-light-500">
            Phone number: {organization.phoneNumber}
          </p>
        </div>
      </div>
      <div className="mt-6 text-lg">
        <h2 className="text-lg">What are we?</h2>
        <span className="text-base">{organization.description}</span>
      </div>
      <div className="both-center z-0 mt-12 flex size-full h-[400px]">
        <Map
          full
          center={organization.location as unknown as LatLng}
          zoom={9}
          className="w-1/2 max-sm:w-3/4"
        >
          <Marker
            icon={customMarker}
            position={organization.location as unknown as LatLng}
          >
            <Popup>This is where we are situated</Popup>
          </Marker>
        </Map>
      </div>
      <div className="flex w-full flex-col items-center">
        <Collapsible
          className="flex w-full flex-col items-center"
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <CollapsibleTrigger asChild className="flex flex-row items-center">
            <Button variant="ghost" className="flex flex-row p-0">
              {isOpen ? (
                <ChevronsUp className="text-dark300_light900" size={20} />
              ) : (
                <ChevronsDown className="text-dark300_light900" size={20} />
              )}
              <span className="text-dark300_light900">Toggle Broadcasts</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex w-3/4 flex-col gap-4">
            {orgBroadcasts?.map((broadcast) => (
              <AlertCard
                className="w-full"
                key={broadcast._id}
                broadcast={broadcast}
                editable={currUser?._id === organization.adminId}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default Page;
