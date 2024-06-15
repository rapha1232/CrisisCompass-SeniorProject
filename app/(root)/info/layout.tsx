import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="size-full items-center justify-center gap-4 pt-[5.5rem]">
      {children}
    </main>
  );
};

export default layout;
