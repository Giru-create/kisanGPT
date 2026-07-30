import type { Metadata } from "next";
import { VoicePage } from "@/features/voice";

export const metadata: Metadata = {
  title: "KisanGPT | Voice Assistant",
  description:
    "Multilingual voice assistant for hands-free farming queries in Hindi, English, and regional languages.",
};

export default function VoiceRoute() {
  return <VoicePage />;
}
