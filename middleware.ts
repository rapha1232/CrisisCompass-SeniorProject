import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const protectedRoute = createRouteMatcher([
  "/alerts",
  "/chats(.*)",
  "/chats",
  "/maps",
  "/maps(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (protectedRoute(req)) auth().protect();
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/chats(.*)",
    "/api-get-token",
    "/api/register-push",
  ],
};
