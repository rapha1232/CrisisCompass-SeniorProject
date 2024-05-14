"use client";
import OrgCard from "@/components/cards/OrgCard";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";

const OrgPage = () => {
  const orgs = useQuery(api.organizations.get);
  const followedOrgs = useQuery(api.users.getOrgsFollowedByUser);
  const [name, setName] = useState("");
  const filteredOrgs = orgs?.filter((org) =>
    org.name.toLowerCase().includes(name.toLowerCase())
  );
  return (
    <>
      <Input
        placeholder="Search for organizations"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-dark100_light900 background-light700_dark300 no-focus mx-auto w-3/4 border-none outline-none "
      />
      <div className="m-4 grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
        {filteredOrgs?.map((org) => {
          const isFollowed = followedOrgs?.some(
            (followedOrg) => followedOrg?._id === org._id
          );
          return (
            <>
              <OrgCard org={org} followed={isFollowed} />
            </>
          );
        })}
      </div>
    </>
  );
};

export default OrgPage;
