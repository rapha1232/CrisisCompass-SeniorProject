import { skills } from "@/constants";
import { api } from "@/convex/_generated/api";
import { useMutationState } from "@/hooks/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { X } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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

const GetStartedSchema = z.object({
  skills: z
    .string()
    .array()
    .min(1, { message: "You must select at least 1 skill." }),
  location: z.number().array().min(1, {
    message:
      "You must approve to your location to connect you with crises in your area.",
  }),
  preferredRadius: z.number().optional(),
  approveNotifications: z.boolean({
    message:
      "You must approve notifications to get notified when someone needs help in your area.",
  }),
});

const GetStartedDialog = () => {
  const currUser = useQuery(api.users.getCurrentUser);

  const { mutate: updateUser, pending } = useMutationState(
    api.users.updateUser
  );

  const form = useForm<z.infer<typeof GetStartedSchema>>({
    resolver: zodResolver(GetStartedSchema),
    defaultValues: {
      skills: [],
      location: [],
      preferredRadius: 50,
      approveNotifications: false,
    },
  });

  const skillsInForm = form.watch("skills", []);

  const unselectedSkills = useMemo(() => {
    return skills.filter((skill) => !skillsInForm.includes(skill));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillsInForm.length]);

  const handleSubmit = async (values: z.infer<typeof GetStartedSchema>) => {
    await updateUser({
      skills: values.skills,
      location: values.location,
      preferredRadius: values.preferredRadius,
      approveNotification: values.approveNotifications,
      userId: currUser!._id,
    })
      .then(() => {
        form.reset();
        toast.success("Profile successfully updated successfully");
      })
      .catch((err) =>
        toast.error(
          err instanceof ConvexError ? err.data : "Unexpected error occured"
        )
      );
  };

  const onCheckLocation = (checked: CheckedState) => {
    if (checked) {
      navigator.geolocation.getCurrentPosition((position) => {
        form.setValue("location", [
          position.coords.latitude,
          position.coords.longitude,
        ]);
      });
    } else {
      form.setValue("location", []);
    }
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger className="border-none outline-none">
          <Button>
            <DialogTrigger asChild className="border-none outline-none">
              <Button className="text-dark100_light900 hover:bg-transparent">
                {!currUser?.location ? "Get Started" : "Edit Profile"}
              </Button>
            </DialogTrigger>
            <TooltipContent className="background-light700_dark300 text-dark100_light900 border-none outline-none">
              <p>Set up your volunteer profile</p>
            </TooltipContent>
            <DialogContent className="background-light700_dark300 text-dark100_light900 border-none outline-none ">
              <DialogHeader>
                <DialogTitle>Set Up Volunteer Profile</DialogTitle>
                <DialogDescription>
                  Welcome to Crisis Compass! Let&apos;s get started by setting
                  up your volunteer profile. This will help us connect you with
                  the right people in times of crisis.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="approveNotifications"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Email Notifications</FormLabel>
                          <FormControl>
                            <div className="flex space-x-2">
                              <Checkbox
                                id="approveNotification"
                                className="text-green-500"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <div className="grid gap-1.5 leading-none">
                                <label
                                  htmlFor="approveNotification"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Approve Email Notifications
                                </label>
                                <p className="text-sm">
                                  Get notified by mail when someone needs help
                                  in your area. If unchecked, crises will only
                                  appear in the alert tab of the website.
                                </p>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={() => {
                      return (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <div className="flex space-x-2">
                              <Checkbox
                                id="location"
                                className="text-green-500"
                                onCheckedChange={(checked) =>
                                  onCheckLocation(checked)
                                }
                              />
                              <div className="grid gap-1.5 leading-none">
                                <label
                                  htmlFor="approveNotification"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Approve Location
                                </label>
                                <p className="text-sm">
                                  Allow us to access your location to connect
                                  you with crises in your area. If unchecked,
                                  you will only see crises in the alert tab of
                                  the website. <br />
                                  <span className="italic underline">P.S</span>:
                                  This will save your current location,
                                  therefore we prefer if you do this where you
                                  would be most often
                                </p>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <div className="text-red-500">
                    Make sure you verify your phone number in your profile, you
                    wont be able to set up your profile without it
                  </div>
                  <FormField
                    control={form.control}
                    name="preferredRadius"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>
                            Preferred Radius Of Alert (in Km)
                          </FormLabel>
                          <FormControl>
                            <div className="both-center flex space-x-2">
                              <Input
                                id="preferredRadius"
                                type="number"
                                value={field.value}
                                onChange={field.onChange}
                                className="w-[90%] text-black outline-none"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="skills"
                    render={() => {
                      return (
                        <FormItem>
                          <FormLabel>Skills</FormLabel>
                          <FormControl>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                disabled={unselectedSkills.length === 0}
                              >
                                <Button className="background-light900_dark200 w-full border-none">
                                  Select
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-full">
                                {unselectedSkills.map((skill, i) => (
                                  <DropdownMenuCheckboxItem
                                    key={i}
                                    className="background-light700_dark400 text-dark100_light900 flex w-full items-center gap-2 p-2 outline-none"
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        form.setValue("skills", [
                                          ...skillsInForm,
                                          skill,
                                        ]);
                                      }
                                    }}
                                  >
                                    <h4 className="truncate">{skill}</h4>
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
                  <Card className="no-scrollbar grid h-fit w-full grid-cols-3 items-center gap-3 overflow-x-auto overflow-y-visible border-none p-2 max-sm:grid-cols-2  max-[360px]:grid-cols-1">
                    {skills
                      .filter((skill) => skillsInForm.includes(skill))
                      .map((skill, i) => {
                        return (
                          <div
                            key={i}
                            className="flex flex-col items-center justify-between gap-2 "
                          >
                            <div className="flex w-full flex-row items-center justify-between gap-2 rounded-md bg-gray-700 p-2">
                              <p className="truncate text-sm">{skill}</p>
                              <X
                                className="size-4 cursor-pointer rounded-full text-red-600"
                                onClick={() =>
                                  form.setValue(
                                    "skills",
                                    skillsInForm.filter((s) => s !== skill)
                                  )
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                  </Card>
                  <DialogFooter>
                    <Button
                      disabled={pending}
                      type="submit"
                      className="w-full bg-primary-500"
                    >
                      Update
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

export default GetStartedDialog;
