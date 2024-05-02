import { cn } from "@/lib/utils";
import { CircleArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import { MdGroups2 } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

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
};

const Header = ({ imageUrl, name, options }: Props) => {
  return (
    <Card className="w-full flex rounded-lg items-center justify-between p-2 outline-none border-none text-dark100_light900">
      <div className="flex items-center gap-2">
        <Link href="/chats" className="lg:hidden block">
          <CircleArrowLeft />
        </Link>
        <Avatar className="size-8">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>
            <MdGroups2 size={24} />
          </AvatarFallback>
        </Avatar>
        <h2 className="semi-bold">{name}</h2>
      </div>
      <div className="flex gap-2">
        {options ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="active:outline-none focus:outline-none">
              <Button size="icon" variant={"secondary"}>
                <Settings color="white" />
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
