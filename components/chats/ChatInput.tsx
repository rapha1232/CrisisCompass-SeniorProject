import { api } from "@/convex/_generated/api";
import { useChat } from "@/hooks/useChat";
import { useMutationState } from "@/hooks/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import { LucideSend } from "lucide-react";
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

  const handleInputChange = (event: any) => {
    const { value, selectionStart } = event.target;
    if (selectionStart !== null) {
      form.setValue("content", value);
    }
  };
  return (
    <Card className="sticky bottom-2 w-full rounded-lg border-none p-2 outline-none">
      <div className="flex w-full items-end gap-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex w-full items-end gap-2"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => {
                return (
                  <FormItem className="size-full">
                    <FormControl>
                      <div className="m-0 flex flex-row gap-2 p-0">
                        <TextareaAutosize
                          onKeyDown={async (e) => {
                            if (e.key === "Enter" && !e.shiftKey && !pending) {
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
                          className="background-light700_dark300 text-dark100_light900 flex-1 resize-none rounded-md border-0 p-1.5 outline-0"
                        />
                        <Button
                          className="m-0 p-0"
                          size={"icon"}
                          onClick={async (e) => {
                            e.preventDefault();
                            await form.handleSubmit(handleSubmit)();
                          }}
                          disabled={pending}
                        >
                          <LucideSend
                            size={32}
                            className="text-dark300_light900"
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
