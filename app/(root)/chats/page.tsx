"use client";

import { ChatList } from "@/components/chats/sidebar/ChatList";
import { Search } from "@/components/chats/sidebar/Search";
import CreateGroupDialog from "@/components/dialogs/CreateGroupDialog";
import FollowUserDialog from "@/components/followers/FollowUserDialog";

const RoomsPage = () => {
  return (
    <div className="background-light700_dark300 relative h-full flex-1 border-r border-accent-purple">
      <span className="flex w-full flex-row items-center justify-between">
        <div className="m-2 flex flex-row items-center p-0">
          <span className="text-dark100_light900">Create a Group</span>
          <CreateGroupDialog />
        </div>
        <FollowUserDialog />
      </span>
      <Search />
      <ChatList />
      {/* <CustomRingingCall /> */}
    </div>
  );
};

export default RoomsPage;
