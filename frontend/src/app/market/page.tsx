import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/Spinner";

const MarketPage = dynamic(
  () => import("@/features/market").then((m) => m.MarketPage),
  {
    loading: () => (
      <div className="ds-page flex items-center justify-center">
        <Spinner size="md" />
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Market Intelligence | KisanGPT",
  description:
    "Real-time mandi prices, commodity trends, and AI-powered market insights for Indian farmers.",
};

export default function MarketRoute() {
  return <MarketPage />;
}
