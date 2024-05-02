"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { useMutationState } from "@/hooks/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { CirclePlus, X } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {};

const CreateGroupSchema = z.object({
  name: z.string().min(1, { message: "The group needs a name." }),
  members: z
    .string()
    .array()
    .min(1, { message: "You must select at least 1 follower." }),
});
const CreateGroupDialog = (props: Props) => {
  const followers = useQuery(api.followers.get);
  const { mutate: createGroup, pending } = useMutationState(
    api.followers.createGroup
  );
  const form = useForm<z.infer<typeof CreateGroupSchema>>({
    resolver: zodResolver(CreateGroupSchema),
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = form.watch("members", []);
  const unselectedFollowers = useMemo(() => {
    return followers
      ? followers.filter((follower) => !members.includes(follower._id))
      : [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members.length, followers?.length]);

  const handleSubmit = async (values: z.infer<typeof CreateGroupSchema>) => {
    await createGroup({
      name: values.name,
      members: values.members,
    })
      .then(() => {
        form.reset();
        toast.success("Group created successfully");
      })
      .catch((err) =>
        toast.error(
          err instanceof ConvexError ? err.data : "Unexpected error occured"
        )
      );
  };
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger className="border-none outline-none">
          <Button size={"icon"}>
            <DialogTrigger asChild className="border-none outline-none">
              <CirclePlus className="text-dark100_light900" />
            </DialogTrigger>
            <TooltipContent className="background-light700_dark300 outline-none border-none text-dark100_light900">
              <p>Create Group</p>
            </TooltipContent>
            <DialogContent className="outline-none border-none background-light700_dark300 text-dark100_light900 ">
              <DialogHeader>
                <DialogTitle>CreateGroup</DialogTitle>
                <DialogDescription>
                  Add your friends to get started!
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Group's name"
                              {...field}
                              className="text-dark900_light100 bg-light-800"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="members"
                    render={() => {
                      return (
                        <FormItem>
                          <FormLabel>Followers</FormLabel>
                          <FormControl>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                disabled={unselectedFollowers.length === 0}
                              >
                                <Button className="w-full bg-dark-400 border-none">
                                  Select
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-full">
                                {unselectedFollowers.map((follower, i) => (
                                  <DropdownMenuCheckboxItem
                                    key={i}
                                    className="flex items-center gap-2 w-full p-2 background-light700_dark400 text-dark100_light900 outline-none"
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        form.setValue("members", [
                                          ...members,
                                          follower._id,
                                        ]);
                                      }
                                    }}
                                  >
                                    <Avatar className="size-8">
                                      <AvatarImage src={follower.imageURL} />
                                      <AvatarFallback>
                                        {follower.fullname.substring(0, 1)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <h4 className="truncate">
                                      {follower.fullname}
                                    </h4>
                                  </DropdownMenuCheckboxItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  {members && members.length ? (
                    <Card className="flex items-center gap-3 overflow-x-auto w-full h-24 p-2 no-scrollbar border-none">
                      {followers
                        ?.filter((follower) => members.includes(follower._id))
                        .map((follower) => {
                          return (
                            <div
                              key={follower._id}
                              className="flex flex-col items-center gap-1"
                            >
                              <div className="relative">
                                <Avatar>
                                  <AvatarImage src={follower.imageURL} />
                                  <AvatarFallback>
                                    {follower.fullname.substring(0, 1)}
                                  </AvatarFallback>
                                </Avatar>
                                <X
                                  className="size-4 absolute bottom-8 left-7 rounded-full cursor-pointer"
                                  onClick={() =>
                                    form.setValue(
                                      "members",
                                      members.filter(
                                        (id) => id !== follower._id
                                      )
                                    )
                                  }
                                />
                              </div>
                              <p className="truncate text-sm">
                                {follower.fullname.split(" ")[0]}
                              </p>
                            </div>
                          );
                        })}
                    </Card>
                  ) : null}
                  <DialogFooter>
                    <Button
                      disabled={pending}
                      type="submit"
                      className="bg-primary-500"
                    >
                      Create
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Button>
        </TooltipTrigger>
      </Tooltip>
    </Dialog>
  );
};

export default CreateGroupDialog;
