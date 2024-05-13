"use client";
import { locationMarker } from "@/constants";
import { Doc } from "@/convex/_generated/dataModel";
import useLocation from "@/hooks/useLocation";
import { cn } from "@/lib/utils";
import { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MutableRefObject, ReactNode, useRef } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvent,
} from "react-leaflet";

interface MapProps {
  className?: string;
  full?: boolean;
  center?: LatLng;
  zoom?: number;
  children?: ReactNode;
  broadcast?: Doc<"broadcast">;
}

function SetViewOnClick({
  animateRef,
}: {
  animateRef: MutableRefObject<boolean>;
}) {
  const map = useMapEvent("click", (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: animateRef.current || false,
    });
  });

  return null;
}

// const Route = ({ broadcast }: MapProps) => {
//   const map = useMap();
//   const currentUser = useQuery(api.users.getCurrentUser);
//   map.addControl(
//     L.Routing.control({
//       waypoints: [
//         currentUser!.location as unknown as LatLng,
//         broadcast!.location as unknown as LatLng,
//       ],
//     })
//   );
//   return null;
// };

export const Map = ({
  className,
  full = false,
  center,
  zoom,
  children,
  broadcast,
}: MapProps) => {
  const animatedRef = useRef(true);
  const { location, accuracy } = useLocation();
  return (
    <MapContainer
      scrollWheelZoom
      center={center || [33.893, 35.743]}
      zoom={zoom || 9}
      className={cn(
        "w-full h-[50%]",
        {
          "h-full": full,
        },
        className
      )}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
      <SetViewOnClick animateRef={animatedRef} />
      {location && (
        <Marker icon={locationMarker} position={location}>
          <Popup>You are here with accuracy: {accuracy}m</Popup>
        </Marker>
      )}
      {/* {broadcast && <Route broadcast={broadcast} />} */}
    </MapContainer>
  );
};
