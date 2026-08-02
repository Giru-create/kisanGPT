"use client";

// ─────────────────────────────────────────────────────────────────────────────
// WeatherPage.tsx
// KisanGPT — Weather Intelligence top-level page assembly
//
// Premium AI-powered weather experience for farmers.
// Includes: Hero, AI Recommendation, Hourly, 7-Day, Risk Alerts, Farm Impact, History
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Thermometer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useWeather } from "../hooks/useWeather";
import { CurrentWeatherCard } from "./CurrentWeatherCard";
import { HourlyForecast } from "./HourlyForecast";
import { ForecastDetail } from "./ForecastDetail";
import { FarmingRecommendationCard } from "./FarmingRecommendationCard";
import { RiskAlerts } from "./RiskAlerts";
import { FarmImpact } from "./FarmImpact";
import { WeatherHistory } from "./WeatherHistory";
import { WeatherSkeleton } from "./WeatherSkeleton";
import { WeatherError } from "./WeatherError";
import { WeatherEmpty } from "./WeatherEmpty";
import { selectLocation } from "../store/weatherStore";
import { useWeatherStore } from "../store/weatherStore";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const WeatherPage: React.FC = () => {
  const router = useRouter();
  const {
    weatherState,
    unit,
    toggleUnit,
    refresh,
    convertTemp,
    unitSymbol,
    relativeTime,
  } = useWeather();

  const location = useWeatherStore(selectLocation);

  // No location set yet
  if (weatherState.status === "idle" && !location) {
    return (
      <WeatherPageShell unit={unit} toggleUnit={toggleUnit}>
        <WeatherEmpty />
      </WeatherPageShell>
    );
  }

  return (
    <WeatherPageShell unit={unit} toggleUnit={toggleUnit}>
      <AnimatePresence mode="wait">
        {/* Loading */}
        {(weatherState.status === "idle" ||
          weatherState.status === "loading") && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <WeatherSkeleton />
          </motion.div>
        )}

        {/* Error */}
        {weatherState.status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <WeatherError message={weatherState.message} onRetry={refresh} />
          </motion.div>
        )}

        {/* Success */}
        {weatherState.status === "success" && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-5"
          >
            {/* Hero Section */}
            <CurrentWeatherCard
              current={weatherState.data.current}
              location={weatherState.data.location}
              unit={unit}
              convertTemp={convertTemp}
              unitSymbol={unitSymbol}
              relativeTime={relativeTime}
              onRefresh={refresh}
              summary={weatherState.data.summary}
            />

            {/* AI Farming Recommendation */}
            <FarmingRecommendationCard
              recommendation={weatherState.data.recommendation}
              onChatRedirect={() => {
                router.push("/advisor");
              }}
            />

            {/* Hourly Forecast */}
            <HourlyForecast
              hourly={weatherState.data.hourly}
              unit={unit}
              convertTemp={convertTemp}
              unitSymbol={unitSymbol}
            />

            {/* 7-Day Forecast with Rain Timeline and Temperature Trend */}
            <ForecastDetail
              forecast={weatherState.data.forecast}
              unit={unit}
              convertTemp={convertTemp}
              unitSymbol={unitSymbol}
            />

            {/* Risk Alerts */}
            <RiskAlerts alerts={weatherState.data.riskAlerts} />

            {/* Farm Impact */}
            <FarmImpact impacts={weatherState.data.farmImpact} />

            {/* Weather History */}
            <WeatherHistory
              history={weatherState.data.history}
              unit={unit}
              convertTemp={convertTemp}
              unitSymbol={unitSymbol}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </WeatherPageShell>
  );
};

WeatherPage.displayName = "WeatherPage";

// ---------------------------------------------------------------------------
// Shell — shared page header + layout wrapper
// ---------------------------------------------------------------------------

interface WeatherPageShellProps {
  unit: "celsius" | "fahrenheit";
  toggleUnit: () => void;
  children: React.ReactNode;
}

const WeatherPageShell: React.FC<WeatherPageShellProps> = ({
  unit,
  toggleUnit,
  children,
}) => (
  <section className="min-h-screen bg-background">
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="ds-page-title">Weather Intelligence</h1>
          <p className="ds-page-subtitle">AI-powered weather for your farm</p>
        </div>

        {/* °C / °F toggle */}
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Thermometer size={14} />}
          onClick={toggleUnit}
          aria-label={`Switch to ${unit === "celsius" ? "Fahrenheit" : "Celsius"}`}
          className="text-xs"
        >
          {unit === "celsius" ? "°C" : "°F"}
        </Button>
      </div>

      {/* Page content */}
      {children}
    </div>
  </section>
);
