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
import { WeatherIcon } from "@/features/weather/components/WeatherIcon";
import type { WeatherCondition } from "@/features/weather/types/weather.types";
import { WEATHER_LABELS } from "@/features/weather/constants/weather.constants";
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

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.01, y: -2, transition: { duration: 0.2, ease: "easeOut" } },
};

export const StatCardsGrid: React.FC<StatCardsGridProps> = ({
  weather,
  marketTrends,
  cropHealthCards,
  schemes,
}) => {
  const primaryMarket = marketTrends[0];
  const healthyCrops = cropHealthCards.filter((c) => c.status === "healthy").length;
  const alertCrops = cropHealthCards.filter((c) => c.status === "alert").length;
  const eligibleSchemes = schemes.filter((s) => s.statusBadge === "Eligible").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Weather Card */}
      <motion.div variants={cardHover} initial="rest" whileHover="hover">
        <Link
          href="/weather"
          className="group block rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all h-full"
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
          <p className="text-3xl font-bold text-foreground tabular-nums tracking-tight">
            {weather.temperatureC}°
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-medium">Temperature</p>
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/60">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Droplets size={12} className="text-blue-500" aria-hidden="true" />
              {weather.humidity}%
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Wind size={12} className="text-teal-500" aria-hidden="true" />
              {weather.windSpeedKmh} km/h
            </span>
          </div>
          <div className="mt-3">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                weather.advisorySafe
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              }`}
            >
              {weather.advisorySafe ? "Safe to Spray" : "Caution"}
            </span>
          </div>
        </Link>
      </motion.div>

      {/* Market Card */}
      <motion.div variants={cardHover} initial="rest" whileHover="hover">
        <Link
          href="/market"
          className="group block rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all h-full"
          aria-label={`Market: ${primaryMarket?.commodity || "No data"}, ${primaryMarket?.price || ""}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-violet-500/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-violet-600 dark:text-violet-400" aria-hidden="true" />
            </div>
            {primaryMarket && (
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold ${
                  primaryMarket.isRise
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {primaryMarket.isRise ? (
                  <TrendingUp size={12} aria-hidden="true" />
                ) : (
                  <TrendingDown size={12} aria-hidden="true" />
                )}
                {primaryMarket.isRise ? "+" : ""}{primaryMarket.changePercent}%
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-foreground tabular-nums tracking-tight">
            {primaryMarket?.price || "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-medium truncate">
            {primaryMarket?.commodity || "No market data"}
          </p>
          <div className="mt-4 pt-3 border-t border-border/60">
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
      <motion.div variants={cardHover} initial="rest" whileHover="hover">
        <Link
          href="/disease"
          className="group block rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all h-full"
          aria-label={`Crop Health: ${healthyCrops} healthy, ${alertCrops} alerts`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Leaf size={20} className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            </div>
            {alertCrops > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                <AlertTriangle size={12} aria-hidden="true" />
                {alertCrops} alert{alertCrops > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-foreground tabular-nums tracking-tight">
            {healthyCrops}<span className="text-lg text-muted-foreground font-medium">/{cropHealthCards.length}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-medium">Crops Healthy</p>
          <div className="mt-4 pt-3 border-t border-border/60">
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
      <motion.div variants={cardHover} initial="rest" whileHover="hover">
        <Link
          href="/schemes"
          className="group block rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all h-full"
          aria-label={`Schemes: ${eligibleSchemes} eligible`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <Landmark size={20} className="text-amber-600 dark:text-amber-400" aria-hidden="true" />
            </div>
            <ArrowUpRight
              size={14}
              className="text-muted-foreground group-hover:text-primary transition-colors"
              aria-hidden="true"
            />
          </div>
          <p className="text-3xl font-bold text-foreground tabular-nums tracking-tight">
            {eligibleSchemes}
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-medium">Schemes Available</p>
          <div className="mt-4 pt-3 border-t border-border/60 flex gap-1.5">
            {schemes.slice(0, 3).map((s) => (
              <span
                key={s.id}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                  s.statusBadge === "Eligible"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : s.statusBadge === "Action Needed"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                }`}
              >
                {s.statusBadge}
              </span>
            ))}
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

StatCardsGrid.displayName = "StatCardsGrid";
