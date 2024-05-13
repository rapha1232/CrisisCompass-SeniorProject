"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { api } from "@/convex/_generated/api";
import { SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineLogout } from "react-icons/hi";

const NavContent = () => {
  const pathname = usePathname();
  const newFollowRequests = useQuery(api.requests.count);
  const newEmergencies = useQuery(api.broadcasts.getUserNewEmergencies);
  return (
    <section className="flex h-full flex-col  gap-6 pt-16">
      {sidebarLinks.map((link) => {
        const isActive =
          (pathname.includes(link.route) && link.route.length > 1) ||
          pathname === link.route;
        return (
          <SheetClose asChild key={link.route}>
            <Link
              href={link.route}
              className={`${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-dark300_light900"
              }
            relative flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              {newFollowRequests !== 0 &&
                newFollowRequests !== null &&
                link.label === "Chats" && (
                  <Badge className="absolute right-0  top-0 bg-primary-500 text-light-900">
                    {newFollowRequests}
                  </Badge>
                )}
              {newEmergencies !== null &&
                newEmergencies !== undefined &&
                newEmergencies.length !== 0 &&
                link.label === "Alerts" && (
                  <Badge className="absolute right-0 top-0 flex items-center gap-2 bg-transparent text-red-600">
                    <AlertCircle className="" />
                    {newEmergencies.length}
                  </Badge>
                )}
              <Image
                src={link.imgURL}
                alt={link.label}
                width={20}
                height={20}
                className={`${isActive ? "" : "invert-colors"}`}
              />
              <p className={`${isActive ? "base-bold" : "base-medium"}`}>
                {link.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/assets/icons/burger.svg"
          width={36}
          height={36}
          alt="menu"
          className="invert-colors sm:hidden"
        ></Image>
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="background-light900_dark200 border-none"
      >
        <Link href="/" className="flex flex-row gap-2">
          <Image
            src="/assets/icons/logo.svg"
            width={23}
            height={23}
            alt="DevFlow"
          ></Image>
          <p className="h2-bold text-dark100_light900 font-spaceGrotesk">
            Crisis <span className="text-primary-500">Compass</span>
          </p>
        </Link>
        <div className="h-4/5">
          <SheetClose asChild>
            <NavContent />
          </SheetClose>
          <SignedOut>
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <Link href="/login">
                  <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                    <span className="text-primary-500">Log In</span>
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/register">
                  <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                    <span className="text-primary-500">Sign Up</span>
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SignedOut>
          <SignedIn>
            <SheetClose asChild>
              <SignOutButton>
                <Button className="small-medium btn-secondary min-h-[41px] w-full gap-3 rounded-lg px-4 py-3 shadow-none">
                  <span className="text-primary-500">Logout</span>
                  <HiOutlineLogout size={16} color="red" />
                </Button>
              </SignOutButton>
            </SheetClose>
          </SignedIn>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
