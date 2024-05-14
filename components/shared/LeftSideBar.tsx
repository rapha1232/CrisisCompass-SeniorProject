"use client";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { api } from "@/convex/_generated/api";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CreateOrganizationDialog from "../dialogs/CreateOrganizationDialog";
import { Badge } from "../ui/badge";
const LeftSideBar = () => {
  const pathname = usePathname();
  const newFollowRequests = useQuery(api.requests.count);
  const newEmergencies = useQuery(api.broadcasts.getUserNewEmergencies);
  return (
    <section className="background-light900_dark200 custom-scrollbar light-border sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          return (
            <Link
              key={link.route}
              href={link.route}
              className={`${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-dark300_light900"
              }
            relative flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              {newFollowRequests !== null &&
                newFollowRequests !== undefined &&
                newFollowRequests !== 0 &&
                link.label === "Chats" && (
                  <Badge className="absolute right-0 top-0 bg-primary-500 text-light-900">
                    {newFollowRequests}
                  </Badge>
                )}
              {newEmergencies !== null &&
                newEmergencies !== undefined &&
                newEmergencies.length !== 0 &&
                link.label === "Alerts" && (
                  <>
                    <Badge className="absolute right-0 top-0 flex items-center gap-2 bg-transparent text-red-600 hover:bg-transparent  max-lg:hidden">
                      <AlertCircle className="" />
                      {newEmergencies.length}
                    </Badge>
                    <Badge className="absolute right-0 top-0 flex items-center gap-2 bg-transparent text-red-600 hover:bg-transparent lg:hidden">
                      {newEmergencies.length}
                    </Badge>
                  </>
                )}
              <Image
                src={link.imgURL}
                alt={link.label}
                width={20}
                height={20}
                className={`${isActive ? "" : "invert-colors"}`}
              />
              <p
                className={`${
                  isActive ? "base-bold" : "base-medium"
                } max-lg:hidden`}
              >
                {link.label}
              </p>
            </Link>
          );
        })}
      </div>
      <SignedOut>
        <div className="flex flex-col gap-3">
          <Link href="/login">
            <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src="/assets/icons/account.svg"
                alt="Log In"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="text-primary-500 max-lg:hidden">Log In</span>
            </Button>
          </Link>
          <Link href="/register">
            <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src="/assets/icons/register.svg"
                alt="Log In"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="text-primary-500 max-lg:hidden">Sign Up</span>
            </Button>
          </Link>
        </div>
      </SignedOut>
      <SignedIn>
        {/* <Link href="/create-organization">
          <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
            <PlusCircle className="invert-colors lg:hidden" />
            <span className="text-primary-500 max-lg:hidden">
              Create Organization
            </span>
          </Button>
        </Link> */}
        <CreateOrganizationDialog />
      </SignedIn>
    </section>
  );
};

export default LeftSideBar;
