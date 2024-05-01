interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="h-full">
      <main className="flex size-full">
        <div className="size-full">{children}</div>
      </main>
    </div>
  );
}
