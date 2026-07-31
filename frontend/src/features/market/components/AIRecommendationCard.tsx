"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  ArrowRight,
  Clock,
  Target,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { COMMODITY_EMOJI } from "../constants/market.constants";
import type { PremiumAIRecommendation } from "../types/market.types";

interface AIRecommendationCardProps {
  recommendation: PremiumAIRecommendation;
  onSetAlert?: (commodity: string) => void;
  onAskAI?: () => void;
}

const TYPE_CONFIG: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
  }
> = {
  sell_now: {
    label: "Sell Now",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  hold: {
    label: "Hold",
    icon: Minus,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  wait: {
    label: "Wait",
    icon: Clock,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  alternative_mandi: {
    label: "Switch Mandi",
    icon: TrendingDown,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  switch_mandi: {
    label: "Switch Mandi",
    icon: TrendingDown,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
} as const;

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  recommendation,
  onSetAlert,
  onAskAI,
}) => {
  const cfg = (TYPE_CONFIG[recommendation.type] ??
    TYPE_CONFIG.sell_now) as (typeof TYPE_CONFIG)[keyof typeof TYPE_CONFIG];
  const Icon = cfg.icon;
  const emoji = COMMODITY_EMOJI[recommendation.commodity] ?? "\uD83C\uDF3E";

  return (
    <motion.section
      role="region"
      aria-label="AI Market Recommendation"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
    >
      {/* Gradient header */}
      <div className={cn("px-5 py-4", cfg.bg)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-primary" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-foreground">
              AI Recommendation
            </h2>
          </div>
          <Badge className={cn("text-[10px]", cfg.color, "bg-white/80")}>
            <Icon size={10} className="mr-1" />
            {cfg.label}
          </Badge>
        </div>
      </div>

      <div className="p-5">
        {/* Commodity + headline */}
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl mt-0.5" aria-hidden="true">
            {emoji}
          </span>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {recommendation.headline}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {recommendation.commodity}
            </p>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              AI Confidence
            </span>
            <span className="text-xs font-bold text-foreground">
              {recommendation.confidence}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${recommendation.confidence}%` }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </div>

        {/* Rationale */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {recommendation.rationale}
        </p>

        {/* Info chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          <InfoChip
            icon={<TrendingUp size={12} />}
            label={recommendation.expectedPriceMovement}
          />
          {recommendation.profitEstimate > 0 && (
            <InfoChip
              icon={<Target size={12} />}
              label={`\u20B9${recommendation.profitEstimate.toLocaleString("en-IN")}/acre`}
            />
          )}
          {recommendation.sellWithinDays && (
            <InfoChip
              icon={<Clock size={12} />}
              label={`Sell within ${recommendation.sellWithinDays} days`}
            />
          )}
          {recommendation.suggestedMandi && (
            <InfoChip
              icon={<Target size={12} />}
              label={recommendation.suggestedMandi}
            />
          )}
        </div>

        {/* Risk factors */}
        {recommendation.riskFactors.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle
                size={12}
                className="text-amber-500"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold text-muted-foreground">
                Risk Factors
              </span>
            </div>
            <ul className="space-y-1">
              {recommendation.riskFactors.map((risk, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <span className="mt-1 h-1 w-1 rounded-full bg-amber-400 shrink-0" />
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggested action */}
        <div className="rounded-xl bg-muted/50 p-3 mb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <ArrowRight size={12} className="text-primary" aria-hidden="true" />
            <span className="text-xs font-semibold text-foreground">
              Suggested Next Action
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {recommendation.suggestedNextAction}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex gap-2">
          {onSetAlert && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetAlert(recommendation.commodity)}
              leftIcon={<Target size={14} />}
              className="flex-1 text-xs"
            >
              Set Price Alert
            </Button>
          )}
          {onAskAI && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAskAI}
              rightIcon={<ChevronRight size={14} />}
              className="text-xs"
            >
              Ask AI
            </Button>
          )}
        </div>
      </div>
    </motion.section>
  );
};

AIRecommendationCard.displayName = "AIRecommendationCard";

// ---------------------------------------------------------------------------
// InfoChip (inline)
// ---------------------------------------------------------------------------

const InfoChip: React.FC<{ icon: React.ReactNode; label: string }> = ({
  icon,
  label,
}) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
    {icon}
    {label}
  </span>
);
