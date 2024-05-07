import { SignedIn, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";
import Theme from "./Theme";

const NavBar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/assets/icons/logo.svg"
          width={23}
          height={23}
          alt="Crisis Compass"
        ></Image>
        <p className="h2-bold text-dark100_light900 font-spaceGrotesk max-sm:hidden">
          Crisis <span className="text-primary-500">Compass</span>
        </p>
      </Link>
      <div className="flex-between gap-5">
        <Theme />
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#AE38D6",
              },
              baseTheme: dark,
            }}
          />
          {/* {(sessionClaims?.membership as Record<string, string>) && (
            <OrganizationSwitcher
              appearance={{
                baseTheme: dark,
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
            />
          )} */}
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  );
};

export default NavBar;
