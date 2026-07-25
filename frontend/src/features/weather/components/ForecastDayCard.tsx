"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ForecastDayCard.tsx
// KisanGPT — Single day tile in the 7-day forecast strip
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { motion } from "framer-motion";
import { Umbrella } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { WeatherIcon } from "./WeatherIcon";
import type { ForecastDay } from "../types/weather.types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDay(date: Date, isToday: boolean): string {
  return isToday ? "Today" : (SHORT_DAYS[date.getDay()] ?? "");
}

function formatDate(date: Date): string {
  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ForecastDayCardProps {
  day: ForecastDay;
  isToday?: boolean;
  animationIndex?: number;
  convertTemp: (c: number) => number;
  unitSymbol: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const ForecastDayCard: React.FC<ForecastDayCardProps> = ({
  day,
  isToday = false,
  animationIndex = 0,
  convertTemp,
  unitSymbol,
}) => {
  const rainHigh = day.rainChancePercent >= 60;

  return (
    <motion.article
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: animationIndex * 0.06, ease: "easeOut" }}
      aria-label={`${formatDay(day.date, isToday)}: ${day.condition}, high ${convertTemp(day.highC)}${unitSymbol}, low ${convertTemp(day.lowC)}${unitSymbol}, ${day.rainChancePercent}% rain`}
      className={cn(
        "flex flex-col items-center gap-1.5",
        "min-w-[76px] rounded-xl px-2.5 py-3",
        "border transition-colors",
        isToday
          ? "border-primary bg-accent text-accent-foreground"
          : "border-border bg-card hover:bg-muted/50",
      )}
    >
      {/* Day name */}
      <span
        className={cn(
          "text-xs font-semibold",
          isToday ? "text-primary" : "text-muted-foreground",
        )}
      >
        {formatDay(day.date, isToday)}
      </span>

      {/* Date */}
      <span className="text-[10px] text-muted-foreground">
        {formatDate(day.date)}
      </span>

      {/* Condition icon */}
      <WeatherIcon condition={day.condition} size="md" className="my-0.5" />

      {/* High / Low temps */}
      <div className="flex items-center gap-1 text-xs font-semibold">
        <span className="text-foreground">
          {convertTemp(day.highC)}{unitSymbol}
        </span>
        <span className="text-muted-foreground">
          {convertTemp(day.lowC)}{unitSymbol}
        </span>
      </div>

      {/* Rain chance */}
      <Badge
        variant={rainHigh ? "warning" : "outline"}
        className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5"
      >
        <Umbrella size={10} aria-hidden="true" />
        {day.rainChancePercent}%
      </Badge>
    </motion.article>
  );
};

ForecastDayCard.displayName = "ForecastDayCard";
