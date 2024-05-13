"use client";
import { api } from "@/convex/_generated/api";
import useLocation from "@/hooks/useLocation";
import { useQuery } from "convex/react";
import haversine from "haversine-distance";
import Link from "next/link";

type Props = {
  descriptions?: boolean;
};

const OngoingEmergencies = ({ descriptions }: Props) => {
  const ongoingEmergencies = useQuery(api.broadcasts.getOngoingEmergencies);
  const { location } = useLocation();
  return (
    <div className="mt-7 flex w-full flex-col gap-4">
      {ongoingEmergencies?.map((emergency) => {
        return (
          <div key={emergency._id} className="flex items-center gap-4">
            <div className="size-4 rounded-full bg-red-500" />
            {descriptions ? (
              <div className="flex flex-col">
                <Link
                  href={`/maps/${emergency._id}`}
                  className="text-dark300_light900 flex-1 hover:underline"
                >
                  {emergency.title}
                </Link>
                <p className="text-dark300_light900 text-sm">
                  {emergency.description}
                </p>
                {location && (
                  <p className="text-dark100_light900">
                    Distance:{" "}
                    {Math.ceil(
                      haversine(
                        { latitude: location[0], longitude: location[1] },
                        {
                          latitude: emergency.location[0],
                          longitude: emergency.location[1],
                        }
                      ) / 1000
                    )}{" "}
                    km
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col">
                <Link
                  href={`/maps/${emergency._id}`}
                  className="text-dark300_light900 flex-1 text-xl hover:underline"
                >
                  {emergency.title}
                </Link>
                {location && (
                  <p className="text-dark100_light900">
                    Distance:{" "}
                    {Math.ceil(
                      haversine(
                        { latitude: location[0], longitude: location[1] },
                        {
                          latitude: emergency.location[0],
                          longitude: emergency.location[1],
                        }
                      ) / 1000
                    )}{" "}
                    km
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OngoingEmergencies;
