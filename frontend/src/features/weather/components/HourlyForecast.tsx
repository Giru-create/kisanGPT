"use client";

// ─────────────────────────────────────────────────────────────────────────────
// HourlyForecast.tsx
// KisanGPT — Hourly forecast with temperature and rain visualization
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { motion } from "framer-motion";
import { Clock, CloudRain } from "lucide-react";
import { cn } from "@/lib/utils";
import { WeatherIcon } from "./WeatherIcon";
import type {
  HourlyForecast as HourlyForecastType,
  TemperatureUnit,
} from "../types/weather.types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface HourlyForecastProps {
  hourly: HourlyForecastType[];
  unit: TemperatureUnit;
  convertTemp: (c: number) => number;
  unitSymbol: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  convertTemp,
  unitSymbol,
}) => {
  return (
    <motion.section
      role="region"
      aria-label="Hourly forecast"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">
          Hourly Forecast
        </h2>
      </div>

      {/* Scrollable hourly cards */}
      <div
        className="flex gap-2.5 overflow-x-auto pb-1 snap-x snap-mandatory scroll-smooth"
        role="list"
        aria-label="Hourly forecast tiles"
        style={{ scrollbarWidth: "none" }}
      >
        {hourly.map((hour, i) => {
          const rainHigh = hour.rainChancePercent >= 50;
          const tempHeight = Math.max(
            20,
            Math.min(80, ((hour.temperatureC - 20) / 20) * 60 + 20),
          );

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04, ease: "easeOut" }}
              className={cn(
                "flex flex-col items-center gap-1.5 snap-start",
                "min-w-[68px] rounded-xl px-2 py-3",
                "border border-border bg-card hover:bg-muted/50 transition-colors",
              )}
              role="listitem"
              aria-label={`${formatHour(hour.hour)}: ${hour.temperatureC}°C, ${hour.rainChancePercent}% rain`}
            >
              {/* Hour */}
              <span className="text-[10px] font-medium text-muted-foreground">
                {formatHour(hour.hour)}
              </span>

              {/* Icon */}
              <WeatherIcon condition={hour.condition} size="sm" />

              {/* Temperature bar */}
              <div className="w-full flex flex-col items-center">
                <span className="text-xs font-semibold text-foreground">
                  {convertTemp(hour.temperatureC)}
                  {unitSymbol}
                </span>
                <div className="w-full h-1 rounded-full bg-muted mt-1 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${tempHeight}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className={cn(
                      "h-full rounded-full",
                      hour.temperatureC >= 35
                        ? "bg-orange-500"
                        : hour.temperatureC >= 30
                          ? "bg-amber-500"
                          : hour.temperatureC >= 25
                            ? "bg-emerald-500"
                            : "bg-blue-500",
                    )}
                  />
                </div>
              </div>

              {/* Rain chance */}
              <div className="flex items-center gap-0.5">
                <CloudRain
                  size={10}
                  className={cn(
                    rainHigh ? "text-blue-500" : "text-muted-foreground",
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    rainHigh ? "text-blue-500" : "text-muted-foreground",
                  )}
                >
                  {hour.rainChancePercent}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

HourlyForecast.displayName = "HourlyForecast";
