"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { INSIGHT_CONFIG } from "../constants/market.constants";
import type { AIInsight } from "../types/market.types";

interface AIInsightsProps {
  insights: AIInsight[];
}

const IMPACT_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  positive: {
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  negative: { icon: TrendingDown, color: "text-red-500", bg: "bg-red-50" },
  neutral: { icon: Minus, color: "text-amber-600", bg: "bg-amber-50" },
};

const DEFAULT_IMPACT = IMPACT_CONFIG.neutral;

type ImpactConfigValue = (typeof IMPACT_CONFIG)[keyof typeof IMPACT_CONFIG];

export const AIInsights: React.FC<AIInsightsProps> = ({ insights }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (insights.length === 0) return null;

  return (
    <motion.section
      role="region"
      aria-label="AI Market Insights"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Brain size={16} className="text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">AI Insights</h2>
      </div>

      {/* Insight cards */}
      <div className="space-y-2">
        {insights.map((insight, i) => {
          const cfg = INSIGHT_CONFIG[insight.category] ?? {
            label: insight.category,
            icon: "\uD83D\uDCCA",
            color: "text-gray-600",
          };
          const impactCfg = (IMPACT_CONFIG[insight.impact] ??
            DEFAULT_IMPACT) as ImpactConfigValue;
          const ImpactIcon = impactCfg.icon;
          const isExpanded = expandedId === insight.id;

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-xl border border-border overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : insight.id)}
                className="w-full flex items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors"
                aria-expanded={isExpanded}
              >
                <span className="text-lg shrink-0 mt-0.5" aria-hidden="true">
                  {cfg?.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-semibold text-foreground">
                      {insight.title}
                    </p>
                    <Badge
                      className={cn(
                        "text-[9px]",
                        impactCfg.color,
                        impactCfg.bg,
                      )}
                    >
                      <ImpactIcon size={8} className="mr-0.5" />
                      {insight.impact}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {insight.summary}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={cn(
                    "shrink-0 text-muted-foreground transition-transform mt-0.5",
                    isExpanded && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 pt-0 border-t border-border">
                      <p className="text-xs text-muted-foreground leading-relaxed mt-3">
                        {insight.details}
                      </p>
                      {insight.relevantCommodities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {insight.relevantCommodities.map((c) => (
                            <Badge
                              key={c}
                              variant="info"
                              className="text-[9px]"
                            >
                              {c}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

AIInsights.displayName = "AIInsights";
