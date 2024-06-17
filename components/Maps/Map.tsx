"use client";
import { customMarker, locationMarker } from "@/constants";
import { Doc } from "@/convex/_generated/dataModel";
import useLocation from "@/hooks/useLocation";
import { cn } from "@/lib/utils";
import haversine from "haversine-distance";
import L, { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { ReactNode } from "react";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const MapMarker = ({
  position,
  icon,
  children,
}: {
  position: LatLng | [number, number];
  icon: L.Icon<{
    iconUrl: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
    popupAnchor: [number, number];
  }>;
  children?: ReactNode;
}) => (
  <Marker position={position} icon={icon}>
    {children}
  </Marker>
);

const MapPopup = ({ children }: { children: ReactNode }) => (
  <Popup>{children}</Popup>
);

interface MapProps {
  className?: string;
  full?: boolean;
  center?: LatLng;
  zoom?: number;
  children?: ReactNode;
  markerData?: Doc<"broadcast">[];
}

const Map = ({
  className,
  full = false,
  center,
  zoom,
  children,
  markerData,
}: MapProps) => {
  const { location, accuracy } = useLocation();
  return (
    <MapContainer
      scrollWheelZoom
      center={center || [33.893, 35.743]}
      zoom={zoom || 9}
      className={cn(
        "w-full h-[50%] z-0",
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
      {location && (
        <Map.Marker icon={locationMarker} position={location}>
          <Map.Popup>You are here with accuracy: {accuracy}m</Map.Popup>
        </Map.Marker>
      )}
      {markerData?.map((marker) => (
        <Map.Marker
          key={marker._id}
          position={marker.location as unknown as LatLng}
          icon={customMarker}
        >
          <Map.Popup>
            <Link href={`/maps/${marker._id}`} className="hover:underline">
              {marker.title}
            </Link>
            {location && (
              <p>
                Distance:{" "}
                {Math.ceil(
                  haversine(
                    { latitude: location[0], longitude: location[1] },
                    {
                      latitude: marker.location[0],
                      longitude: marker.location[1],
                    }
                  ) / 1000
                )}{" "}
                km
              </p>
            )}
          </Map.Popup>
        </Map.Marker>
      ))}
    </MapContainer>
  );
};

Map.Marker = MapMarker;
Map.Popup = MapPopup;

export default Map;
