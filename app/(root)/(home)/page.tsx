"use client";

import FAQ from "@/components/Home/FAQ";
import Features from "@/components/Home/Features";
import Footer from "@/components/Home/Footer";
import Hero from "@/components/Home/Hero";
import { api } from "@/convex/_generated/api";
import { registerServiceWorker } from "@/lib/serviceWorker";
import { useMutation } from "convex/react";
import { useEffect } from "react";

export default function Home() {
  const userStore = useMutation(api.users.store);
  useEffect(() => {
    userStore({});
  });

  useEffect(() => {
    async function setUpServiceWorker() {
      try {
        await registerServiceWorker();
      } catch (error) {
        console.error(error);
      }
    }
    setUpServiceWorker();
  }, []);
  return (
    <>
      <div className="home-container">
        <Hero />
        <Features />
        <FAQ />
        <Footer />
      </div>
    </>
  );
}
