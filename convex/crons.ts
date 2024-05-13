import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "clear resolved emergencies",
  { hours: 24 }, // every day
  internal.broadcasts.clearResolvedEmergencies
);

export default crons;
