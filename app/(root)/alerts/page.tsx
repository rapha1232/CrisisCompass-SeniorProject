"use client";
import AlertCard from "@/components/cards/AlertCard";
import CreateAlertDialog from "@/components/dialogs/CreateAlertDialog";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "convex/react";

type Props = {};

const AlertPage = (props: Props) => {
  const broadcasts = useQuery(api.broadcasts.get);
  const currUser = useQuery(api.users.getCurrentUser);
  const o = useOrganization().organization;
  const org = useQuery(api.organizations.getOne, { orgName: o?.name });
  return (
    <div className="flex size-full flex-col items-center gap-4">
      <CreateAlertDialog />
      {broadcasts && broadcasts.length ? (
        broadcasts.map((broadcast) => (
          <AlertCard
            key={broadcast._id}
            broadcast={broadcast}
            editable={
              org?.adminId === broadcast.senderId ??
              currUser?._id === broadcast.senderId ??
              false
            }
          />
        ))
      ) : (
        <p className="text-dark300_light900">No Alerts</p>
      )}
    </div>
  );
};

export default AlertPage;
