"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MarketTrendData, TrendTimeframe } from "../types/market.types";

interface MarketTrendsProps {
  data: MarketTrendData;
}

const TIMEFRAMES: { value: TrendTimeframe; label: string }[] = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "seasonal", label: "Seasonal" },
];

const SERIES_CONFIG = {
  price: { label: "Price", color: "#10b981", dash: "" },
  historical: { label: "Historical Avg", color: "#94a3b8", dash: "4 2" },
  demand: { label: "Demand", color: "#3b82f6", dash: "" },
  supply: { label: "Supply", color: "#f59e0b", dash: "" },
  forecast: { label: "Forecast", color: "#8b5cf6", dash: "6 3" },
};

export const MarketTrends: React.FC<MarketTrendsProps> = ({ data }) => {
  const [timeframe, setTimeframe] = useState<TrendTimeframe>("30d");
  const [showSeries, setShowSeries] = useState({
    price: true,
    historical: false,
    demand: false,
    supply: false,
    forecast: false,
  });

  // Slice data based on timeframe
  const days =
    timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : data.dates.length;
  const slicedDates = data.dates.slice(-days);
  const slicedPrices = data.prices.slice(-days);
  const slicedHistorical = data.historicalAvg.slice(-days);
  const slicedDemand = data.demandTrend.slice(-days);
  const slicedSupply = data.supplyTrend.slice(-days);
  const slicedForecast = data.forecastedPrice.slice(-days);

  // SVG chart dimensions
  const chartW = 400;
  const chartH = 140;
  const padX = 40;
  const padY = 20;
  const plotW = chartW - padX * 2;
  const plotH = chartH - padY * 2;

  // Calculate scales
  const allVals = [
    ...slicedPrices,
    ...slicedHistorical,
    ...slicedForecast,
  ].filter((v) => v > 0);
  const minVal = Math.min(...allVals) - 50;
  const maxVal = Math.max(...allVals) + 50;
  const range = maxVal - minVal || 1;

  const toX = (i: number) => padX + (i / (slicedDates.length - 1 || 1)) * plotW;
  const toY = (v: number) => padY + plotH - ((v - minVal) / range) * plotH;

  const makePath = (values: number[]) =>
    values
      .map(
        (v, i) =>
          `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`,
      )
      .join(" ");

  const makeArea = (values: number[]) => {
    const path = makePath(values);
    const last = values.length - 1;
    return `${path} L${toX(last).toFixed(1)},${padY + plotH} L${toX(0).toFixed(1)},${padY + plotH} Z`;
  };

  const toggleSeries = (key: keyof typeof showSeries) => {
    setShowSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const DirectionIcon =
    data.direction === "rising"
      ? TrendingUp
      : data.direction === "falling"
        ? TrendingDown
        : Minus;

  const directionColor =
    data.direction === "rising"
      ? "text-emerald-600"
      : data.direction === "falling"
        ? "text-red-500"
        : "text-muted-foreground";

  return (
    <motion.section
      role="region"
      aria-label="Market Trends"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">
            Price Trends
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <DirectionIcon size={14} className={directionColor} />
          <span className={cn("text-xs font-medium", directionColor)}>
            {data.direction.charAt(0).toUpperCase() + data.direction.slice(1)}
          </span>
        </div>
      </div>

      {/* Timeframe tabs */}
      <div className="flex gap-1 mb-4 bg-muted rounded-lg p-0.5">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.value}
            onClick={() => setTimeframe(tf.value)}
            className={cn(
              "flex-1 text-[10px] font-medium px-3 py-1.5 rounded-md transition-colors",
              timeframe === tf.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={timeframe === tf.value}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="overflow-x-auto mb-4">
        <svg
          viewBox={`0 0 ${chartW} ${chartH}`}
          className="w-full h-auto"
          aria-label={`${data.commodity} price trend chart`}
          role="img"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = padY + plotH * (1 - pct);
            const val = minVal + range * pct;
            return (
              <g key={pct}>
                <line
                  x1={padX}
                  y1={y}
                  x2={padX + plotW}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                />
                <text
                  x={padX - 4}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-muted-foreground"
                  fontSize="8"
                >
                  {Math.round(val)}
                </text>
              </g>
            );
          })}

          {/* Historical average */}
          {showSeries.historical && slicedHistorical.length > 0 && (
            <path
              d={makePath(slicedHistorical)}
              fill="none"
              stroke={SERIES_CONFIG.historical.color}
              strokeWidth="1.5"
              strokeDasharray={SERIES_CONFIG.historical.dash}
            />
          )}

          {/* Demand */}
          {showSeries.demand && slicedDemand.length > 0 && (
            <path
              d={makePath(slicedDemand)}
              fill="none"
              stroke={SERIES_CONFIG.demand.color}
              strokeWidth="1.5"
            />
          )}

          {/* Supply */}
          {showSeries.supply && slicedSupply.length > 0 && (
            <path
              d={makePath(slicedSupply)}
              fill="none"
              stroke={SERIES_CONFIG.supply.color}
              strokeWidth="1.5"
            />
          )}

          {/* Forecast */}
          {showSeries.forecast && slicedForecast.length > 0 && (
            <path
              d={makePath(slicedForecast)}
              fill="none"
              stroke={SERIES_CONFIG.forecast.color}
              strokeWidth="1.5"
              strokeDasharray={SERIES_CONFIG.forecast.dash}
            />
          )}

          {/* Price area fill */}
          {showSeries.price && slicedPrices.length > 0 && (
            <path
              d={makeArea(slicedPrices)}
              fill="url(#priceGradient)"
              opacity="0.3"
            />
          )}

          {/* Price line */}
          {showSeries.price && slicedPrices.length > 0 && (
            <path
              d={makePath(slicedPrices)}
              fill="none"
              stroke={SERIES_CONFIG.price.color}
              strokeWidth="2"
            />
          )}

          {/* Gradient def */}
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* X-axis labels (show 4 evenly) */}
          {slicedDates
            .filter((_, i, arr) => {
              if (arr.length <= 4) return true;
              const step = Math.floor(arr.length / 3);
              return i % step === 0 || i === arr.length - 1;
            })
            .map((date, i) => {
              const idx = slicedDates.indexOf(date);
              return (
                <text
                  key={`${date}-${i}`}
                  x={toX(idx)}
                  y={chartH - 4}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  fontSize="7"
                >
                  {date.slice(5)}
                </text>
              );
            })}
        </svg>
      </div>

      {/* Series toggles */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(Object.keys(SERIES_CONFIG) as Array<keyof typeof SERIES_CONFIG>).map(
          (key) => (
            <button
              key={key}
              onClick={() => toggleSeries(key)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium border transition-colors",
                showSeries[key]
                  ? "border-border bg-muted text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={showSeries[key]}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: SERIES_CONFIG[key].color }}
              />
              {SERIES_CONFIG[key].label}
            </button>
          ),
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <MiniStat
          label="Avg"
          value={`\u20B9${data.avgPrice.toLocaleString("en-IN")}`}
        />
        <MiniStat
          label="Min"
          value={`\u20B9${data.minPrice.toLocaleString("en-IN")}`}
        />
        <MiniStat
          label="Max"
          value={`\u20B9${data.maxPrice.toLocaleString("en-IN")}`}
        />
        <MiniStat
          label="Forecast"
          value={`\u20B9${data.forecastedPrice[data.forecastedPrice.length - 1]?.toLocaleString("en-IN") ?? "—"}`}
        />
      </div>
    </motion.section>
  );
};

MarketTrends.displayName = "MarketTrends";

// ---------------------------------------------------------------------------
// MiniStat (inline)
// ---------------------------------------------------------------------------

const MiniStat: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="text-center p-2 rounded-xl bg-muted/50">
    <p className="text-[10px] text-muted-foreground">{label}</p>
    <p className="text-xs font-bold text-foreground">{value}</p>
  </div>
);
