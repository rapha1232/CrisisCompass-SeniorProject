"use client";
import { customMarker } from "@/constants";
import { cn } from "@/lib/utils";
import { LatLng } from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import { MutableRefObject, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvent } from "react-leaflet";

function ClickMarker({ returnFnc }: { returnFnc: (data: LatLng) => void }) {
  const [position, setPosition] = useState<LatLng | null>(null);
  useMapEvent("click", (e) => {
    setPosition(e.latlng);
    returnFnc(e.latlng);
  });
  return position ? <Marker position={position} icon={customMarker} /> : null;
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

export const MapWithClick = ({
  full = false,
  returnFnc,
}: {
  full?: boolean;
  returnFnc: (data: LatLng) => void;
}) => {
  const animatedRef = useRef(true);
  return (
    <MapContainer
      scrollWheelZoom
      center={[33.893, 35.743]}
      zoom={9}
      className={cn("w-full h-1/2", { "h-full": full })}
      fadeAnimation={true}
      zoomAnimation={true}
      markerZoomAnimation={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickMarker returnFnc={returnFnc} />
      <SetViewOnClick animateRef={animatedRef} />
    </MapContainer>
  );
};
