import { SignedIn } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function Hero() {
  const GetStartedDialogNoSSR = useMemo(
    () =>
      dynamic(
        () => import("../dialogs/GetStartedDialog").then((mod) => mod.default),
        {
          ssr: false,
        }
      ),
    []
  );
  return (
    <div className="home-hero">
      <div className="heroContainer home-hero1">
        <div className="home-container1">
          <h1 className="home-hero-heading heading1">
            Be a Hero in Emergencies
          </h1>
          <div className="flex items-center ">
            <SignedIn>
              <GetStartedDialogNoSSR />
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}
