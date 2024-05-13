import StreamVideoProvider from "@/app/StreamVideoProvider";
import { Sidebar } from "@/components/chats/sidebar/ChatSideBar";
import React from "react";

interface RoomLayoutProps {
  children: React.ReactNode;
}

export default function RoomsLayout({ children }: RoomLayoutProps) {
  return (
    <StreamVideoProvider>
      <div className="h-full">
        <main className="flex size-full pt-[5.5rem]">
          <div className="lg:hidden">
            <Sidebar />
          </div>
          <div className="size-full">{children}</div>
        </main>
      </div>
    </StreamVideoProvider>
  );
}
