// ─────────────────────────────────────────────────────────────────────────────
// app/dashboard/page.tsx
// KisanGPT — Farmer Dashboard route entry point
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { FarmerDashboard } from "@/features/dashboard";

export const metadata: Metadata = {
  title: "Farmer Dashboard | KisanGPT",
  description:
    "Your unified agricultural AI dashboard: real-time weather, crop health diagnostics, APMC Mandi prices, and government schemes.",
};

export default function DashboardRoute() {
  return <FarmerDashboard />;
}
