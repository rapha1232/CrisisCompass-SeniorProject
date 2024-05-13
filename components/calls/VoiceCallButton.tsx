"use client";

import { cn } from "@/lib/utils";
import { PhoneCall } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface VoiceCallButtonProps {
  className?: string;
  tooltip: string;
  handleClick?: () => void;
}

const VoiceCallButton = ({
  className,
  tooltip,
  handleClick,
}: VoiceCallButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button size={"icon"} className="bg-transparent">
          <TooltipContent className="background-light700_dark300 text-dark100_light900 border-none outline-none">
            <p>{tooltip}</p>
          </TooltipContent>
          <section
            className={cn("w-full cursor-pointer", className)}
            onClick={handleClick}
          >
            <div className="both-center flex size-12">
              <PhoneCall size={20} />
            </div>
          </section>
        </Button>
      </TooltipTrigger>
    </Tooltip>
  );
};

export default VoiceCallButton;
