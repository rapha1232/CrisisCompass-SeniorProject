import { PropsWithChildren } from "react";
import { Card } from "../ui/card";

type Props = PropsWithChildren<{}>;

const ChatContainer = ({ children }: Props) => {
  return (
    <Card className="flex size-full flex-col gap-2 border-none p-2 outline-none">
      {children}
    </Card>
  );
};

export default ChatContainer;
