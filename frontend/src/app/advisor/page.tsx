// ─────────────────────────────────────────────────────────────────────────────
// app/advisor/page.tsx
// KisanGPT — AI Advisor route entry point
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { AIAdvisor } from "@/features/advisor";

export const metadata: Metadata = {
  title: "AI Advisor | KisanGPT",
  description:
    "Get personalized farming advice powered by AI. Ask about crops, soil, market prices, and weather conditions.",
};

export default function AdvisorRoute() {
  return <AIAdvisor />;
}
