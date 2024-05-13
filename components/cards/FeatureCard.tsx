import { ReactNode } from "react";

type Props = {
  heading: string;
  subHeading: string;
  icon: ReactNode;
};
const FeatureCard = ({ heading, subHeading, icon }: Props) => {
  return (
    <>
      <div className="featuresCard max-md:flex-row">
        {icon}
        <div className="flex flex-col items-start justify-start gap-4 max-md:flex-col max-[480px]:flex-col">
          <h3 className="heading3 font-semibold leading-6">{heading}</h3>
          <span className="bodySmall">{subHeading}</span>
        </div>
      </div>
    </>
  );
};

export default FeatureCard;
