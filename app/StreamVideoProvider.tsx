"use client";

import { tokenProvider } from "@/actions/stream.actions";
import { Loading } from "@/components/Global/loading";
import { api } from "@/convex/_generated/api";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useQuery } from "convex/react";
import { ReactNode, useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const user = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    try {
      if (!user) return;
      if (!API_KEY) throw new Error("Stream API key is missing");

      const client = new StreamVideoClient({
        apiKey: API_KEY,
        user: {
          id: user._id,
          name: user.username || user._id,
          image: user.imageURL,
        },
        tokenProvider,
      });

      setVideoClient(client);
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  if (!videoClient) return <Loading />;
  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
