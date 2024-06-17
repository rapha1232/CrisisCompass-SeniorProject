"use client";
import dynamic from "next/dynamic";
import { Loading } from "./Global/loading";

export const ClientMap = dynamic(
  () => import("@/components/Maps/Map").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export const ClientMapWithClick = dynamic(
  () =>
    import("@/components/Maps/MapWithClick").then((mod) => mod.MapWithClick),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export const ClientHero = dynamic(
  () => import("@/components/Home/Hero").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export const ClientFAQ = dynamic(
  () => import("@/components/Home/FAQ").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export const ClientContact = dynamic(
  () => import("@/components/Home/Contact").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export const ClientFooter = dynamic(
  () => import("@/components/Home/Footer").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export const ClientFeatures = dynamic(
  () => import("@/components/Home/Features").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
