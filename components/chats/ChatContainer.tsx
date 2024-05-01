import { Card } from "../ui/card";

type Props = React.PropsWithChildren<{}>;

const ChatContainer = ({ children }: Props) => {
  return (
    <Card className="size-full p-2 flex flex-col gap-2 outline-none border-none">
      {children}
    </Card>
  );
};

export default ChatContainer;
