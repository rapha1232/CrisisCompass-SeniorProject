"use client";

import { pusherClient } from "@/lib/pusher/client";
import { Message } from "@/types/Messages";
import { useEffect, useState } from "react";

interface MessageListProps {}

export default function MessageList({}: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const channel = pusherClient
      .subscribe("private-chat")
      .bind("evt::test", (data: any) => {
        setMessages([...messages, data]);
      });
    console.log(messages);
    return () => {
      channel.unbind();
    };
  }, [messages]);

  const handleTestClick = async () => {
    try {
      console.log(text);
      let data = await fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });
      setText("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col">
      <input
        className="w-[240px] bg-white hover:bg-slate-200 border-black border-2 rounded p-2 m-2"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Message"
      />
      <button
        className="w-[240px] bg-slate-600 hover:bg-slate-500 rounded p-2 m-2"
        onClick={() => handleTestClick()}
      >
        Test
      </button>

      <div>
        {messages.map((message: any) => (
          <div
            className="border border-slate-600 rounded p-2 m-2"
            key={message.date}
          >
            {message.message}
            <br />
            {message.date}
            <br />
            {message.user}
          </div>
        ))}
      </div>
    </div>
  );
}
