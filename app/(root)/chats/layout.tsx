import { Sidebar } from "@/components/chats/sidebar/ChatSideBar";

interface RoomLayoutProps {
  children: React.ReactNode;
}

export default function RoomLayout({ children }: RoomLayoutProps) {
  return (
    <div className="h-full">
      <main className="flex h-full pt-[5.5rem] w-full">
        <Sidebar />
        <div className="size-full">{children}</div>
      </main>
    </div>
  );
}
