import { api } from "@/convex/_generated/api";
import { useChat } from "@/hooks/useChat";
import { useMutationState } from "@/hooks/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import { LucideSend } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";

const ChatMessageSchema = z.object({
  content: z.string().min(1, { message: "Message cannot be empty" }),
});

const ChatInput = () => {
  const chatId = useChat();
  const { mutate: createMessage, pending } = useMutationState(
    api.message.create
  );

  const form = useForm<z.infer<typeof ChatMessageSchema>>({
    resolver: zodResolver(ChatMessageSchema),
    defaultValues: { content: "" },
  });

  const handleSubmit = async (values: z.infer<typeof ChatMessageSchema>) => {
    createMessage({
      chatId,
      type: "text",
      content: [values.content],
    })
      .then(() => {
        form.reset();
      })
      .catch((err) => {
        toast.error(
          err instanceof ConvexError ? err.data : "Failed to send message"
        );
      });
  };

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const handleInputChange = (event: any) => {
    const { value, selectionStart } = event.target;
    if (selectionStart !== null) {
      form.setValue("content", value);
    }
  };
  return (
    <Card className="w-full p-2 rounded-lg relative outline-none border-none">
      <div className="flex gap-2 items-end w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex gap-2 items-end w-full"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => {
                return (
                  <FormItem className="size-full">
                    <FormControl>
                      <div className="p-0 m-0 flex flex-row gap-2">
                        <TextareaAutosize
                          onKeyDown={async (e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              await form.handleSubmit(handleSubmit)();
                            }
                          }}
                          rows={1}
                          maxRows={3}
                          {...field}
                          onChange={handleInputChange}
                          onClick={handleInputChange}
                          placeholder="Your Message..."
                          className="background-light700_dark300 min-size-full flex-1 resize-none border-0 outline-0 bg-card text-dark100_light900 placeholder:text-muted-foreground p-1.5 rounded-md"
                        />
                        <Button className="p-0 m-0" size={"icon"}>
                          <LucideSend
                            size={32}
                            color="#AD38D7"
                            className="text-muted-foreground "
                            onClick={async (e) => {
                              e.preventDefault();
                              await form.handleSubmit(handleSubmit)();
                            }}
                          />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default ChatInput;
