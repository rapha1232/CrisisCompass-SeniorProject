"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

type Props = {};

const OngoingEmergencies = (props: Props) => {
  const ongoingEmergencies = useQuery(api.broadcasts.getOngoingEmergencies);
  return (
    <div className="mt-7 flex flex-col gap-4">
      {ongoingEmergencies?.map((emergency) => {
        return (
          <div key={emergency._id} className="flex items-center gap-4">
            <div className="size-4 rounded-full bg-red-500"></div>
            <div>{emergency.title}</div>
          </div>
        );
      })}
    </div>
  );
};

export default OngoingEmergencies;
