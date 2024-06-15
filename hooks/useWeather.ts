import { WeatherRes } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useWeather = (lat?: number, lon?: number) => {
  const [weather, setWeather] = useState<WeatherRes>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  useEffect(() => {
    fetch(`https://api.weatherapi.com/v1/current.json?q=${lat},${lon}`, {
      headers: {
        key: process.env.NEXT_PUBLIC_WEATHER_KEY!,
      },
    })
      .then((response) => {
        if (!response.ok) {
          toast.error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setError(false);
        setWeather(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [lat, lon]);

  return { weather, loading, error };
};
