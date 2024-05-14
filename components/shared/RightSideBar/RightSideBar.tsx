"use client";
import MapsRightSidebarContent from "@/components/Global/MapsRightSidebarContent";
import OngoingEmergencies from "@/components/Global/OngoingEmergencies";
import { Map } from "@/components/Maps/Map";
import { customMarker } from "@/constants";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { LatLng } from "leaflet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Marker, Popup } from "react-leaflet";

const RightSideBar = () => {
  const ongoingEmergencies = useQuery(api.broadcasts.getOngoingEmergencies);
  const pathName = usePathname();

  if (pathName.includes("/maps")) return <MapsRightSidebarContent />;
  return (
    <section className="background-light900_dark200 custom-scrollbar light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div className="h-1/2">
        <h3 className="h3-bold text-dark200_light900 mb-2">Map</h3>
        <div className="flex size-full flex-col gap-[30px]">
          <Map full>
            {ongoingEmergencies?.map((emergency) => (
              <Marker
                key={emergency._id}
                position={emergency.location as unknown as LatLng}
                icon={customMarker}
              >
                <Popup>
                  <Link
                    href={`/maps/${emergency._id}`}
                    className="hover:underline"
                  >
                    {emergency.title}
                  </Link>
                </Popup>
              </Marker>
            ))}
          </Map>
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Ongoing Emergencies</h3>
        <OngoingEmergencies />
      </div>
    </section>
  );
};

export default RightSideBar;
