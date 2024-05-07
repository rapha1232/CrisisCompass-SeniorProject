import { SignedIn } from "@clerk/nextjs";
import GetStartedDialog from "../dialogs/GetStartedDialog";

export default function Hero() {
  return (
    <div className="home-hero">
      <div className="heroContainer home-hero1">
        <div className="home-container1">
          <h1 className="home-hero-heading heading1">
            Be a Hero in Emergencies
          </h1>
          <div className="flex items-center ">
            <SignedIn>
              <GetStartedDialog />
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}
