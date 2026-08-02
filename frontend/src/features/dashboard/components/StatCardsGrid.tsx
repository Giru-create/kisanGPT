"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Leaf,
  AlertTriangle,
  Landmark,
  ArrowUpRight,
  Droplets,
  Wind,
} from "lucide-react";
import { Chip } from "@/components/ui";
import { WeatherIcon } from "@/features/weather/components/WeatherIcon";
import type { WeatherCondition } from "@/features/weather/types/weather.types";
import { WEATHER_LABELS } from "@/features/weather/constants/weather.constants";
import { motionPresets } from "@/lib/motion";
import type {
  MarketTrendItem,
  CropHealthItem,
  GovtSchemeItem,
} from "../types/dashboard.types";

interface StatCardsGridProps {
  weather: {
    temperatureC: number;
    condition: WeatherCondition;
    humidity: number;
    windSpeedKmh: number;
    advisorySafe: boolean;
  };
  marketTrends: MarketTrendItem[];
  cropHealthCards: CropHealthItem[];
  schemes: GovtSchemeItem[];
}

export const StatCardsGrid: React.FC<StatCardsGridProps> = ({
  weather,
  marketTrends,
  cropHealthCards,
  schemes,
}) => {
  const primaryMarket = marketTrends[0];
  const healthyCrops = cropHealthCards.filter(
    (c) => c.status === "healthy",
  ).length;
  const alertCrops = cropHealthCards.filter((c) => c.status === "alert").length;
  const eligibleSchemes = schemes.filter(
    (s) => s.statusBadge === "Eligible",
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Weather Card */}
      <motion.div
        initial={motionPresets.cardHover.rest}
        whileHover={motionPresets.cardHover.hover}
      >
        <Link
          href="/weather"
          className="group block ds-card-interactive p-5 h-full"
          aria-label={`Weather: ${weather.temperatureC} degrees, ${WEATHER_LABELS[weather.condition]}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-sky-500/10 flex items-center justify-center">
              <WeatherIcon condition={weather.condition} size="sm" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {WEATHER_LABELS[weather.condition]}
            </span>
          </div>
          <p className="ds-stat-value tabular-nums">{weather.temperatureC}°</p>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Temperature
          </p>
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/40">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Droplets
                size={12}
                className="text-blue-500"
                aria-hidden="true"
              />
              {weather.humidity}%
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Wind size={12} className="text-teal-500" aria-hidden="true" />
              {weather.windSpeedKmh} km/h
            </span>
          </div>
          <div className="mt-3">
            <Chip
              variant={weather.advisorySafe ? "success" : "warning"}
              size="sm"
            >
              {weather.advisorySafe ? "Safe to Spray" : "Caution"}
            </Chip>
          </div>
        </Link>
      </motion.div>

      {/* Market Card */}
      <motion.div
        initial={motionPresets.cardHover.rest}
        whileHover={motionPresets.cardHover.hover}
      >
        <Link
          href="/market"
          className="group block ds-card-interactive p-5 h-full"
          aria-label={`Market: ${primaryMarket?.commodity || "No data"}, ${primaryMarket?.price || ""}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-violet-500/10 flex items-center justify-center">
              <TrendingUp
                size={20}
                className="text-violet-600 dark:text-violet-400"
                aria-hidden="true"
              />
            </div>
            {primaryMarket && (
              <Chip
                variant={primaryMarket.isRise ? "success" : "error"}
                size="sm"
              >
                {primaryMarket.isRise ? (
                  <TrendingUp size={12} aria-hidden="true" />
                ) : (
                  <TrendingDown size={12} aria-hidden="true" />
                )}
                {primaryMarket.isRise ? "+" : ""}
                {primaryMarket.changePercent}%
              </Chip>
            )}
          </div>
          <p className="ds-stat-value tabular-nums">
            {primaryMarket?.price || "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-medium truncate">
            {primaryMarket?.commodity || "No market data"}
          </p>
          <div className="mt-4 pt-3 border-t border-border/40">
            <div className="flex gap-1">
              {marketTrends.slice(0, 5).map((t) => (
                <div
                  key={t.id}
                  className={`flex-1 h-1.5 rounded-full ${
                    t.isRise ? "bg-emerald-500/40" : "bg-red-500/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Crop Health Card */}
      <motion.div
        initial={motionPresets.cardHover.rest}
        whileHover={motionPresets.cardHover.hover}
      >
        <Link
          href="/disease"
          className="group block ds-card-interactive p-5 h-full"
          aria-label={`Crop Health: ${healthyCrops} healthy, ${alertCrops} alerts`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Leaf
                size={20}
                className="text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />
            </div>
            {alertCrops > 0 && (
              <Chip variant="error" size="sm">
                <AlertTriangle size={12} aria-hidden="true" />
                {alertCrops} alert{alertCrops > 1 ? "s" : ""}
              </Chip>
            )}
          </div>
          <p className="ds-stat-value tabular-nums">
            {healthyCrops}
            <span className="text-lg text-muted-foreground font-medium">
              /{cropHealthCards.length}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Crops Healthy
          </p>
          <div className="mt-4 pt-3 border-t border-border/40">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                style={{
                  width: cropHealthCards.length
                    ? `${(healthyCrops / cropHealthCards.length) * 100}%`
                    : "0%",
                }}
              />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Schemes Card */}
      <motion.div
        initial={motionPresets.cardHover.rest}
        whileHover={motionPresets.cardHover.hover}
      >
        <Link
          href="/schemes"
          className="group block ds-card-interactive p-5 h-full"
          aria-label={`Schemes: ${eligibleSchemes} eligible`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <Landmark
                size={20}
                className="text-amber-600 dark:text-amber-400"
                aria-hidden="true"
              />
            </div>
            <ArrowUpRight
              size={14}
              className="text-muted-foreground group-hover:text-primary transition-colors"
              aria-hidden="true"
            />
          </div>
          <p className="ds-stat-value tabular-nums">{eligibleSchemes}</p>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Schemes Available
          </p>
          <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap gap-1.5">
            {schemes.slice(0, 3).map((s) => (
              <Chip
                key={s.id}
                variant={
                  s.statusBadge === "Eligible"
                    ? "success"
                    : s.statusBadge === "Action Needed"
                      ? "warning"
                      : "info"
                }
                size="sm"
              >
                {s.statusBadge}
              </Chip>
            ))}
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

StatCardsGrid.displayName = "StatCardsGrid";
