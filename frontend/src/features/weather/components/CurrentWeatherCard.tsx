"use client";

// ─────────────────────────────────────────────────────────────────────────────
// CurrentWeatherCard.tsx
// KisanGPT — Hero current conditions card with rain probability, air quality
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
  CloudRain,
  Eye,
  Gauge,
  Brain,
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
  WeatherSummary,
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
  summary?: WeatherSummary;
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
  summary,
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
        "bg-gradient-to-br from-emerald-50 via-white to-sky-50",
        "dark:from-emerald-950/40 dark:via-card dark:to-sky-950/30 dark:bg-card",
      )}
    >
      {/* Decorative blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/8 blur-3xl"
      />

      <div className="relative p-5">
        {/* Row 1: Location + Live badge */}
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

        {/* Row 2: Icon + Temperature + Condition */}
        <div className="flex items-center gap-5 mb-6">
          <motion.div className="motion-safe:animate-float" aria-hidden="true">
            <WeatherIcon condition={current.condition} size="xl" />
          </motion.div>

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

        {/* Row 3: Stat pills */}
        <div className="flex gap-3 flex-wrap mb-5">
          <WeatherStatBadge
            icon={<CloudRain size={16} />}
            label="Rain"
            value={`${current.rainChancePercent}%`}
            className={cn(
              current.rainChancePercent >= 50 &&
                "ring-2 ring-blue-500/30 bg-blue-500/10",
            )}
          />
          <WeatherStatBadge
            icon={<Droplets size={16} />}
            label="Humidity"
            value={`${current.humidity}%`}
          />
          <WeatherStatBadge
            icon={<Wind size={16} />}
            label={`Wind ${current.windDirection}`}
            value={`${current.windSpeedKmh} km/h`}
          />
          <WeatherStatBadge
            icon={<Thermometer size={16} />}
            label={`UV · ${uvInfo.label}`}
            value={`${current.uvIndex}`}
            className={uvInfo.color}
          />
          <WeatherStatBadge
            icon={<Eye size={16} />}
            label="Visibility"
            value={`${current.visibility} km`}
          />
          <WeatherStatBadge
            icon={<Gauge size={16} />}
            label="Pressure"
            value={`${current.pressure}`}
          />
        </div>

        {/* Row 4: Air Quality */}
        {current.airQuality && (
          <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/10">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs font-medium text-muted-foreground">
                Air Quality:
              </span>
              <Badge
                variant={
                  current.airQuality.aqi <= 50
                    ? "success"
                    : current.airQuality.aqi <= 100
                      ? "warning"
                      : "error"
                }
                className="text-[10px]"
              >
                AQI {current.airQuality.aqi}
              </Badge>
              <span
                className={cn("text-xs font-medium", current.airQuality.color)}
              >
                {current.airQuality.label}
              </span>
            </div>
          </div>
        )}

        {/* Row 5: Sunrise / Sunset + Last updated */}
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

        {/* Row 6: AI Summary */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <Brain size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-primary">
                    AI Weather Summary
                  </span>
                  <Badge variant="default" className="text-[9px] px-1.5 py-0">
                    {summary.confidence}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {summary.text}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

CurrentWeatherCard.displayName = "CurrentWeatherCard";
