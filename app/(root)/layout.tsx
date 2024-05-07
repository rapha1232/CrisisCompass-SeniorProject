import LeftSideBar from "@/components/shared/LeftSideBar";
import NavBar from "@/components/shared/NavBar/NavBar";
import RightSideBar from "@/components/shared/RightSideBar/RightSideBar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <NavBar />
      <div className="flex">
        <LeftSideBar />
        <section className="flex min-h-screen w-full flex-col">
          <div className="size-full">{children}</div>
        </section>
        <RightSideBar />
      </div>
      {/* Toaster */}
    </main>
  );
};

export default Layout;
