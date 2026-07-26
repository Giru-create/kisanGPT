"use client";

// ─────────────────────────────────────────────────────────────────────────────
// WeatherSummaryWidget.tsx
// KisanGPT — Section 2: Current Weather & Agronomic Advisory Widget
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Droplets,
  Wind,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { WeatherIcon } from "@/features/weather/components/WeatherIcon";
import { Badge } from "@/components/ui/Badge";
import type { WeatherCondition } from "@/features/weather/types/weather.types";
import { WEATHER_LABELS } from "@/features/weather/constants/weather.constants";

interface WeatherSummaryWidgetProps {
  temperatureC: number;
  feelsLikeC: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeedKmh: number;
  advisory: string;
  advisorySafe: boolean;
}

export const WeatherSummaryWidget: React.FC<WeatherSummaryWidgetProps> = ({
  temperatureC,
  feelsLikeC,
  condition,
  humidity,
  windSpeedKmh,
  advisory,
  advisorySafe,
}) => {
  return (
    <motion.section
      role="region"
      aria-label="Current Weather & Spraying Advisory"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-gradient-to-br from-emerald-50/60 via-card to-sky-50/60 dark:from-emerald-950/30 dark:via-card dark:to-sky-950/20 p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Live Weather Intelligence
        </h2>
        <Link
          href="/weather"
          aria-label="View detailed 7-Day Weather Forecast"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl px-3 py-2 min-h-[48px]"
        >
          7-Day Forecast{" "}
          <ArrowUpRight size={14} className="ml-0.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Main Temperature & Icon Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <WeatherIcon condition={condition} size="xl" />
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className="text-4xl sm:text-5xl font-extrabold text-foreground tabular-nums">
                {temperatureC}°C
              </span>
              <span className="text-sm font-semibold text-muted-foreground ml-2">
                Feels {feelsLikeC}°C
              </span>
            </div>
            <span className="text-sm font-bold text-foreground">
              {WEATHER_LABELS[condition]}
            </span>
          </div>
        </div>

        {/* Quick Weather Metrics */}
        <div className="flex flex-col gap-2 text-xs text-muted-foreground text-right border-l border-border/60 pl-3">
          <span className="flex items-center justify-end gap-1.5 font-semibold text-foreground">
            <Droplets
              size={14}
              className="text-blue-500 shrink-0"
              aria-hidden="true"
            />{" "}
            {humidity}% Humidity
          </span>
          <span className="flex items-center justify-end gap-1.5 font-semibold text-foreground">
            <Wind
              size={14}
              className="text-teal-500 shrink-0"
              aria-hidden="true"
            />{" "}
            {windSpeedKmh} km/h Wind
          </span>
        </div>
      </div>

      {/* Agronomic Spraying Advisory Badge & Banner */}
      <div
        className={`flex items-start gap-3 rounded-xl p-3.5 text-xs sm:text-sm font-medium border ${
          advisorySafe
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200"
            : "bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200"
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {advisorySafe ? (
            <ShieldCheck
              size={18}
              className="text-emerald-600 dark:text-emerald-400"
              aria-hidden="true"
            />
          ) : (
            <AlertCircle
              size={18}
              className="text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">Farming Advisory:</span>
            <Badge
              variant={advisorySafe ? "success" : "warning"}
              className="text-[11px] font-bold"
            >
              {advisorySafe ? "Safe to Spray" : "Caution"}
            </Badge>
          </div>
          <p className="opacity-90 leading-relaxed">{advisory}</p>
        </div>
      </div>
    </motion.section>
  );
};

WeatherSummaryWidget.displayName = "WeatherSummaryWidget";
