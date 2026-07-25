"use client";

// ─────────────────────────────────────────────────────────────────────────────
// WeatherIcon.tsx
// KisanGPT — Weather condition icon system
//
// Resolves a WeatherCondition to a Lucide icon with the correct semantic color.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudRainWind,
  Zap,
  CloudFog,
  Snowflake,
  Wind,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WEATHER_ICON_COLORS } from "../constants/weather.constants";
import type { WeatherCondition } from "../types/weather.types";

// ---------------------------------------------------------------------------
// Size map
// ---------------------------------------------------------------------------

const SIZE_MAP = {
  sm: 18,
  md: 24,
  lg: 36,
  xl: 56,
} as const;

type IconSize = keyof typeof SIZE_MAP;

// ---------------------------------------------------------------------------
// Icon component map — keeps the bundle tree-shakeable
// ---------------------------------------------------------------------------

const ICON_MAP: Record<WeatherCondition, React.ElementType> = {
  sunny: Sun,
  "partly-cloudy": CloudSun,
  cloudy: Cloud,
  rain: CloudRain,
  "heavy-rain": CloudRainWind,
  thunderstorm: Zap,
  fog: CloudFog,
  snow: Snowflake,
  windy: Wind,
  heatwave: Flame,
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: IconSize;
  className?: string;
  /** Override aria-label; defaults to the condition string */
  label?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  size = "md",
  className,
  label,
}) => {
  const Icon = ICON_MAP[condition];
  const colorClass = WEATHER_ICON_COLORS[condition];
  const px = SIZE_MAP[size];

  return (
    <Icon
      width={px}
      height={px}
      aria-label={label ?? condition.replace("-", " ")}
      role="img"
      className={cn(colorClass, "shrink-0", className)}
    />
  );
};

WeatherIcon.displayName = "WeatherIcon";
