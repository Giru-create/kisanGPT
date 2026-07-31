"use client";

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
      className="rounded-2xl border border-border bg-card p-6 shadow-sm h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Live Weather
        </h2>
        <Link
          href="/weather"
          aria-label="View detailed 7-Day Weather Forecast"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors rounded-lg px-2.5 py-1.5 min-h-[36px]"
        >
          7-Day
          <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <WeatherIcon condition={condition} size="xl" />
        <div>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-foreground tabular-nums tracking-tight">
              {temperatureC}°
            </span>
            <span className="text-sm text-muted-foreground ml-1.5 font-medium">
              Feels {feelsLikeC}°
            </span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {WEATHER_LABELS[condition]}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/40">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Droplets size={15} className="text-blue-500" aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground leading-none tabular-nums">
              {humidity}%
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Humidity</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/40">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
            <Wind size={15} className="text-teal-500" aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground leading-none tabular-nums">
              {windSpeedKmh}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">km/h Wind</p>
          </div>
        </div>
      </div>

      <div
        className={`mt-auto flex items-start gap-3 rounded-xl p-3.5 text-xs border ${
          advisorySafe
            ? "bg-emerald-500/8 border-emerald-500/20 text-emerald-800 dark:text-emerald-200 dark:bg-emerald-500/10"
            : "bg-amber-500/8 border-amber-500/20 text-amber-800 dark:text-amber-200 dark:bg-amber-500/10"
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {advisorySafe ? (
            <ShieldCheck
              size={16}
              className="text-emerald-600 dark:text-emerald-400"
              aria-hidden="true"
            />
          ) : (
            <AlertCircle
              size={16}
              className="text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">Spray Advisory:</span>
            <Badge
              variant={advisorySafe ? "success" : "warning"}
              className="text-[10px] font-bold"
            >
              {advisorySafe ? "Safe to Spray" : "Caution"}
            </Badge>
          </div>
          <p className="leading-relaxed opacity-90">{advisory}</p>
        </div>
      </div>
    </motion.section>
  );
};

WeatherSummaryWidget.displayName = "WeatherSummaryWidget";
