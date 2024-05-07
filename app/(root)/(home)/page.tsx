"use client";

import FAQ from "@/components/Home/FAQ";
import Features from "@/components/Home/Features";
import Footer from "@/components/Home/Footer";
import Hero from "@/components/Home/Hero";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect } from "react";

export default function Home() {
  const store = useMutation(api.users.store);

  useEffect(() => {
    store({});
  });
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
