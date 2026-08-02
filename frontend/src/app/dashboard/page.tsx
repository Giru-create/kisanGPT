import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/Spinner";

const FarmerDashboard = dynamic(
  () => import("@/features/dashboard").then((m) => m.FarmerDashboard),
  {
    loading: () => (
      <div className="ds-page flex items-center justify-center">
        <Spinner size="md" />
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Farmer Dashboard | KisanGPT",
  description:
    "Your unified agricultural AI dashboard: real-time weather, crop health diagnostics, APMC Mandi prices, and government schemes.",
};

export default function DashboardRoute() {
  return <FarmerDashboard />;
}
