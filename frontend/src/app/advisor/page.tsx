import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/Spinner";

const AIAdvisor = dynamic(
  () => import("@/features/advisor").then((m) => m.AIAdvisor),
  {
    loading: () => (
      <div className="ds-page flex items-center justify-center">
        <Spinner size="md" />
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "AI Advisor | KisanGPT",
  description:
    "Get personalized farming advice powered by AI. Ask about crops, soil, market prices, and weather conditions.",
};

export default function AdvisorRoute() {
  return <AIAdvisor />;
}
