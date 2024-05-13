"use client";
import { api } from "@/convex/_generated/api";
import { useMutationState } from "@/hooks/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loading } from "../Global/loading";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { FollowRequest } from "./FollowRequest";

const FollowUserSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field can't be empty." })
    .email("Please enter a valid email."),
});

const FollowUserDialog = () => {
  const { mutate: createRequest, pending } = useMutationState(
    api.request.create
  );
  const newFollowRequests = useQuery(api.requests.count);
  const form = useForm<z.infer<typeof FollowUserSchema>>({
    resolver: zodResolver(FollowUserSchema),
    defaultValues: {
      email: "",
    },
  });
  const handleSubmit = async (values: z.infer<typeof FollowUserSchema>) => {
    await createRequest({ email: values.email })
      .then(() => {
        form.reset();
        toast.success("Request sent successfully!");
      })
      .catch((error) => {
        console.log("error");
        toast.error(
          error instanceof ConvexError ? error.data : "Unexpected error occured"
        );
      });
  };
  const requests = useQuery(api.requests.get);
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger>
          <Button size={"icon"} className="mr-2">
            <DialogTrigger>
              {newFollowRequests !== null &&
                newFollowRequests !== undefined &&
                newFollowRequests !== 0 && (
                  <Badge className="absolute right-0 top-0 bg-green-500 text-light-900">
                    {newFollowRequests}
                  </Badge>
                )}
              <UserPlus className="text-dark100_light900" />
            </DialogTrigger>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="background-light700_dark300 border-none outline-none">
          <p className="text-dark100_light900">Add friend</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="text-dark100_light900 background-light700_dark300 border-none outline-none">
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Send a request to connect with your fellow responders.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      id="email"
                      placeholder="Email..."
                      className="text-black"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={pending}
                className="w-full bg-primary-500"
              >
                Send Request
              </Button>
            </DialogFooter>
          </form>
        </Form>
        <div className="w-full border" />
        <div className="background-light700_dark300 ">
          <h5 className="w-full text-center text-xl font-bold text-gray-100">
            Incoming Follow Requests
          </h5>
          <div>
            {requests === null && <Loading />}
            {requests?.length === 0 && (
              <h6 className="w-full py-4 text-center text-xs font-bold text-gray-100">
                No Requests Found
              </h6>
            )}
            {requests?.length !== 0 &&
              requests?.map((request) => (
                <FollowRequest
                  key={request.request._id}
                  otherUser={request.sender}
                  id={request.request._id}
                />
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowUserDialog;
