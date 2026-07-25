// ─────────────────────────────────────────────────────────────────────────────
// app/weather/page.tsx
// KisanGPT — /weather route entry point
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { WeatherPage } from "@/features/weather";

// ---------------------------------------------------------------------------
// SEO metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Weather Intelligence | KisanGPT",
  description:
    "Real-time weather conditions, 7-day forecast, and AI-powered farming advice tailored to your farm's exact location.",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function WeatherRoute() {
  return <WeatherPage />;
}
