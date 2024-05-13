"use client";

import { cn } from "@/lib/utils";
import { MdCall } from "react-icons/md";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface VideoCallButtonProps {
  className?: string;
  tooltip: string;
  handleClick?: () => void;
}

const VideoCallButton = ({
  className,
  tooltip,
  handleClick,
}: VideoCallButtonProps) => {
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
              <MdCall size={20} />
            </div>
          </section>
        </Button>
      </TooltipTrigger>
    </Tooltip>
  );
};

export default VideoCallButton;
