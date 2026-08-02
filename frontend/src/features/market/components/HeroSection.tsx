"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Sparkles,
  Target,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SENTIMENT_CONFIG } from "../constants/market.constants";
import type { HeroMarketBrief } from "../types/market.types";

interface HeroSectionProps {
  brief: HeroMarketBrief;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  brief,
  onRefresh,
  isLoading = false,
}) => {
  const sentimentCfg = SENTIMENT_CONFIG[brief.sentiment];

  return (
    <motion.section
      role="region"
      aria-label="AI Market Brief"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-primary" aria-hidden="true" />
          <h2 className="ds-heading-sm text-foreground">AI Market Brief</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              brief.sentiment === "bullish"
                ? "success"
                : brief.sentiment === "bearish"
                  ? "error"
                  : "warning"
            }
            className="text-[10px]"
          >
            {sentimentCfg.icon} {sentimentCfg.label}
          </Badge>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              aria-label="Refresh market brief"
              className="h-7 w-7 p-0"
            >
              <RefreshCw
                size={14}
                className={cn(isLoading && "animate-spin")}
              />
            </Button>
          )}
        </div>
      </div>

      {/* Headline */}
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {brief.headline}
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<TrendingUp size={14} />}
          label="Best Commodity"
          value={brief.bestCommodity}
          sub={
            <span
              className={cn(
                "text-[10px] font-medium",
                brief.bestCommodityChange >= 0
                  ? "text-emerald-600"
                  : "text-red-500",
              )}
            >
              {brief.bestCommodityChange >= 0 ? "+" : ""}
              {brief.bestCommodityChange}%
            </span>
          }
          color="text-emerald-600"
        />
        <StatCard
          icon={<Target size={14} />}
          label="Profit Opportunity"
          value={brief.estimatedProfitOpportunity}
          color="text-amber-600"
        />
        <StatCard
          icon={<Brain size={14} />}
          label="AI Confidence"
          value={`${brief.confidenceScore}%`}
          bar={brief.confidenceScore}
          color="text-primary"
        />
        <StatCard
          icon={
            brief.sentiment === "bullish" ? (
              <TrendingUp size={14} />
            ) : brief.sentiment === "bearish" ? (
              <TrendingDown size={14} />
            ) : (
              <Minus size={14} />
            )
          }
          label="Market Status"
          value={sentimentCfg.label}
          color={sentimentCfg.color}
        />
      </div>

      {/* Last updated */}
      <p className="text-[10px] text-muted-foreground mt-3 text-right">
        Updated{" "}
        {new Date(brief.lastUpdated).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </motion.section>
  );
};

HeroSection.displayName = "HeroSection";

// ---------------------------------------------------------------------------
// StatCard (inline)
// ---------------------------------------------------------------------------

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: React.ReactNode;
  bar?: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  sub,
  bar,
  color,
}) => (
  <div className="rounded-xl bg-muted/50 p-3">
    <div className={cn("flex items-center gap-1.5 mb-1.5", color)}>
      {icon}
      <span className="text-[10px] font-medium text-muted-foreground">
        {label}
      </span>
    </div>
    <p className="text-sm font-bold text-foreground">{value}</p>
    {sub && <div className="mt-0.5">{sub}</div>}
    {bar !== undefined && (
      <div className="mt-2 h-1.5 rounded-full bg-border overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${bar}%` }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="h-full rounded-full bg-primary"
        />
      </div>
    )}
  </div>
);
