"use client";
import { Map } from "@/components/Maps/Map";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { customMarker } from "@/constants";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { WeatherRes } from "@/types";
import { useQuery } from "convex/react";
import { LatLng } from "leaflet";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Marker, Popup as MarkerPopup } from "react-leaflet";

interface AlertProps {
  params: {
    broadcastId: Id<"broadcast">;
  };
}

const AlertPage = ({ params: { broadcastId } }: AlertProps) => {
  const broadcast = useQuery(api.broadcasts.getBroadcast, {
    id: broadcastId,
  });
  const [weather, setWeather] = useState<WeatherRes | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (broadcast?.location) {
      fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_KEY}&q=${broadcast.location[0]},${broadcast.location[1]}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data: WeatherRes) => {
          setWeather(data);
          setError(false);
        })
        .catch(() => {
          setError(true);
        });
    }
  }, [broadcast]);
  return (
    <div className="both-center flex size-full flex-col gap-2">
      <div className="m-0 flex size-full gap-12 overflow-y-scroll p-0 max-lg:flex-col">
        <Card className="background-light800_dark400 text-dark100_light900 min-w-80 rounded-xl border-none p-4 outline-none max-lg:w-full lg:max-w-fit">
          <ScrollArea className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">More Details</h4>
              <p className="text-sm">
                Get more information about the emergency here.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Title</Label>
                <span className="col-span-2 h-8 text-wrap">
                  {broadcast?.title}
                </span>
              </div>
              <Separator className="bg-light-500" />
              <div className="grid grid-cols-3 items-center gap-4 overflow-x-auto text-ellipsis">
                <Label>Description</Label>
                <span className="col-span-2 h-fit min-h-8 text-ellipsis">
                  {broadcast?.description}
                </span>
              </div>
              <Separator className="bg-light-500" />
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Skills Needed</Label>
                <span className="col-span-2 h-fit">
                  <div className="grid min-h-fit grid-cols-2 gap-2">
                    {broadcast?.skills.map((skill, i) => {
                      return (
                        <div
                          key={i}
                          className="flex flex-col items-center justify-between gap-2 "
                        >
                          <div className="flex w-full flex-row items-center justify-between gap-2 rounded-md bg-gray-700 p-2">
                            <p className="truncate text-sm">{skill}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </span>
              </div>
              <Separator className="bg-light-500" />
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Temperature</Label>
                <span className="col-span-2 h-8">
                  {weather?.current.temp_c}°C
                </span>
              </div>
              <Separator className="bg-light-500" />
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Feels Like</Label>
                <span className="col-span-2 h-8">
                  {weather?.current.feelslike_c}°C
                </span>
              </div>
              <Separator className="bg-light-500" />
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Condition</Label>
                <span className="col-span-2 h-8">
                  {weather?.current.condition.text}
                </span>
              </div>
              <Separator className="bg-light-500" />
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Precipitation</Label>
                <span className="col-span-2 h-8">
                  {weather?.current.precip_mm}mm
                </span>
              </div>
              <Separator className="bg-light-500" />
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Wind Speed</Label>
                <span className="col-span-2 h-8">
                  {weather?.current.gust_kph}km/h
                </span>
              </div>
              <Separator className="bg-light-500" />
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Wind Direction</Label>
                <span className="col-span-2 h-8">
                  {weather?.current.wind_dir}
                </span>
              </div>
              <Separator className="bg-light-500" />
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
          </ScrollArea>
        </Card>
        <Map
          zoom={10}
          center={broadcast?.location as unknown as LatLng}
          full
          className="min-h-[500px]"
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
            <MarkerPopup>
              <div className="both-center m-4 flex flex-col gap-2">
                <p className="!m-0">{broadcast?.title}</p>
                {error ? (
                  <p className="!m-0">Error getting weather</p>
                ) : weather ? (
                  <span className="!m-0 flex flex-col items-center gap-2">
                    <Image
                      loader={({ src }) => src}
                      src={weather.current.condition.icon.replace(
                        "//",
                        "https://"
                      )}
                      alt="icon"
                      width={40}
                      height={40}
                      className="!m-0"
                    />
                    <p className="!m-0 !p-0">{weather.current.temp_c}°C</p>
                  </span>
                ) : null}
              </div>
            </MarkerPopup>
          </Marker>
        </Map>
      </div>
    </div>
  );
};

export default AlertPage;
