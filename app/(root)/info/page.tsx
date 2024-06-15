import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

const EmergencyGuidelinesPage = () => {
  return (
    <div className="text-dark100_light900 h-full bg-dark-300">
      <div className="container mx-auto h-full py-8">
        <h1 className="mb-4 text-center text-3xl font-semibold">
          Emergency Guidelines for Lebanon
        </h1>
        {/* Introduction section */}
        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
          <p className="">
            Welcome to our emergency guidelines page for Lebanon! Here,
            you&apos;ll find valuable information on how to act in emergencies,
            coordinate with others, and administer first aid. Your safety and
            well-being are our top priorities.
          </p>
        </section>

        {/* Emergency Tips section */}
        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">Emergency Tips</h2>
          <ul className="list-inside list-disc">
            <li>Remain calm and assess the situation.</li>
            <li>
              Call <a href="tel:140">140</a> (Lebanese Red Cross),{" "}
              <a href="tel:125">175</a> (Fire Brigade),{" "}
              <a href="tel:112">112</a> (Police), <a href="tel:125">125</a>{" "}
              (Civil Defense), <a href="tel:1701">1701</a> (Lebanse Army),{" "}
            </li>
            <li>Provide clear and accurate information about the emergency.</li>
            <li>Follow instructions from emergency responders.</li>
            <li>
              Keep emergency supplies handy, such as first aid kits and
              flashlights.
            </li>
          </ul>
        </section>

        {/* Coordination Guidelines section */}
        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">
            Coordination Guidelines
          </h2>
          <p className="">
            Coordination is crucial during emergencies to ensure effective
            response and assistance. Here are some guidelines for coordinating
            with others:
          </p>
          <ul className="list-inside list-disc">
            <li>Assign specific roles and responsibilities to individuals.</li>
            <li>
              Communicate clearly and efficiently using designated channels.
            </li>
            <li>
              Regularly update everyone involved on the situation and any
              changes.
            </li>
            <li>
              Work together as a team to address challenges and support those in
              need.
            </li>
          </ul>
        </section>

        {/* First Aid Information section */}
        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">First Aid Information</h2>
          <p className="">
            Knowing basic first aid techniques can save lives during
            emergencies. Here are some essential first aid tips:
          </p>
          <ul className="list-inside list-disc">
            <li>
              <Link
                href="https://www.youtube.com/watch?v=3Y5sO2REU2o&pp=ygUDY3By"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 underline hover:text-primary-500"
              >
                Perform CPR if someone is not breathing and has no pulse.
                <SquareArrowOutUpRight size={16} />
              </Link>
            </li>
            <li>
              <Link
                href="https://www.youtube.com/watch?v=8sEijZkfUHI&pp=ygUUc3RvcCBzZXZlcmUgYmxlZWRpbmc%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 underline hover:text-primary-500"
              >
                Stop severe bleeding by applying pressure to the wound.
                <SquareArrowOutUpRight size={16} />
              </Link>
            </li>
            <li>
              Treat burns by cooling the affected area with room temperature
              water.
            </li>
            <li>
              <Link
                href="https://www.youtube.com/watch?v=qX4i72H9zpI"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 underline hover:text-primary-500"
              >
                Stabilize broken bones or fractures to prevent further injury.
                <SquareArrowOutUpRight size={16} />
              </Link>
            </li>
          </ul>
        </section>

        {/* Conclusion */}
        <section>
          <p className="">
            Remember, being prepared and knowing how to respond during
            emergencies can make all the difference. Stay informed, stay safe!
          </p>
        </section>
      </div>
    </div>
  );
};

export default EmergencyGuidelinesPage;
