"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ForecastStrip.tsx
// KisanGPT — 7-day forecast container
//
// Mobile: horizontally scrollable strip with scroll-snap.
// md+: wraps into a flex-wrap grid.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { ForecastDayCard } from "./ForecastDayCard";
import type { ForecastDay, TemperatureUnit } from "../types/weather.types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ForecastStripProps {
  forecast: ForecastDay[];
  unit: TemperatureUnit;
  convertTemp: (c: number) => number;
  unitSymbol: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const ForecastStrip: React.FC<ForecastStripProps> = ({
  forecast,
  convertTemp,
  unitSymbol,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <motion.section
      role="region"
      aria-label="7-day weather forecast"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays size={16} className="text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">
          7-Day Forecast
        </h2>
      </div>

      {/* Scroll container — horizontal on mobile, wraps on md+ */}
      <div
        className="flex gap-2.5 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible snap-x snap-mandatory scroll-smooth"
        // Accessible scrollable region
        role="list"
        aria-label="Daily forecast tiles"
        // Hide scrollbar but keep scrollability
        style={{ scrollbarWidth: "none" }}
      >
        {forecast.map((day, i) => {
          const dayDate = new Date(day.date);
          dayDate.setHours(0, 0, 0, 0);
          const isToday = dayDate.getTime() === today.getTime();

          return (
            <div key={i} className="snap-start" role="listitem">
              <ForecastDayCard
                day={day}
                isToday={isToday}
                animationIndex={i}
                convertTemp={convertTemp}
                unitSymbol={unitSymbol}
              />
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};

ForecastStrip.displayName = "ForecastStrip";
