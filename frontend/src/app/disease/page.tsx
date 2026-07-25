// ─────────────────────────────────────────────────────────────────────────────
// app/disease/page.tsx
// KisanGPT — /disease route entry point
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { DiseaseDetectionPage } from "@/features/disease";

// ---------------------------------------------------------------------------
// SEO metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Crop Disease Detection | KisanGPT",
  description:
    "Upload a photo of your crop to identify diseases and get AI-powered treatment recommendations.",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DiseaseRoute() {
  return <DiseaseDetectionPage />;
}
