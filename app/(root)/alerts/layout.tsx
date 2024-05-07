import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{}>;

const layout = ({ children }: Props) => {
  return (
    <div className="size-full items-center justify-center gap-4 pt-24">
      {children}
    </div>
  );
};

export default layout;
