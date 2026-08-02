import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/Spinner";

const WeatherPage = dynamic(
  () => import("@/features/weather").then((m) => m.WeatherPage),
  {
    loading: () => (
      <div className="ds-page flex items-center justify-center">
        <Spinner size="md" />
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Weather Intelligence | KisanGPT",
  description:
    "Real-time weather conditions, 7-day forecast, and AI-powered farming advice tailored to your farm's exact location.",
};

export default function WeatherRoute() {
  return <WeatherPage />;
}
