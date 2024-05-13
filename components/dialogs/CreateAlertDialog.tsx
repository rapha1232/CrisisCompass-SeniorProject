import { api } from "@/convex/_generated/api";
import { useMutationState } from "@/hooks/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";

import { skills } from "@/constants";
import { LatLng } from "leaflet";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { MapWithClick } from "../Maps/MapWithClick";
import { Card } from "../ui/card";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const CreateAlertSchema = z.object({
  title: z.string().min(1, { message: "Title can't be empty" }),
  description: z.string().min(1, { message: "Description can't be empty" }),
  location: z.number().array().min(1, {
    message: "You must add the location of the emergency.",
  }),
  skills: z.string().array().min(1, {
    message: "You must select at least 1 skill to alert valid volunteers.",
  }),
});

const CreateAlertDialog = () => {
  const { mutate: createAlert, pending } = useMutationState(
    api.broadcasts.create
  );

  const form = useForm<z.infer<typeof CreateAlertSchema>>({
    resolver: zodResolver(CreateAlertSchema),
    defaultValues: {
      title: "",
      description: "",
      location: [],
      skills: [],
    },
  });
  const skillsInForm = form.watch("skills", []);
  const unselectedSkills = useMemo(() => {
    return skills.filter((skill) => !skillsInForm.includes(skill));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillsInForm.length]);

  // const onAddLocation = () => {};

  const handleSubmit = async (values: z.infer<typeof CreateAlertSchema>) => {
    await createAlert({
      skills: values.skills,
      location: values.location,
      title: values.title,
      description: values.description,
    })
      .then(() => {
        form.reset();
        toast.success("Alert successfully broadcasted!");
      })
      .catch((err) =>
        toast.error(
          err instanceof ConvexError ? err.data : "Unexpected error occured"
        )
      );
  };

  const [locationFromMap, setLocationFromMap] = useState<LatLng>();

  const handleLocationFromMap = (data: LatLng) => {
    setLocationFromMap(data);
    form.setValue("location", [data.lat, data.lng]);
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger className="w-full border-none outline-none">
          <Button className="w-4/5 bg-transparent hover:bg-transparent">
            <DialogTrigger asChild className="w-full border-none outline-none">
              <Button
                className="text-dark300_light900 w-full"
                variant={"destructive"}
              >
                Broadcast an Alert
              </Button>
            </DialogTrigger>
            <TooltipContent className="background-light700_dark300 text-dark100_light900 border-none outline-none">
              <p>Broadcast an Alert</p>
            </TooltipContent>
            <DialogContent className="background-light700_dark300 no-scrollbar text-dark100_light900 overflow-scroll border-none outline-none">
              <DialogHeader>
                <DialogTitle>Broadcast an Alert</DialogTitle>
                <DialogDescription>
                  Fill the form below to broadcast an alert
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel htmlFor="title">Title</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              id="title"
                              placeholder="Title..."
                              className="text-black"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel htmlFor="description">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              id="description"
                              placeholder="Description..."
                              className="text-black"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="flex size-full flex-col items-start">
                        <FormLabel className="text-left">
                          Location: (
                          {locationFromMap
                            ? `${locationFromMap.lat}, ${locationFromMap.lng}`
                            : ""}
                          )
                        </FormLabel>
                        <FormControl className="size-full">
                          <MapWithClick
                            full
                            returnFnc={handleLocationFromMap}
                          />
                        </FormControl>
                        <FormDescription className="text-left">
                          Add the location of the emergency
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
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
                      className="my-2 w-full bg-primary-500"
                    >
                      Broadcast
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

export default CreateAlertDialog;
