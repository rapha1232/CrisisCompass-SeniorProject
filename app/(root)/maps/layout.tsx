import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{}>;

const layout = ({ children }: Props) => {
  return (
    <main className="flex size-full pt-[5.5rem]">
      <div className="size-full">{children}</div>
    </main>
  );
};

export default layout;
