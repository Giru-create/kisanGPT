import type { Metadata } from "next";
import { MarketPage } from "@/features/market";

export const metadata: Metadata = {
  title: "KisanGPT | Market Intelligence",
  description:
    "Real-time mandi prices, commodity trends, and AI-powered market insights for Indian farmers.",
};

export default function MarketRoute() {
  return <MarketPage />;
}
