"use client";
import { cn } from "@/lib/utils";
import { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMapEvent } from "react-leaflet";

function MyComponent({ returnFnc }: { returnFnc: (data: LatLng) => void }) {
  useMapEvent("click", (e) => {
    returnFnc(e.latlng);
  });
  return null;
}

export const MapWithClick = ({
  full = false,
  returnFnc,
}: {
  full?: boolean;
  returnFnc: (data: LatLng) => void;
}) => {
  return (
    <MapContainer
      scrollWheelZoom
      center={[33.893, 35.743]}
      zoom={9}
      className={cn("w-full h-1/2", { "h-full": full })}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MyComponent returnFnc={returnFnc} />
    </MapContainer>
  );
};
