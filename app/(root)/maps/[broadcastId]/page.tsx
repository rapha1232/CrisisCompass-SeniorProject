"use client";
import { Map } from "@/components/Maps/Map";
import { Button } from "@/components/ui/button";
import { customMarker } from "@/constants";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { LatLng } from "leaflet";
import Image from "next/image";
import Link from "next/link";
import { Marker, Popup } from "react-leaflet";

interface AlertProps {
  params: {
    broadcastId: Id<"broadcast">;
  };
}

const AlertPage = ({ params: { broadcastId } }: AlertProps) => {
  const broadcast = useQuery(api.broadcasts.getBroadcast, { id: broadcastId });
  return (
    <div className="both-center flex size-full flex-col gap-2">
      <Map
        zoom={10}
        center={broadcast?.location as unknown as LatLng}
        full
        className="size-[90%]"
        broadcast={broadcast ?? undefined}
      >
        <Marker
          icon={customMarker}
          position={
            broadcast
              ? (broadcast.location as unknown as LatLng)
              : [33.893, 35.743]
          }
        >
          <Popup>{broadcast?.title}</Popup>
        </Marker>
      </Map>
      <Button className="text-dark100_light900">
        <Link
          href={`https://www.google.com/maps/dir/?api=1&destination=${broadcast?.location[0]},${broadcast?.location[1]}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <Image
            src={"/assets/images/google-maps.svg"}
            width={20}
            height={20}
            alt="Google Maps"
          />
          Open with Google Maps
        </Link>
      </Button>
    </div>
  );
};

export default AlertPage;
