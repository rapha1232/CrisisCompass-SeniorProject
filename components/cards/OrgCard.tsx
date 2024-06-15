import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationState } from "@/hooks/useMutationState";
import { useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import DeleteOrgDialog from "../dialogs/DeleteOrgDialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

type Org = {
  logo: string | null;
  _id: Id<"organization">;
  _creationTime: number;
  email: string;
  phoneNumber: string;
  location: number[];
  name: string;
  description: string;
  adminId: Id<"users">;
  imageUrl: Id<"_storage">;
};

const OrgCard = ({ org, followed }: { org: Org; followed?: boolean }) => {
  const currUser = useQuery(api.users.getCurrentUser);
  const { mutate: followOrg, pending: followPending } = useMutationState(
    api.follower.createForOrg
  );
  const { mutate: unFollowOrg, pending: unFollowPending } = useMutationState(
    api.follower.deleteForOrg
  );

  const orgFollowers = useQuery(api.follower.countForOrg, {
    orgId: org._id,
  });
  const handleFollowOrg = (orgId: Id<"organization">) => {
    if (!currUser) return;
    followOrg({
      orgId,
    })
      .then(() => toast.success("Followed Successfully"))
      .catch((err) =>
        toast.error(err instanceof ConvexError ? err.data : "An error occured")
      );
  };
  const handleUnFollowOrg = (orgId: Id<"organization">) => {
    if (!currUser) return;
    unFollowOrg({
      orgId,
    })
      .then(() => toast.success("Unfollowed Successfully"))
      .catch((err) =>
        toast.error(err instanceof ConvexError ? err.data : "An error occured")
      );
  };
  return (
    <Popover>
      <PopoverTrigger asChild className="cursor-pointer">
        <article
          key={org._id}
          className="background-light800_dark200 light-border relative col-span-1 flex max-h-[300px] w-full max-w-[400px] flex-col items-center justify-center rounded-2xl border p-8 max-md:mx-auto"
        >
          <OrgImage logo={org.logo} />
          <div className="mt-4 text-center">
            <h4 className="h3-bold text-dark200_light900 line-clamp-1">
              {org.name}
            </h4>
            <p className="body-regular text-dark500_light500 mt-2">
              {org.email}
            </p>
          </div>
          {orgFollowers && orgFollowers > 0 && (
            <div className="absolute right-2 top-2 text-white">
              Followers: {orgFollowers}
            </div>
          )}
          <div className="mt-4">
            {org.adminId !== currUser?._id ? (
              followed ? (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnFollowOrg(org._id);
                  }}
                  disabled={unFollowPending}
                  className="text-dark100_light900 w-full bg-red-500"
                >
                  Unfollow Organization
                </Button>
              ) : (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollowOrg(org._id);
                  }}
                  disabled={followPending}
                  className="text-dark100_light900 w-full bg-green-500"
                >
                  Follow Organization
                </Button>
              )
            ) : (
              <DeleteOrgDialog orgId={org._id} />
            )}
          </div>
          :
        </article>
      </PopoverTrigger>
      <PopoverContent className="background-light800_dark400 text-dark100_light900 w-80 rounded-xl border-none p-4 outline-none">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">More Details</h4>
            <p className="text-sm">
              Get more information about the organization here.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Name</Label>
              <span className="col-span-2 h-8">{org.name}</span>
            </div>
            <Separator className="bg-light-500" />
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Description</Label>
              <span className="col-span-2 h-8">{org.description}</span>
            </div>
            <Separator className="bg-light-500" />
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Email</Label>
              <span className="col-span-2 h-8">{org.email}</span>
            </div>
            <Separator className="bg-light-500" />
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Phone Number</Label>
              <span className="col-span-2 h-8">{org.phoneNumber}</span>
            </div>
            <Separator className="bg-light-500" />
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Location</Label>
              <Link
                href={`https://www.google.com/maps/dir/?api=1&destination=${org.location[0]},${org.location[1]}`}
                className="col-span-2 h-8 text-blue-400 visited:text-purple-500 hover:text-blue-500 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Press to navigate
              </Link>
            </div>
            <Separator className="bg-light-500" />
            <div className="grid grid-cols-3 items-center gap-4">
              <Link
                href={`/orgs/${org._id}`}
                className="col-span-3 h-8 text-center text-blue-400 visited:text-purple-500 hover:text-blue-500 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                More Info
              </Link>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const OrgImage = ({
  logo,
  size = 100,
}: {
  logo: string | null;
  size?: number;
}) => {
  return (
    <>
      {logo && (
        <Image
          loader={() => {
            if (logo) return logo;
            return "";
          }}
          src={logo}
          alt="test"
          width={size}
          height={size}
        />
      )}
    </>
  );
};

export default OrgCard;
