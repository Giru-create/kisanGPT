"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ForecastDetail.tsx
// KisanGPT — Enhanced 7-day forecast with rain timeline and temperature trend
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, CloudRain, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";
import { ForecastDayCard } from "./ForecastDayCard";
import type { ForecastDay, TemperatureUnit } from "../types/weather.types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ForecastDetailProps {
  forecast: ForecastDay[];
  unit: TemperatureUnit;
  convertTemp: (c: number) => number;
  unitSymbol: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDayShort(date: Date, isToday: boolean): string {
  return isToday ? "Today" : (SHORT_DAYS[date.getDay()] ?? "");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const ForecastDetail: React.FC<ForecastDetailProps> = ({
  forecast,
  convertTemp,
  unitSymbol,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate temperature range for trend
  const allHighs = forecast.map((d) => d.highC);
  const allLows = forecast.map((d) => d.lowC);
  const maxTemp = Math.max(...allHighs);
  const minTemp = Math.min(...allLows);
  const tempRange = maxTemp - minTemp || 1;

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

      {/* Day cards - horizontal scroll on mobile, grid on desktop */}
      <div
        className="flex gap-2.5 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible snap-x snap-mandatory scroll-smooth mb-5"
        role="list"
        aria-label="Daily forecast tiles"
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

      {/* Rain Timeline */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <CloudRain size={14} className="text-blue-500" aria-hidden="true" />
          <span className="text-xs font-semibold text-muted-foreground">
            Rain Probability
          </span>
        </div>
        <div className="flex gap-1.5 items-end h-16">
          {forecast.map((day, i) => {
            const dayDate = new Date(day.date);
            dayDate.setHours(0, 0, 0, 0);
            const isToday = dayDate.getTime() === today.getTime();
            const height = Math.max(8, (day.rainChancePercent / 100) * 100);

            return (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                className={cn(
                  "flex-1 rounded-t-md relative group",
                  day.rainChancePercent >= 70
                    ? "bg-blue-500"
                    : day.rainChancePercent >= 40
                      ? "bg-blue-400"
                      : day.rainChancePercent >= 20
                        ? "bg-blue-300"
                        : "bg-blue-200 dark:bg-blue-900/30",
                  isToday && "ring-2 ring-primary/50",
                )}
                aria-label={`${formatDayShort(day.date, isToday)}: ${day.rainChancePercent}% rain`}
              >
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {day.rainChancePercent}%
                </span>
              </motion.div>
            );
          })}
        </div>
        <div className="flex gap-1.5 mt-1">
          {forecast.map((day, i) => {
            const dayDate = new Date(day.date);
            dayDate.setHours(0, 0, 0, 0);
            const isToday = dayDate.getTime() === today.getTime();

            return (
              <span
                key={i}
                className={cn(
                  "flex-1 text-center text-[9px]",
                  isToday
                    ? "text-primary font-semibold"
                    : "text-muted-foreground",
                )}
              >
                {formatDayShort(day.date, isToday).slice(0, 2)}
              </span>
            );
          })}
        </div>
      </div>

      {/* Temperature Trend */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Thermometer
            size={14}
            className="text-orange-500"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold text-muted-foreground">
            Temperature Trend
          </span>
        </div>
        <div className="space-y-1.5">
          {forecast.map((day, i) => {
            const dayDate = new Date(day.date);
            dayDate.setHours(0, 0, 0, 0);
            const isToday = dayDate.getTime() === today.getTime();

            const lowOffset = ((day.lowC - minTemp) / tempRange) * 100;
            const highOffset = ((day.highC - minTemp) / tempRange) * 100;
            const barWidth = highOffset - lowOffset;

            return (
              <div key={i} className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-10 text-[10px] text-right",
                    isToday
                      ? "text-primary font-semibold"
                      : "text-muted-foreground",
                  )}
                >
                  {formatDayShort(day.date, isToday).slice(0, 2)}
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
                    transition={{ duration: 0.6, delay: i * 0.06 }}
                    className={cn(
                      "absolute h-full rounded-full",
                      day.highC >= 35
                        ? "bg-gradient-to-r from-orange-400 to-orange-500"
                        : day.highC >= 30
                          ? "bg-gradient-to-r from-amber-400 to-amber-500"
                          : day.highC >= 25
                            ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                            : "bg-gradient-to-r from-blue-400 to-blue-500",
                    )}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground w-6">
                  {convertTemp(day.highC)}°
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

ForecastDetail.displayName = "ForecastDetail";
