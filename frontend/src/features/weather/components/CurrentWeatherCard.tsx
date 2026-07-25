"use client";

// ─────────────────────────────────────────────────────────────────────────────
// CurrentWeatherCard.tsx
// KisanGPT — Hero current conditions card
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  RefreshCcw,
  Sunrise,
  Sunset,
  Droplets,
  Wind,
  Thermometer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { WeatherIcon } from "./WeatherIcon";
import { WeatherStatBadge } from "./WeatherStatBadge";
import { WEATHER_LABELS, getUVLabel } from "../constants/weather.constants";
import type {
  CurrentWeather,
  FarmLocation,
  TemperatureUnit,
} from "../types/weather.types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CurrentWeatherCardProps {
  current: CurrentWeather;
  location: FarmLocation;
  unit: TemperatureUnit;
  convertTemp: (c: number) => number;
  unitSymbol: string;
  relativeTime: (d: Date) => string;
  onRefresh: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  current,
  location,
  unit,
  convertTemp,
  unitSymbol,
  relativeTime,
  onRefresh,
}) => {
  const uvInfo = getUVLabel(current.uvIndex);

  const locationLabel = [location.village ?? location.district, location.state]
    .filter(Boolean)
    .join(", ");

  return (
    <motion.section
      role="region"
      aria-label="Current weather conditions"
      aria-live="polite"
      aria-atomic="true"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border shadow-sm",
        // Light mode: soft emerald-sky gradient
        "bg-gradient-to-br from-emerald-50 via-white to-sky-50",
        // Dark mode: deep gradient
        "dark:from-emerald-950/40 dark:via-card dark:to-sky-950/30 dark:bg-card",
      )}
    >
      {/* Decorative blob — purely visual */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/8 blur-3xl"
      />

      <div className="relative p-5">
        {/* ── Row 1: Location + Live badge ── */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin size={14} aria-hidden="true" />
            <span className="font-medium text-foreground">{locationLabel}</span>
          </div>
          <Badge variant="success" className="text-[10px] px-2 py-0.5 gap-1">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse"
              aria-hidden="true"
            />
            Live
          </Badge>
        </div>

        {/* ── Row 2: Icon + Temperature + Condition ── */}
        <div className="flex items-center gap-5 mb-6">
          {/* Floating icon */}
          <motion.div className="motion-safe:animate-float" aria-hidden="true">
            <WeatherIcon condition={current.condition} size="xl" />
          </motion.div>

          {/* Temp + condition text */}
          <div className="flex flex-col gap-0.5">
            <motion.div
              key={`${current.temperatureC}-${unit}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-end leading-none"
            >
              <span
                className="text-5xl font-bold text-foreground tabular-nums"
                aria-label={`${convertTemp(current.temperatureC)} degrees ${unit}`}
              >
                {convertTemp(current.temperatureC)}
              </span>
              <span className="text-2xl font-semibold text-muted-foreground mb-1 ml-0.5">
                {unitSymbol}
              </span>
            </motion.div>

            <p className="text-base font-medium text-foreground">
              {WEATHER_LABELS[current.condition]}
            </p>
            <p className="text-sm text-muted-foreground">
              Feels like {convertTemp(current.feelsLikeC)}
              {unitSymbol}
            </p>
          </div>
        </div>

        {/* ── Row 3: Stat pills ── */}
        <div className="flex gap-3 flex-wrap mb-5">
          <WeatherStatBadge
            icon={<Droplets size={16} />}
            label="Humidity"
            value={`${current.humidity}%`}
          />
          <WeatherStatBadge
            icon={<Wind size={16} />}
            label="Wind"
            value={`${current.windSpeedKmh} km/h`}
          />
          <WeatherStatBadge
            icon={<Thermometer size={16} />}
            label={`UV · ${uvInfo.label}`}
            value={`${current.uvIndex}`}
            className={uvInfo.color}
          />
        </div>

        {/* ── Row 4: Sunrise / Sunset + Last updated ── */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Sunrise size={13} aria-hidden="true" />
              {current.sunriseTime}
            </span>
            <span className="flex items-center gap-1">
              <Sunset size={13} aria-hidden="true" />
              {current.sunsetTime}
            </span>
          </div>

          <button
            onClick={onRefresh}
            aria-label="Refresh weather data"
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1",
              "hover:bg-muted transition-colors focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            )}
          >
            <RefreshCcw size={12} aria-hidden="true" />
            <time
              dateTime={current.updatedAt.toISOString()}
              title={current.updatedAt.toLocaleString("en-IN")}
            >
              {relativeTime(current.updatedAt)}
            </time>
          </button>
        </div>
      </div>
    </motion.section>
  );
};

CurrentWeatherCard.displayName = "CurrentWeatherCard";
