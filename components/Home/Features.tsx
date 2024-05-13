import { features } from "@/constants";
import Image from "next/image";
import FeatureCard from "../cards/FeatureCard";

export default function Features() {
  return (
    <div className="home-features">
      <div className="featuresContainer">
        <div className="home-features1">
          <div className="home-container2">
            <span className="overtext">
              <span>FEATURES</span>
              <br></br>
            </span>
            <h2 className="home-features-heading heading2">
              Key Features of Our Emergency Aid App
            </h2>
          </div>
          <div className="home-container3">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={
                  <Image
                    src={feature.icon}
                    alt={feature.heading}
                    width={20}
                    height={20}
                    className="invert-colors mr-6 size-8 shrink"
                  />
                }
                heading={feature.heading}
                subHeading={feature.subHeading}
              ></FeatureCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
