"use client";
import OngoingEmergencies from "@/components/Global/OngoingEmergencies";
import { Map } from "@/components/Maps/Map";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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

const SKILLS = [
  "Medical",
  "Food and Water",
  "Shelter",
  "Transportation",
  "Clothing",
  "Other",
];

const MapPage = () => {
  const currUser = useQuery(api.users.getCurrentUser);
  const [distance, setDistance] = useState(50);
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState<
    (
      | "Medical"
      | "Food and Water"
      | "Shelter"
      | "Transportation"
      | "Clothing"
      | "Other"
    )[]
  >([]);
  const ongoingEmergencies = useQuery(api.broadcasts.getOngoingEmergencies);
  const [isOpen, setIsOpen] = useState(true);
  const { location } = useLocation();
  const modifiedBroadcasts = ongoingEmergencies?.filter((broadcast) => {
    let dist = 0;
    if (location && broadcast.location) {
      dist = Math.ceil(
        haversine(
          { latitude: broadcast.location[0], longitude: broadcast.location[1] },
          { latitude: location[0], longitude: location[1] }
        ) / 1000
      );
    }
    const includesTitle = broadcast.title
      .toLowerCase()
      .includes(title.toLowerCase());
    const includesSkills =
      skills.length === 0 ||
      skills.every((skill) => broadcast.skills.includes(skill));
    return includesTitle && dist <= distance && includesSkills;
  });
  return (
    <section className="flex size-full flex-col items-center">
      <span className="m-0 mx-2 flex flex-col items-center gap-3 p-0">
        <h1 className="text-dark100_light900 text-4xl">This is the Map page</h1>
        <h4 className="text-dark100_light900 justify-center text-justify text-xl">
          Here, you can veiw the full map with live updates of new emergencies,
          as well as all other active emergencies.
        </h4>
      </span>
      <div className="mt-12 flex w-full gap-3 max-lg:flex-col">
        <Input
          placeholder="Search by title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-dark100_light900 background-light700_dark300 no-focus mx-auto w-3/4 border-none outline-none "
        />
      </div>
      <div className="mx-auto mt-4 grid grid-cols-6 max-md:grid-cols-3">
        {SKILLS.map((skill) => (
          <div key={skill} className="col-span-1 m-2 flex items-center gap-1">
            <Checkbox
              className="text-dark100_light900"
              value={
                skill as
                  | "Medical"
                  | "Food and Water"
                  | "Shelter"
                  | "Transportation"
                  | "Clothing"
                  | "Other"
              }
              checked={skills.includes(
                skill as
                  | "Medical"
                  | "Food and Water"
                  | "Shelter"
                  | "Transportation"
                  | "Clothing"
                  | "Other"
              )}
              onCheckedChange={(isChecked) => {
                if (isChecked) {
                  setSkills((prevSkills) => [
                    ...prevSkills,
                    skill as
                      | "Medical"
                      | "Food and Water"
                      | "Shelter"
                      | "Transportation"
                      | "Clothing"
                      | "Other",
                  ]);
                } else {
                  setSkills((prevSkills) =>
                    prevSkills.filter((s) => s !== skill)
                  );
                }
              }}
            />
            <Label className="text-dark100_light900">{skill}</Label>
          </div>
        ))}
      </div>
      <div className="m-0 mt-4 flex w-[90%] items-center gap-2 p-0 max-md:flex-col">
        <p className="text-dark300_light900 w-[160px] text-xl">
          Distance (km): {distance}
        </p>
        <Slider
          min={10}
          max={200}
          step={1}
          value={[distance]}
          onValueChange={(value) => setDistance(value[0])}
          defaultValue={
            currUser?.preferredRadius ? [currUser.preferredRadius] : [50]
          }
          className="no-focus mx-auto max-h-[16px] w-3/4 rounded-full border-none bg-primary-500 outline-none"
        />
      </div>
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
            {modifiedBroadcasts
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
