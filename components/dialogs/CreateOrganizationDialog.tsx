/* eslint-disable no-unused-vars */
"use client";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutationState } from "@/hooks/useMutationState";
import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { LatLng } from "leaflet";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { MapWithClick } from "../Maps/MapWithClick";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
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

const CreateOrgSchema = z.object({
  name: z.string().min(1, { message: "Name can't be empty" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string(),
  description: z.string().min(1, { message: "Description can't be empty" }),
  location: z.number().array().min(1, {
    message: "You must add the location of your headquarters.",
  }),
  logo: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`),
});

const CreateOrganizationDialog = () => {
  const organization = useOrganization();
  const { createOrganization } = useOrganizationList();
  const user = useUser();
  const { mutate: generateUploadUrl } = useMutationState(
    api.files.generateUploadUrl
  );
  const { mutate: createOrg } = useMutationState(api.organizations.create);

  const form = useForm<z.infer<typeof CreateOrgSchema>>({
    resolver: zodResolver(CreateOrgSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      description: "",
      location: [],
      logo: undefined,
    },
  });

  const logoRef = form.register("logo");

  async function onSubmit(values: z.infer<typeof CreateOrgSchema>) {
    if (!orgId) return;

    const postUrl = await generateUploadUrl({});

    if (!postUrl) {
      return;
    }

    const fileType = values.logo[0].type;

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": fileType },
      body: values.logo[0],
    });
    const { storageId } = await result.json();

    const types = {
      "image/png": "image",
      "image/jpg": "image",
      "image/jpeg": "image",
      "application/pdf": "pdf",
      "text/csv": "csv",
    } as Record<string, Doc<"files">["type"]>;

    try {
      await createFile({
        name: values.name,
        fileId: storageId,
        orgId,
        type: types[fileType],
      });

      console.log(result);

      const oId = await createOrg({
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        description: values.description,
        location: values.location,
        logo: storageId,
      });

      if (createOrganization) {
        const o = await createOrganization({
          name: values.name,
          slug: values.name.toLowerCase().replaceAll(" ", "-"),
        });
        o.setLogo({ file: values.logo[0] });
      }

      form.reset();

      setIsFileDialogOpen(false);

      toast.success("Organization created successfully!");
    } catch (err) {
      toast.error(err instanceof ConvexError ? err.data : "An error occured");
    }
  }

  let orgId: string | undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  const createFile = useMutation(api.files.createFile);
  const [locationFromMap, setLocationFromMap] = useState<LatLng>();

  const handleLocationFromMap = (data: LatLng) => {
    setLocationFromMap(data);
    form.setValue("location", [data.lat, data.lng]);
  };
  return (
    <Dialog
      open={isFileDialogOpen}
      onOpenChange={(isOpen) => {
        setIsFileDialogOpen(isOpen);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className=" text-dark100_light900">
          Create an Organization
        </Button>
      </DialogTrigger>
      <DialogContent className="background-light700_dark300 no-scrollbar text-dark100_light900 size-full overflow-scroll border-none outline-none">
        <DialogHeader>
          <DialogTitle className="text-dark100_light900 mb-8">
            Create your organization here
          </DialogTitle>
          <DialogDescription className=" text-dark100_light900">
            Fill in the form below to create your organization
          </DialogDescription>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="text-dark100_light900 space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-black" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-black" type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-black" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-black" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex h-[300px] w-full flex-col items-start">
                    <FormLabel className="text-left">
                      Location: (
                      {locationFromMap
                        ? `${locationFromMap.lat}, ${locationFromMap.lng}`
                        : ""}
                      )
                    </FormLabel>
                    <FormControl className="size-full">
                      <MapWithClick full returnFnc={handleLocationFromMap} />
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
                name="logo"
                render={() => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        {...logoRef}
                        className="text-dark100_light900"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex gap-1"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrganizationDialog;
