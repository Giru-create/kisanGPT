import type { Metadata } from "next";
import { ProfilePage } from "@/features/profile";

export const metadata: Metadata = {
  title: "Farmer Profile | KisanGPT",
  description:
    "View and manage your farmer profile, farm details, AI personalization, achievements, and privacy settings.",
};

export default function ProfileRoute() {
  return <ProfilePage />;
}
