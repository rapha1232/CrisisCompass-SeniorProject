import { Agent } from "http";

export const requestRetryMinTimeout = 1000;

export type ExpoClientOptions = {
  httpAgent?: Agent;
  maxConcurrentRequests?: number;
  accessToken?: string;
  useFcmV1?: boolean;
};

export type ExpoPushToken = string;

export type ExpoPushMessage = {
  to: ExpoPushToken | ExpoPushToken[];
  data?: object;
  title?: string;
  subtitle?: string;
  body?: string;
  sound?:
    | "default"
    | null
    | {
        critical?: boolean;
        name?: "default" | null;
        volume?: number;
      };
  ttl?: number;
  expiration?: number;
  priority?: "default" | "normal" | "high";
  badge?: number;
  channelId?: string;
  categoryId?: string;
  mutableContent?: boolean;
};

export type ExpoPushReceiptId = string;

export type ExpoPushSuccessTicket = {
  status: "ok";
  id: ExpoPushReceiptId;
};

export type ExpoPushSuccessReceipt = {
  status: "ok";
  details?: object;
  // Internal field used only by developers working on Expo
  __debug?: any;
};

export type ExpoPushErrorReceipt = {
  status: "error";
  message: string;
  details?: {
    error?:
      | "DeveloperError"
      | "DeviceNotRegistered"
      | "ExpoError"
      | "InvalidCredentials"
      | "MessageRateExceeded"
      | "MessageTooBig"
      | "ProviderError";
  };
  // Internal field used only by developers working on Expo
  __debug?: any;
};

export type ExpoPushErrorTicket = ExpoPushErrorReceipt;
export type ExpoPushTicket = ExpoPushSuccessTicket | ExpoPushErrorTicket;
export type ExpoPushReceipt = ExpoPushSuccessReceipt | ExpoPushErrorReceipt;
