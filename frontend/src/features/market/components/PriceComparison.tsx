"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Star,
  Navigation,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { MandiComparison } from "../types/market.types";

interface PriceComparisonProps {
  comparisons: MandiComparison[];
  commodity?: string;
}

const RECOMMENDATION_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  best: {
    label: "Best Choice",
    icon: Star,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  good: {
    label: "Good Option",
    icon: TrendingUp,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  avoid: {
    label: "Not Ideal",
    icon: TrendingDown,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
};

const DEFAULT_REC = RECOMMENDATION_CONFIG.good;

type RecommendationConfig = (typeof RECOMMENDATION_CONFIG)[string];

export const PriceComparison: React.FC<PriceComparisonProps> = ({
  comparisons,
  commodity,
}) => {
  if (comparisons.length === 0) return null;

  return (
    <motion.section
      role="region"
      aria-label="Mandi Price Comparison"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">
            Mandi Comparison
          </h2>
        </div>
        {commodity && (
          <Badge variant="info" className="text-[10px]">
            {commodity}
          </Badge>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table
          className="w-full text-left"
          aria-label="Mandi price comparison table"
        >
          <caption className="sr-only">
            Price comparison across mandis for{" "}
            {commodity ?? "selected commodity"}
          </caption>
          <thead>
            <tr className="border-b border-border">
              <th className="pb-2 text-[10px] font-semibold text-muted-foreground">
                Rank
              </th>
              <th className="pb-2 text-[10px] font-semibold text-muted-foreground">
                Mandi
              </th>
              <th className="pb-2 text-[10px] font-semibold text-muted-foreground text-right">
                Price
              </th>
              <th className="pb-2 text-[10px] font-semibold text-muted-foreground text-right">
                Transport
              </th>
              <th className="pb-2 text-[10px] font-semibold text-muted-foreground text-right">
                Net Earnings
              </th>
              <th className="pb-2 text-[10px] font-semibold text-muted-foreground text-right">
                Distance
              </th>
              <th className="pb-2 text-[10px] font-semibold text-muted-foreground">
                Verdict
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((c, i) => {
              const cfg = (RECOMMENDATION_CONFIG[c.sellingRecommendation] ??
                DEFAULT_REC) as RecommendationConfig;
              const RIcon = cfg.icon;
              return (
                <motion.tr
                  key={c.mandiName}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className={cn(
                    "border-b border-border last:border-0",
                    c.sellingRecommendation === "best" && "bg-emerald-50/50",
                  )}
                >
                  <td className="py-3">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold",
                        c.profitRank === 1
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {c.profitRank}
                    </span>
                  </td>
                  <td className="py-3">
                    <p className="text-xs font-medium text-foreground">
                      {c.mandiName}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {c.district}, {c.state}
                    </p>
                  </td>
                  <td className="py-3 text-right">
                    <p className="text-xs font-bold text-foreground">
                      {"\u20B9"}
                      {c.pricePerQuintal.toLocaleString("en-IN")}
                    </p>
                    <span
                      className={cn(
                        "text-[10px] font-medium",
                        c.isRise ? "text-emerald-600" : "text-red-500",
                      )}
                    >
                      {c.isRise ? "+" : ""}
                      {c.changePercent.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <p className="text-xs text-red-500 font-medium">
                      -{"\u20B9"}
                      {c.transportCostEstimate.toLocaleString("en-IN")}
                    </p>
                  </td>
                  <td className="py-3 text-right">
                    <p className="text-xs font-bold text-foreground">
                      {"\u20B9"}
                      {c.netExpectedEarnings.toLocaleString("en-IN")}
                    </p>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                      <Navigation size={10} />
                      {c.travelDistanceKm} km
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge className={cn("text-[10px]", cfg.color, cfg.bg)}>
                      <RIcon size={10} className="mr-1" />
                      {cfg.label}
                    </Badge>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {comparisons.map((c, i) => {
          const cfg = (RECOMMENDATION_CONFIG[c.sellingRecommendation] ??
            DEFAULT_REC) as RecommendationConfig;
          const RIcon = cfg.icon;
          return (
            <motion.div
              key={c.mandiName}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className={cn(
                "rounded-xl border p-3",
                c.sellingRecommendation === "best"
                  ? "border-emerald-200 bg-emerald-50/50"
                  : "border-border bg-background",
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {c.mandiName}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {c.district}, {c.state}
                  </p>
                </div>
                <Badge className={cn("text-[10px]", cfg?.color, cfg?.bg)}>
                  <RIcon size={10} className="mr-1" />
                  {cfg.label}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-muted-foreground">Price</p>
                  <p className="text-sm font-bold text-foreground">
                    {"\u20B9"}
                    {c.pricePerQuintal.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Transport</p>
                  <p className="text-sm font-medium text-red-500">
                    -{"\u20B9"}
                    {c.transportCostEstimate.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">
                    Net Earnings
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {"\u20B9"}
                    {c.netExpectedEarnings.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Distance</p>
                  <p className="text-sm text-muted-foreground">
                    {c.travelDistanceKm} km
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

PriceComparison.displayName = "PriceComparison";
