"use client";

import React from "react";
import { motion } from "framer-motion";
import { Pill, Leaf, Sprout, Wrench, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { EnhancedTreatment } from "../types/disease.types";

interface TreatmentPlanProps {
  treatments: EnhancedTreatment[];
}

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  chemical: {
    label: "Chemical",
    icon: Pill,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  biological: {
    label: "Biological",
    icon: Leaf,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  cultural: {
    label: "Cultural",
    icon: Sprout,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  mechanical: {
    label: "Mechanical",
    icon: Wrench,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
};

const URGENCY_CONFIG: Record<
  string,
  { label: string; variant: "error" | "warning" | "info" }
> = {
  immediate: { label: "Immediate", variant: "error" },
  within_days: { label: "Within Days", variant: "warning" },
  preventive: { label: "Preventive", variant: "info" },
};

export const TreatmentPlan: React.FC<TreatmentPlanProps> = ({ treatments }) => {
  if (treatments.length === 0) return null;

  return (
    <motion.section
      role="region"
      aria-label="Treatment plan"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Pill size={16} className="text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">
          Treatment Plan
        </h2>
        <Badge variant="info" className="text-[10px] ml-auto">
          {treatments.length} actions
        </Badge>
      </div>

      {/* Treatment cards */}
      <div className="space-y-3">
        {treatments.map((treatment, i) => {
          const typeCfg = (TYPE_CONFIG[treatment.type] ??
            TYPE_CONFIG.cultural)!;
          const urgencyCfg = (URGENCY_CONFIG[treatment.urgency] ??
            URGENCY_CONFIG.preventive)!;
          const TypeIcon = typeCfg.icon;

          return (
            <motion.div
              key={treatment.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="rounded-xl border border-border p-3.5"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-lg flex items-center justify-center",
                      typeCfg.bg,
                    )}
                  >
                    <TypeIcon size={14} className={typeCfg.color} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {treatment.name}
                    </p>
                    <Badge
                      className={cn("text-[9px]", typeCfg.color, typeCfg.bg)}
                    >
                      {typeCfg.label}
                    </Badge>
                  </div>
                </div>
                <Badge variant={urgencyCfg.variant} className="text-[9px]">
                  <Clock size={8} className="mr-0.5" />
                  {urgencyCfg.label}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
                {treatment.description}
              </p>

              {/* Details grid */}
              {treatment.dosage && (
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {treatment.dosage && (
                    <div>
                      <span className="text-muted-foreground">Dosage: </span>
                      <span className="font-medium text-foreground">
                        {treatment.dosage}
                      </span>
                    </div>
                  )}
                  {treatment.frequency && (
                    <div>
                      <span className="text-muted-foreground">Frequency: </span>
                      <span className="font-medium text-foreground">
                        {treatment.frequency}
                      </span>
                    </div>
                  )}
                  {treatment.waitingPeriod && (
                    <div>
                      <span className="text-muted-foreground">Waiting: </span>
                      <span className="font-medium text-foreground">
                        {treatment.waitingPeriod}
                      </span>
                    </div>
                  )}
                  {treatment.cost && (
                    <div>
                      <span className="text-muted-foreground">Cost: </span>
                      <span className="font-medium text-foreground">
                        {treatment.cost}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

TreatmentPlan.displayName = "TreatmentPlan";
