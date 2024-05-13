import { useEffect, useState } from "react";

const useLocation = () => {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
        setAccuracy(Math.ceil(position.coords.accuracy) / 10);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  return { location, accuracy };
};

export default useLocation;
