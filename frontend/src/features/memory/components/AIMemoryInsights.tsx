"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_AI_INSIGHTS } from "../constants/memory.constants";
import type { AIMemoryInsight } from "../types/memory.types";

interface AIMemoryInsightsProps {
  onViewInsight?: (insight: AIMemoryInsight) => void;
}

export const AIMemoryInsights: React.FC<AIMemoryInsightsProps> = ({
  onViewInsight,
}) => {
  const insights = MOCK_AI_INSIGHTS;

  return (
    <motion.section
      role="region"
      aria-label="AI Memory Insights"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.16, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <Sparkles size={14} className="text-amber-600" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">AI Insights</h2>
          <p className="text-[10px] text-muted-foreground">
            Auto-generated from your memory patterns
          </p>
        </div>
      </div>

      {/* Insights grid */}
      <div className="space-y-2.5">
        {insights.map((insight, idx) => {
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className="flex items-start gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-xs transition-all cursor-pointer group"
              onClick={() => onViewInsight?.(insight)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onViewInsight?.(insight);
                }
              }}
            >
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 text-sm">
                {insight.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {insight.title}
                  </p>
                  {insight.actionable && (
                    <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                      Action
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                  {insight.description}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded-full font-semibold",
                      insight.confidence >= 0.9
                        ? "bg-emerald-500/10 text-emerald-600"
                        : insight.confidence >= 0.8
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-slate-500/10 text-slate-500",
                    )}
                  >
                    {Math.round(insight.confidence * 100)}% confidence
                  </span>
                  <span className="text-[9px] text-muted-foreground">
                    {insight.relatedMemories.length} related memories
                  </span>
                </div>
              </div>
              <ArrowRight
                size={14}
                className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1"
                aria-hidden="true"
              />
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

AIMemoryInsights.displayName = "AIMemoryInsights";
