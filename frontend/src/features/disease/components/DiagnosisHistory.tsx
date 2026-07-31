"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  History,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { SEVERITY_CONFIG } from "../constants/disease.constants";
import type { DiagnosisHistoryItem } from "../types/disease.types";

interface DiagnosisHistoryProps {
  history: DiagnosisHistoryItem[];
  onSelect?: (id: string) => void;
}

const TREND_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; label: string }
> = {
  improving: {
    icon: TrendingUp,
    color: "text-emerald-500",
    label: "Improving",
  },
  stable: { icon: Minus, color: "text-amber-500", label: "Stable" },
  worsening: { icon: TrendingDown, color: "text-red-500", label: "Worsening" },
};

export const DiagnosisHistory: React.FC<DiagnosisHistoryProps> = ({
  history,
  onSelect,
}) => {
  if (history.length === 0) return null;

  return (
    <motion.section
      role="region"
      aria-label="Diagnosis history"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <History size={16} className="text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">
          Diagnosis History
        </h2>
        <Badge variant="info" className="text-[10px] ml-auto">
          {history.length} scans
        </Badge>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {history.map((item, i) => {
          const severityCfg = SEVERITY_CONFIG[item.severity];
          const trendCfg = item.improvement_trend
            ? TREND_CONFIG[item.improvement_trend]
            : undefined;
          const TrendIcon = trendCfg?.icon;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => onSelect?.(item.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
            >
              {/* Timeline dot */}
              <div className="relative flex flex-col items-center">
                <div
                  className={cn(
                    "h-3 w-3 rounded-full border-2",
                    i === 0
                      ? "border-primary bg-primary/20"
                      : "border-border bg-background",
                  )}
                />
                {i < history.length - 1 && (
                  <div className="w-px h-6 bg-border mt-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {item.disease_name}
                  </p>
                  <Badge
                    className={cn(
                      "text-[9px] shrink-0",
                      severityCfg.color,
                      severityCfg.bg,
                    )}
                  >
                    {severityCfg.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    {item.crop}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {"\u00B7"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {Math.round(item.confidence * 100)}%
                  </span>
                  {TrendIcon && (
                    <>
                      <span className="text-[10px] text-muted-foreground">
                        {"\u00B7"}
                      </span>
                      <TrendIcon size={10} className={trendCfg!.color} />
                      <span className={cn("text-[10px]", trendCfg!.color)}>
                        {trendCfg!.label}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="text-right shrink-0">
                <p className="text-[10px] text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <ChevronRight
                  size={12}
                  className="text-muted-foreground ml-auto"
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
};

DiagnosisHistory.displayName = "DiagnosisHistory";
