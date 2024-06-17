"use client";
import AlertCard from "@/components/cards/AlertCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { api } from "@/convex/_generated/api";
import useLocation from "@/hooks/useLocation";
import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import haversine from "haversine-distance";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const SKILLS = [
  "Medical",
  "Food and Water",
  "Shelter",
  "Transportation",
  "Clothing",
  "Other",
];

const AlertPage = () => {
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
  const broadcasts = useQuery(api.broadcasts.get);
  const currUser = useQuery(api.users.getCurrentUser);
  const { location } = useLocation();
  const o = useOrganization().organization;
  const org = useQuery(api.organizations.getOne, { orgName: o?.name });
  const modifiedBroadcasts = broadcasts?.filter((broadcast) => {
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
  const CreateAlertDialogNoSSR = useMemo(
    () =>
      dynamic(() => import("@/components/dialogs/CreateAlertDialog"), {
        ssr: false,
      }),
    []
  );
  return (
    <div className="flex size-full flex-col items-center gap-4">
      <CreateAlertDialogNoSSR />
      <div className="flex w-full gap-3 max-lg:flex-col">
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
      {modifiedBroadcasts && modifiedBroadcasts.length ? (
        modifiedBroadcasts.map((broadcast) => (
          <AlertCard
            key={broadcast._id}
            broadcast={broadcast}
            editable={
              !!(org && org._id === broadcast.senderId) ||
              !!(currUser && currUser._id === broadcast.senderId)
            }
          />
        ))
      ) : (
        <p className="text-dark300_light900">No Alerts</p>
      )}
    </div>
  );
};

export default AlertPage;
