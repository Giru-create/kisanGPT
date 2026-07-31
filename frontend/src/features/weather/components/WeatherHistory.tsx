"use client";

// ─────────────────────────────────────────────────────────────────────────────
// WeatherHistory.tsx
// KisanGPT — Recent weather trends chart
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { motion } from "framer-motion";
import { History, CloudRain, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  WeatherHistoryDay,
  TemperatureUnit,
} from "../types/weather.types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface WeatherHistoryProps {
  history: WeatherHistoryDay[];
  unit: TemperatureUnit;
  convertTemp: (c: number) => number;
  unitSymbol: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDay(date: Date): string {
  return SHORT_DAYS[date.getDay()] ?? "";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const WeatherHistory: React.FC<WeatherHistoryProps> = ({
  history,
  convertTemp,
}) => {
  if (history.length === 0) return null;

  // Calculate ranges
  const allHighs = history.map((d) => d.highC);
  const allLows = history.map((d) => d.lowC);
  const maxTemp = Math.max(...allHighs);
  const minTemp = Math.min(...allLows);
  const tempRange = maxTemp - minTemp || 1;

  const maxRainfall = Math.max(...history.map((d) => d.rainfall), 1);

  // Calculate averages
  const avgHigh = Math.round(
    allHighs.reduce((a, b) => a + b, 0) / allHighs.length,
  );
  const avgLow = Math.round(
    allLows.reduce((a, b) => a + b, 0) / allLows.length,
  );
  const totalRainfall = history.reduce((a, b) => a + b.rainfall, 0);

  return (
    <motion.section
      role="region"
      aria-label="Weather history"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <History size={16} className="text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">Last 7 Days</h2>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="text-center p-2.5 rounded-xl bg-muted/50">
          <Thermometer size={14} className="mx-auto mb-1 text-orange-500" />
          <p className="text-lg font-bold text-foreground">
            {convertTemp(avgHigh)}°
          </p>
          <p className="text-[10px] text-muted-foreground">Avg High</p>
        </div>
        <div className="text-center p-2.5 rounded-xl bg-muted/50">
          <Thermometer size={14} className="mx-auto mb-1 text-blue-500" />
          <p className="text-lg font-bold text-foreground">
            {convertTemp(avgLow)}°
          </p>
          <p className="text-[10px] text-muted-foreground">Avg Low</p>
        </div>
        <div className="text-center p-2.5 rounded-xl bg-muted/50">
          <CloudRain size={14} className="mx-auto mb-1 text-blue-400" />
          <p className="text-lg font-bold text-foreground">
            {totalRainfall}
            <span className="text-xs font-normal">mm</span>
          </p>
          <p className="text-[10px] text-muted-foreground">Total Rain</p>
        </div>
      </div>

      {/* Temperature chart */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Thermometer
            size={14}
            className="text-orange-500"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold text-muted-foreground">
            Temperature
          </span>
        </div>
        <div className="space-y-1.5">
          {history.map((day, i) => {
            const lowOffset = ((day.lowC - minTemp) / tempRange) * 100;
            const highOffset = ((day.highC - minTemp) / tempRange) * 100;
            const barWidth = highOffset - lowOffset;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center gap-2"
              >
                <span className="w-8 text-[10px] text-muted-foreground text-right">
                  {formatDay(day.date)}
                </span>
                <span className="text-[10px] text-muted-foreground w-6 text-right">
                  {convertTemp(day.lowC)}°
                </span>
                <div className="flex-1 h-2.5 rounded-full bg-muted relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0, left: `${lowOffset}%` }}
                    animate={{
                      width: `${barWidth}%`,
                      left: `${lowOffset}%`,
                    }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className={cn(
                      "absolute h-full rounded-full",
                      day.highC >= 35
                        ? "bg-gradient-to-r from-orange-400 to-orange-500"
                        : day.highC >= 30
                          ? "bg-gradient-to-r from-amber-400 to-amber-500"
                          : "bg-gradient-to-r from-emerald-400 to-emerald-500",
                    )}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground w-6">
                  {convertTemp(day.highC)}°
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Rainfall chart */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CloudRain size={14} className="text-blue-500" aria-hidden="true" />
          <span className="text-xs font-semibold text-muted-foreground">
            Rainfall
          </span>
        </div>
        <div className="flex gap-1.5 items-end h-16">
          {history.map((day, i) => {
            const height = Math.max(4, (day.rainfall / maxRainfall) * 100);

            return (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={cn(
                  "flex-1 rounded-t-md relative group",
                  day.rainfall > 10
                    ? "bg-blue-500"
                    : day.rainfall > 5
                      ? "bg-blue-400"
                      : day.rainfall > 0
                        ? "bg-blue-300"
                        : "bg-muted",
                )}
                aria-label={`${formatDay(day.date)}: ${day.rainfall}mm rainfall`}
              >
                {day.rainfall > 0 && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.rainfall}mm
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
        <div className="flex gap-1.5 mt-1">
          {history.map((day, i) => (
            <span
              key={i}
              className="flex-1 text-center text-[9px] text-muted-foreground"
            >
              {formatDay(day.date).slice(0, 2)}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

WeatherHistory.displayName = "WeatherHistory";
