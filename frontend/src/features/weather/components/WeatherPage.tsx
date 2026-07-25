"use client";

// ─────────────────────────────────────────────────────────────────────────────
// WeatherPage.tsx
// KisanGPT — Weather Intelligence top-level page assembly
//
// Orchestrates all weather components and drives state-based rendering:
//   idle / loading → WeatherSkeleton
//   success        → CurrentWeatherCard + ForecastStrip + FarmingRecommendationCard
//   error          → WeatherError
//
// Location === null → WeatherEmpty (no location set yet)
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Thermometer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useWeather } from "../hooks/useWeather";
import { CurrentWeatherCard } from "./CurrentWeatherCard";
import { ForecastStrip } from "./ForecastStrip";
import { FarmingRecommendationCard } from "./FarmingRecommendationCard";
import { WeatherSkeleton } from "./WeatherSkeleton";
import { WeatherError } from "./WeatherError";
import { WeatherEmpty } from "./WeatherEmpty";
import { selectLocation } from "../store/weatherStore";
import { useWeatherStore } from "../store/weatherStore";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const WeatherPage: React.FC = () => {
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

  // ── No location set yet ──────────────────────────────────────────────────
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
        {(weatherState.status === "idle" || weatherState.status === "loading") && (
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
            className="flex flex-col gap-4"
          >
            <CurrentWeatherCard
              current={weatherState.data.current}
              location={weatherState.data.location}
              unit={unit}
              convertTemp={convertTemp}
              unitSymbol={unitSymbol}
              relativeTime={relativeTime}
              onRefresh={refresh}
            />

            <ForecastStrip
              forecast={weatherState.data.forecast}
              unit={unit}
              convertTemp={convertTemp}
              unitSymbol={unitSymbol}
            />

            <FarmingRecommendationCard
              recommendation={weatherState.data.recommendation}
              onChatRedirect={(payload) => {
                // TODO: navigate to /chat with payload pre-filled in a later milestone
                console.info("[WeatherPage] chat redirect payload:", payload);
              }}
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
  <main className="min-h-screen bg-background">
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Weather Intelligence
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time conditions for your farm
          </p>
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
  </main>
);
