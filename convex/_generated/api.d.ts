/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.11.0.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as broadcasts from "../broadcasts.js";
import type * as chat from "../chat.js";
import type * as chats from "../chats.js";
import type * as crons from "../crons.js";
import type * as files from "../files.js";
import type * as follower from "../follower.js";
import type * as followers from "../followers.js";
import type * as message from "../message.js";
import type * as messages from "../messages.js";
import type * as organizations from "../organizations.js";
import type * as request from "../request.js";
import type * as requests from "../requests.js";
import type * as skills from "../skills.js";
import type * as users from "../users.js";
import type * as _utils from "../_utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  broadcasts: typeof broadcasts;
  chat: typeof chat;
  chats: typeof chats;
  crons: typeof crons;
  files: typeof files;
  follower: typeof follower;
  followers: typeof followers;
  message: typeof message;
  messages: typeof messages;
  organizations: typeof organizations;
  request: typeof request;
  requests: typeof requests;
  skills: typeof skills;
  users: typeof users;
  _utils: typeof _utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
