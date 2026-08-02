import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/Spinner";

const VoicePage = dynamic(
  () => import("@/features/voice").then((m) => m.VoicePage),
  {
    loading: () => (
      <div className="ds-page flex items-center justify-center">
        <Spinner size="md" />
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Voice Assistant | KisanGPT",
  description:
    "Multilingual voice assistant for hands-free farming queries in Hindi, English, and regional languages.",
};

export default function VoiceRoute() {
  return <VoicePage />;
}
