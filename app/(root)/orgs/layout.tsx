import { ReactNode } from "react";

const OrgLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="size-full items-center justify-center gap-4 pt-24">
      {children}
    </main>
  );
};

export default OrgLayout;
