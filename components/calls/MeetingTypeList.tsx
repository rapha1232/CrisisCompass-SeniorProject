"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationState } from "@/hooks/useMutationState";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import MeetingDialog from "../dialogs/MeetingDialog";
import VideoCallButton from "./VideoCallButton";

const initialValues = {
  dateTime: new Date(),
  description: "",
  link: "",
};

interface Props {
  chatId: Id<"chats">;
}

const MeetingTypeList = ({ chatId }: Props) => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    "isVideoCall" | "isVoiceCall" | undefined
  >(undefined);
  const [values] = useState(initialValues);
  const [, setCallDetail] = useState<Call>();
  const client = useStreamVideoClient();
  const user = useQuery(api.users.getCurrentUser);
  const { mutate: createCall } = useMutationState(api.message.create);

  const createVideoCall = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast("Please select a date and time");
        return;
      }
      const id = uuidv4();
      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create meeting");
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Video Call";
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetail(call);
      if (!values.description) {
        router.push(`call/${call.id}`);
      }
      createCall({ type: "videoCall", chatId, content: [id] })
        .then(() => toast.success("Meeting Created"))
        .catch((err) =>
          toast.error(
            err instanceof ConvexError ? err.data : "Unexpected Error Occured"
          )
        );
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create Meeting"
      );
    }
  };

  return (
    <section className="mr-2 grid grid-cols-1">
      <VideoCallButton
        tooltip="Start a call"
        handleClick={() => setMeetingState("isVideoCall")}
      />

      <MeetingDialog
        isOpen={meetingState === "isVideoCall"}
        onClose={() => setMeetingState(undefined)}
        title="Start a call"
        className="text-center"
        buttonText="Start Call"
        handleClick={createVideoCall}
      />
    </section>
  );
};

export default MeetingTypeList;
