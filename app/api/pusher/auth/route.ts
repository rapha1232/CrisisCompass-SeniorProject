import { getPusherInstance } from "@/lib/pusher/server";
import * as PusherPushNotifications from "@pusher/push-notifications-web";

const beamsClient = new PusherPushNotifications.Client({
  instanceId: "ee0c4547-d86d-4d77-b268-ded3c3c9e7bf",
});

beamsClient.start().then(() => {
  console.log("Beams client started");
});

const pusherServer = getPusherInstance();

export async function POST(req: Request) {
  console.log("authenticating pusher perms...");
  const data = await req.text();
  const [socketId, channelName] = data
    .split("&")
    .map((str) => str.split("=")[1]);

  // logic to check user permissions
  const authResponse = pusherServer.authorizeChannel(socketId, channelName);
  return new Response(JSON.stringify(authResponse));
}
