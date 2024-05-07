import { Sidebar } from "@/components/chats/sidebar/ChatSideBar";
import React from "react";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="h-full">
      <main className="flex size-full">
        <Sidebar />
        <div className="size-full">{children}</div>
      </main>
    </div>
  );
}
