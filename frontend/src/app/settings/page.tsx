import type { Metadata } from "next";
import { SettingsPage } from "@/features/settings";

export const metadata: Metadata = {
  title: "Settings | KisanGPT",
  description: "Personalize your KisanGPT farming assistant experience",
};

export default function SettingsRoute() {
  return <SettingsPage />;
}
