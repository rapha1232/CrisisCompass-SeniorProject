import { cn } from "@/lib/utils";
import { CircleArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import { MdGroups2 } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

import { Id } from "@/convex/_generated/dataModel";
import MeetingTypeList from "../calls/MeetingTypeList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Props = {
  imageUrl?: string;
  name: string;
  options?: {
    label: string;
    destructive: boolean;
    onClick: () => void;
  }[];
  chatId: Id<"chats">;
};

const Header = ({ imageUrl, name, options, chatId }: Props) => {
  return (
    <Card className="text-dark100_light900 flex w-full items-center justify-between rounded-lg border-none p-2 outline-none">
      <div className="flex items-center gap-2">
        <Link href="/chats" className="lg:hidden">
          <CircleArrowLeft />
        </Link>
        <Avatar className="size-8">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>
            <MdGroups2 size={24} />
          </AvatarFallback>
        </Avatar>
        <h2 className="font-semibold">{name}</h2>
      </div>
      <div className="flex gap-2">
        <MeetingTypeList chatId={chatId} />
        {options ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none active:outline-none">
              <Button size="icon" variant={"secondary"}>
                <Settings className="text-dark100_light900" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="background-light700_dark300">
              {options.map((option, id) => {
                return (
                  <DropdownMenuItem
                    key={id}
                    onClick={option.onClick}
                    className={cn("font-semibold text-dark100_light900", {
                      "text-red-600": option.destructive,
                    })}
                  >
                    {option.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </Card>
  );
};

export default Header;
