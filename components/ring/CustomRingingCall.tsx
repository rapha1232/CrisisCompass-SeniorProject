import {
  UserResponse,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import { useEffect } from "react";
import { CallCallingStateLabel } from "./CallCallingStateLabel";
import { CallControls } from "./CallControls";
import { CallMembers } from "./CallMembers";

type RingingCallProps = {
  showMemberCount?: number;
};

export const CustomRingingCall = ({
  showMemberCount = 3,
}: RingingCallProps) => {
  const call = useCall();
  const { useCallMembers, useCallCreatedBy, useCameraState } =
    useCallStateHooks();

  const members = useCallMembers();
  const creator = useCallCreatedBy();

  const { camera, isMute: isCameraMute } = useCameraState();
  useEffect(() => {
    // enable the camera by default for all ring calls
    camera.enable();
  }, [camera]);

  if (!call) return null;

  const caller = creator;
  // show the caller if this is an incoming call or show all the users I am calling to
  let membersToShow: UserResponse[] = [];
  if (call.isCreatedByMe) {
    membersToShow =
      members
        ?.slice(0, showMemberCount)
        .map(({ user }) => user)
        .filter((u) => !!u) || [];
  } else if (caller) {
    membersToShow = [caller];
  }

  return (
    <div>
      {isCameraMute ? (
        <CallMembers members={membersToShow} />
      ) : (
        <VideoPreview />
      )}
      <CallCallingStateLabel />
      <CallControls />
    </div>
  );
};
