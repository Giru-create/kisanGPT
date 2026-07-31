"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FarmImpact.tsx
// KisanGPT — Shows how weather affects farm operations
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { motion } from "framer-motion";
import {
  Sprout,
  Droplets,
  Bug,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FARM_IMPACT_LABELS,
  FARM_IMPACT_COLORS,
  FARM_IMPACT_BG_COLORS,
} from "../constants/weather.constants";
import type {
  FarmImpactItem,
  FarmImpactArea,
  FarmImpactLevel,
} from "../types/weather.types";

// ---------------------------------------------------------------------------
// Area → icon
// ---------------------------------------------------------------------------

const AREA_ICONS: Record<FarmImpactArea, React.ElementType> = {
  "crop-health": Sprout,
  "soil-moisture": Droplets,
  "pest-risk": Bug,
  irrigation: Droplets,
  harvest: Calendar,
};

// ---------------------------------------------------------------------------
// Level → icon
// ---------------------------------------------------------------------------

const LEVEL_ICONS: Record<FarmImpactLevel, React.ElementType> = {
  positive: CheckCircle2,
  neutral: ArrowRight,
  negative: AlertTriangle,
  critical: XCircle,
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface FarmImpactProps {
  impacts: FarmImpactItem[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const FarmImpact: React.FC<FarmImpactProps> = ({ impacts }) => {
  if (impacts.length === 0) return null;

  return (
    <motion.section
      role="region"
      aria-label="Farm weather impact"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sprout size={16} className="text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">Farm Impact</h2>
      </div>

      {/* Impact cards */}
      <div className="space-y-3">
        {impacts.map((impact, i) => {
          const AreaIcon = AREA_ICONS[impact.area] ?? Sprout;
          const LevelIcon = LEVEL_ICONS[impact.level] ?? ArrowRight;
          const levelColor = FARM_IMPACT_COLORS[impact.level];
          const levelBg = FARM_IMPACT_BG_COLORS[impact.level];

          return (
            <motion.div
              key={impact.area}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className={cn(
                "flex items-start gap-3 p-3.5 rounded-xl border border-border",
                levelBg,
              )}
            >
              <div className={cn("p-2 rounded-lg shrink-0", levelBg)}>
                <AreaIcon size={18} className={levelColor} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {FARM_IMPACT_LABELS[impact.area]}
                  </span>
                  <LevelIcon size={12} className={levelColor} />
                </div>
                <p className="text-sm font-medium text-foreground mb-0.5">
                  {impact.title}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {impact.description}
                </p>
                {impact.action && (
                  <p className={cn("text-xs font-medium mt-1.5", levelColor)}>
                    {impact.action}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

FarmImpact.displayName = "FarmImpact";
