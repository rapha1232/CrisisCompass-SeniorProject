"use client";

import FollowUserDialog from "@/components/followers/FollowUserDialog";
import CreateGroupDialog from "../dialogs/CreateGroupDialog";
import { ChatList } from "./ChatList";
import { Search } from "./Search";

export const Sidebar = () => {
  return (
    <div className="flex-1 background-light700_dark300 relative border-r border-accent-purple ">
      <span className="flex flex-row items-center justify-between w-full">
        <div className="p-0 m-2 flex flex-row items-center">
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
