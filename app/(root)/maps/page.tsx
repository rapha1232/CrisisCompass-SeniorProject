"use client";
import OngoingEmergencies from "@/components/Global/OngoingEmergencies";
import { Map } from "@/components/Maps/Map";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { customMarker } from "@/constants";
import { api } from "@/convex/_generated/api";
import useLocation from "@/hooks/useLocation";
import { useQuery } from "convex/react";
import haversine from "haversine-distance";
import { LatLng } from "leaflet";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Marker, Popup } from "react-leaflet";

const MapPage = () => {
  const [distance, setDistance] = useState(200);
  const ongoingEmergencies = useQuery(api.broadcasts.getOngoingEmergencies);
  const [isOpen, setIsOpen] = useState(true);
  const { location } = useLocation();
  return (
    <section className="flex size-full flex-col items-center">
      <span className="m-0 mx-2 flex flex-col items-center gap-3 p-0">
        <h1 className="text-dark100_light900 text-4xl">This is the Map page</h1>
        <h4 className="text-dark100_light900 justify-center text-justify text-xl">
          Here, you can veiw the full map with live updates of new emergencies,
          as well as all other active emergencies.
        </h4>
      </span>
      <p className="text-dark100_light900">Filter by distance to emergency:</p>
      <Input
        className="w-[90%] outline-none"
        placeholder="Distance (in km)..."
        value={distance}
        onChange={(e) => setDistance(Number(e.target.value))}
        type="number"
      />
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex size-full flex-col items-center"
      >
        <CollapsibleTrigger asChild className="flex flex-row items-center">
          <Button variant="ghost" className="flex flex-row p-0">
            {isOpen ? (
              <ChevronsUp className="text-dark300_light900" size={20} />
            ) : (
              <ChevronsDown className="text-dark300_light900" size={20} />
            )}
            <span className="text-dark300_light900">Toggle Map</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex size-full justify-center">
          <Map zoom={8.5} className="mt-2 h-3/4 w-[90%]">
            {ongoingEmergencies
              ?.filter((emergency) => {
                if (!emergency.location || !location) return false;

                const emergencyLocation = {
                  latitude: emergency.location[0],
                  longitude: emergency.location[1],
                };
                const userLocation = {
                  latitude: location[0],
                  longitude: location[1],
                };

                const dist = haversine(userLocation, emergencyLocation) / 1000; // dist in km

                return dist <= distance;
              })
              .map((emergency) => (
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
                    {location && (
                      <p>
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
                  </Popup>
                </Marker>
              ))}
          </Map>
        </CollapsibleContent>
      </Collapsible>
      <div className="flex h-2/5 w-[90%] flex-col xl:hidden">
        <h3 className="h3-bold text-dark200_light900 mb-2">
          Ongoing Emergencies Descriptions
        </h3>
        <div className="flex flex-col gap-6">
          <OngoingEmergencies descriptions />
        </div>
      </div>
    </section>
  );
};

export default MapPage;
