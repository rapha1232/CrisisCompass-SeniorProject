"use client";

import { ChatList } from "./ChatList";
import { Search } from "./Search";

export const Sidebar = () => {
  return (
    <div className="flex-1 bg-dark-300 relative border-r border-accent-purple max-lg:hidden block">
      <Search />
      <ChatList />
    </div>
  );
};
