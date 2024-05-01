import FeatureCard from "./FeatureCard";

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
            <FeatureCard
              heading="User Profile"
              subHeading="Create and manage your personal profile for quick access to emergency services"
            ></FeatureCard>
            <FeatureCard
              heading="Chat Logs"
              subHeading="View and track all your communication history during emergencies for better coordination"
            ></FeatureCard>
            <FeatureCard
              heading="Interactive Maps"
              subHeading="Locate emergency situations and relief stations on a user-friendly map interface"
            ></FeatureCard>
            <FeatureCard
              heading="Broadcasts &amp; Alerts"
              subHeading="Stay informed with real-time updates and alerts about ongoing emergencies in your area"
            ></FeatureCard>
          </div>
        </div>
      </div>
    </div>
  );
}
