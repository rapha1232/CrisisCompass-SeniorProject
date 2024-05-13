import {
  CallingState,
  StreamCall,
  useCall,
  useCallStateHooks,
  useCalls,
} from "@stream-io/video-react-sdk";

// import { CustomActiveCallPanel } from "./CustomActiveCallPanel";
// import { CustomRingingCall } from "./CustomRingingCall";

export const Video = () => {
  const calls = useCalls();
  return (
    <>
      {calls.map((call) => (
        <StreamCall call={call} key={call.cid}>
          <CallPanel />
        </StreamCall>
      ))}
    </>
  );
};

// custom component that renders ringing as well as active call UI
const CallPanel = () => {
  const call = useCall();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (!call) return null;

  if (callingState === CallingState.JOINED) {
    // <CustomActiveCallPanel/>
    return null;
  } else if (
    [CallingState.RINGING, CallingState.JOINING].includes(callingState)
  ) {
    // <CustomRingingCall />
    return null;
  }

  return null;
};
