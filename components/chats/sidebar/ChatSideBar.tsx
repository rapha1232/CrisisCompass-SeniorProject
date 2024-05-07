"use client";

import FollowUserDialog from "@/components/followers/FollowUserDialog";
import CreateGroupDialog from "../../dialogs/CreateGroupDialog";
import { ChatList } from "./ChatList";
import { Search } from "./Search";

export const Sidebar = () => {
  return (
    <div className="background-light700_dark300 relative h-full flex-1 border-r border-accent-purple max-lg:hidden">
      <span className="flex w-full flex-row items-center justify-between">
        <div className="m-2 flex flex-row items-center p-0">
          <span className="text-dark100_light900">Create a Group</span>
          <CreateGroupDialog />
        </div>
        <FollowUserDialog />
      </span>
      <Search />
      <ChatList />
    </div>
  );
};
