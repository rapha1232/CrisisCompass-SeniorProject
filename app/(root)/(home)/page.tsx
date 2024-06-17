"use client";
import {
  ClientContact,
  ClientFAQ,
  ClientFeatures,
  ClientFooter,
  ClientHero,
} from "@/components/dynamicExport";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect } from "react";

export default function Home() {
  const userStore = useMutation(api.users.store);
  useEffect(() => {
    userStore({});
  });

  return (
    <>
      <div className="home-container">
        {/* 
        For unknown reasons, "window" was being called while rendering on 
        the server side, so dynamic CSR was used until the cause for the 
        error is discovered 
        */}
        <ClientHero />
        <ClientFeatures />
        <ClientFAQ />
        <ClientContact />
        <ClientFooter />
      </div>
    </>
  );
}
