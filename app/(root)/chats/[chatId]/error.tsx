"use client";
import Error from "next/error";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ErrorPage({ error }: { error: Error }) {
  const router = useRouter();
  useEffect(() => {
    if (error) {
      router.push("/chats");
    }
  }, [error, router]);
}
