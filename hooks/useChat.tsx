"use client";
import { useParams } from "next/navigation";

export const useChat = () => {
  const { chatId } = useParams();
  return chatId;
};
