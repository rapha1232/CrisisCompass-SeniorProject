"use client";

import { FollowRequest } from "@/components/followers/FollowRequest";
import { Loading } from "@/components/Global/loading";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const Page = () => {
  const requests = useQuery(api.requests.get);

  return (
    <main className="h-[calc(100vh-96px)] background-light700_dark300 ">
      <h1 className="text-4xl font-bold w-full text-center py-12 text-gray-100">
        Incoming Follow Requests
      </h1>
      <div>
        {requests === null && <Loading />}
        {requests?.length === 0 && (
          <h3 className="text-xl font-bold w-full text-center py-12 text-gray-100">
            No Requests Found
          </h3>
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
    </main>
  );
};

export default Page;
