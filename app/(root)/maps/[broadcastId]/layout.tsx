import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{}>;

const layout = ({ children }: Props) => {
  return <div className="size-full">{children}</div>;
};

export default layout;
