import { SidebarLink } from "@/types";

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/chats.svg",
    route: "/chats",
    label: "Chats",
  },
  {
    imgURL: "/assets/icons/maps.svg",
    route: "/maps",
    label: "Maps",
  },
  {
    imgURL: "/assets/icons/Alerts.svg",
    route: "/alers",
    label: "Alerts",
  },
];

export const themes = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];
