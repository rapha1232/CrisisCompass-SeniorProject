import { SidebarLink } from "@/types";
import L from "leaflet";

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
    route: "/alerts",
    label: "Alerts",
  },
  {
    imgURL: "/assets/icons/organization.svg",
    route: "/orgs",
    label: "Orgs",
  },
];

export const themes = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];

export const skills = [
  "Medical",
  "Food and Water",
  "Shelter",
  "Transportation",
  "Clothing",
  "Other",
];

export const features = [
  {
    icon: "/assets/icons/user.svg",
    heading: "User Profile",
    subHeading:
      "Create and manage your personal profile for quick access to emergency services and to set up your emergency skills.",
  },
  {
    icon: "/assets/icons/chats.svg",
    heading: "Chat Logs",
    subHeading:
      "View and track all your communication history during emergencies for better coordination.",
  },
  {
    icon: "/assets/icons/maps.svg",
    heading: "Interactive Maps",
    subHeading:
      "Locate emergency situations and relief stations on a user-friendly map interface.",
  },
  {
    icon: "/assets/icons/alerts.svg",
    heading: "Broadcasts & Alerts",
    subHeading:
      "Stay informed with real-time updates and alerts about ongoing emergencies in your area.",
  },
];

export const QnA = [
  {
    answer:
      "You can update your user profile by going to the 'Profile' section in the app and selecting the 'Edit Profile' option.",
    question: "How can I update my user profile?",
  },
  {
    answer:
      "You can access the chat logs by clicking on the 'Chat Logs' section in the app menu.",
    question: "How do I access the chat logs?",
  },
  {
    answer:
      "You can view the interactive maps by navigating to the 'Maps' section in the app and selecting the desired map view.",
    question: "How can I view the interactive maps?",
  },
  {
    answer:
      "You can find information about relief stations by exploring the interactive maps and looking for designated relief station markers.",
    question: "Where can I find information about relief stations?",
  },
  {
    answer:
      "You can stay updated on emergency broadcasts and alerts by checking the 'Broadcasts &amp; Alerts' section in the app for real-time information.",
    question: "How do I stay updated on emergency broadcasts and alerts?",
  },
];

export const customMarker = new L.Icon({
  iconUrl: "/assets/icons/mapMarker.svg",
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -15],
});
export const locationMarker = new L.Icon({
  iconUrl: "/assets/icons/locationMarker.svg",
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -15],
});
