"use client";
import { cn } from "@/lib/utils";
import { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { ReactNode } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

interface MapProps {
  className?: string;
  full?: boolean;
  center?: LatLng;
  zoom?: number;
  children?: ReactNode;
}

export const Map = ({
  className,
  full = false,
  center,
  zoom,
  children,
}: MapProps) => {
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
    </MapContainer>
  );
};
