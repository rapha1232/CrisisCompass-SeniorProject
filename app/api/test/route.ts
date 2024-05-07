import { getPusherInstance } from "@/lib/pusher/server";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const pusherServer = getPusherInstance();
export async function POST(req: Request, res: Response) {
  try {
    const requestBody = await req.json();
    const message = requestBody?.message || "No message provided";
    const user = await currentUser();
    await pusherServer.trigger("private-chat", "evt::test", {
      message,
      user: user?.firstName,
      date: new Date(),
    });

    return NextResponse.json({ message: "Sockets tested" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to test sockets", error },
      { status: 500 }
    );
  }
}
