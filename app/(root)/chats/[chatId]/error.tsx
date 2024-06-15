"use client"; // Error components must be Client Components

import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  router.push("/chats");
  console.error(error);

  return null;
}
