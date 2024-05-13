"use client";

import { Loading } from "@/components/Global/loading";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import {
  AuthLoading,
  Authenticated,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({
  children,
}: ConvexClientProviderProps) => {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          logoImageUrl: "/assets/icons/logo.svg",
        },
        variables: {
          colorText: "#fff",
          colorTextOnPrimaryBackground: "#fff",
          colorTextSecondary: "#fff",
          colorPrimary: "#AE38D6",
          colorInputBackground: "#1E1E1E",
          colorInputText: "#fff",
        },
        baseTheme: dark,
      }}
    >
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <AuthLoading>
          <Loading />
        </AuthLoading>
        <Authenticated>{children}</Authenticated>
        <Unauthenticated>{children}</Unauthenticated>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
