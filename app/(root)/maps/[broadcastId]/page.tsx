"use client";
import { Map } from "@/components/Maps/Map";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import L, { LatLng } from "leaflet";
import { Marker, Popup } from "react-leaflet";

interface AlertProps {
  params: {
    broadcastId: Id<"broadcast">;
  };
}

const myIcon = new L.Icon({
  iconUrl: "/assets/icons/mapMarker.svg",
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -15],
  className: "fill-red-600",
});

const AlertPage = ({ params: { broadcastId } }: AlertProps) => {
  const broadcast = useQuery(api.broadcasts.getBroadcast, { id: broadcastId });
  return (
    <div className="both-center flex size-full flex-col">
      <Map
        zoom={10}
        center={broadcast?.location as unknown as LatLng}
        full
        className="size-[90%]"
      >
        <Marker
          icon={myIcon}
          position={
            broadcast
              ? (broadcast.location as unknown as LatLng)
              : [33.893, 35.743]
          }
        >
          <Popup>{broadcast?.title}</Popup>
        </Marker>
      </Map>
    </div>
  );
};

export default AlertPage;
