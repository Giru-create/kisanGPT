import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/Spinner";

const DiseaseDetectionPage = dynamic(
  () => import("@/features/disease").then((m) => m.DiseaseDetectionPage),
  {
    loading: () => (
      <div className="ds-page flex items-center justify-center">
        <Spinner size="md" />
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Crop Disease Detection | KisanGPT",
  description:
    "Upload a photo of your crop to identify diseases and get AI-powered treatment recommendations.",
};

export default function DiseaseRoute() {
  return <DiseaseDetectionPage />;
}
