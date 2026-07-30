// ─────────────────────────────────────────────────────────────────────────────
// AIRecommendationCard.tsx
// KisanGPT — Gemini AI selling recommendation advisory card
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { Sparkles, TrendingUp, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type {
  AIRecommendation,
  RecommendationType,
} from "../types/market.types";

interface AIRecommendationCardProps {
  recommendation: AIRecommendation;
  onSetAlert?: (commodity: string) => void;
}

type RecommendationConfig = {
  emoji: string;
  label: string;
  badgeVariant: "success" | "warning" | "info";
  borderClass: string;
  headerBgClass: string;
  textClass: string;
};

const RECOMMENDATION_CONFIG: Record<RecommendationType, RecommendationConfig> =
  {
    sell_now: {
      emoji: "🟢",
      label: "Sell Now",
      badgeVariant: "success",
      borderClass: "border-emerald-300 dark:border-emerald-700",
      headerBgClass:
        "bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/60 dark:to-emerald-900/30",
      textClass: "text-emerald-700 dark:text-emerald-300",
    },
    hold: {
      emoji: "🟡",
      label: "Hold",
      badgeVariant: "warning",
      borderClass: "border-amber-300 dark:border-amber-700",
      headerBgClass:
        "bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/60 dark:to-amber-900/30",
      textClass: "text-amber-700 dark:text-amber-300",
    },
    wait: {
      emoji: "⏳",
      label: "Wait",
      badgeVariant: "warning",
      borderClass: "border-amber-300 dark:border-amber-700",
      headerBgClass:
        "bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/60 dark:to-amber-900/30",
      textClass: "text-amber-700 dark:text-amber-300",
    },
    alternative_mandi: {
      emoji: "🔵",
      label: "Better Mandi",
      badgeVariant: "info",
      borderClass: "border-blue-300 dark:border-blue-700",
      headerBgClass:
        "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/60 dark:to-blue-900/30",
      textClass: "text-blue-700 dark:text-blue-300",
    },
    switch_mandi: {
      emoji: "🔵",
      label: "Switch Mandi",
      badgeVariant: "info",
      borderClass: "border-blue-300 dark:border-blue-700",
      headerBgClass:
        "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/60 dark:to-blue-900/30",
      textClass: "text-blue-700 dark:text-blue-300",
    },
  };

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  recommendation,
  onSetAlert,
}) => {
  const config = RECOMMENDATION_CONFIG[recommendation.type];

  return (
    <motion.section
      role="region"
      aria-label="AI Selling Recommendation"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-2xl border-2 ${config.borderClass} bg-card shadow-sm overflow-hidden`}
    >
      {/* Gradient Header */}
      <div className={`px-4 py-4 ${config.headerBgClass}`}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={15} className={config.textClass} aria-hidden="true" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            KisanGPT AI Advisory
          </span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span aria-hidden="true" className="text-xl">
                {config.emoji}
              </span>
              <h2 className={`font-extrabold text-base ${config.textClass}`}>
                {recommendation.headline}
              </h2>
            </div>
            {/* Confidence bar */}
            <div className="flex items-center gap-2 mt-1">
              <div
                className="flex-1 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden"
                aria-hidden="true"
              >
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    recommendation.type === "sell_now"
                      ? "bg-emerald-500"
                      : recommendation.type === "hold" ||
                          recommendation.type === "wait"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                  }`}
                  style={{ width: `${recommendation.confidence}%` }}
                />
              </div>
              <span
                className="text-xs font-bold text-muted-foreground tabular-nums"
                aria-label={`Confidence: ${recommendation.confidence} percent`}
              >
                {recommendation.confidence}%
              </span>
            </div>
          </div>
          <Badge variant={config.badgeVariant} className="shrink-0 text-[10px]">
            {config.label}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-4 space-y-4">
        {/* Rationale */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {recommendation.rationale}
        </p>

        {/* Key info chips */}
        <div className="flex flex-wrap gap-2">
          {recommendation.sell_within_days !== undefined && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/40 border border-border px-3 py-1.5">
              <Clock
                size={12}
                className="text-muted-foreground"
                aria-hidden="true"
              />
              <span className="text-xs font-medium text-foreground">
                {recommendation.sell_within_days === 0
                  ? "Sell today"
                  : `Within ${recommendation.sell_within_days} day${recommendation.sell_within_days > 1 ? "s" : ""}`}
              </span>
            </div>
          )}
          {recommendation.suggested_mandi && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/40 border border-border px-3 py-1.5">
              <MapPin
                size={12}
                className="text-muted-foreground"
                aria-hidden="true"
              />
              <span className="text-xs font-medium text-foreground">
                {recommendation.suggested_mandi}
              </span>
            </div>
          )}
          {recommendation.net_gain_per_quintal !== undefined &&
            recommendation.net_gain_per_quintal > 0 && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 px-3 py-1.5">
                <TrendingUp
                  size={12}
                  className="text-emerald-600 dark:text-emerald-400"
                  aria-hidden="true"
                />
                <span
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-300"
                  aria-label={`Net gain: ₹${recommendation.net_gain_per_quintal} per quintal`}
                >
                  +₹
                  {recommendation.net_gain_per_quintal.toLocaleString("en-IN")}
                  /qtl net gain
                </span>
              </div>
            )}
        </div>

        {/* CTA */}
        {onSetAlert && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetAlert(recommendation.commodity)}
            className="w-full"
            leftIcon={<span aria-hidden="true">🔔</span>}
          >
            Set Price Alert for {recommendation.commodity}
          </Button>
        )}

        {/* Attribution */}
        <p className="text-[10px] text-muted-foreground text-right">
          Powered by KisanGPT AI · Agmarknet data ·{" "}
          {new Date(recommendation.generated_at).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </motion.section>
  );
};

AIRecommendationCard.displayName = "AIRecommendationCard";
