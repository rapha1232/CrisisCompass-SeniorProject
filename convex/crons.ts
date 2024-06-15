import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "clear resolved emergencies",
  { hours: 24 }, // every day
  internal.broadcasts.clearResolvedEmergencies
);

crons.interval(
  "delete empty groups",
  { hours: 24 }, // every day
  internal.chat.cronDeleteGroup
);

export default crons;
