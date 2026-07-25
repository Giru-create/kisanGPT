// ─────────────────────────────────────────────────────────────────────────────
// TreatmentList.tsx
// KisanGPT — Treatment recommendations list
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { TreatmentRecommendation } from "../types/disease.types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TreatmentListProps {
  treatments: TreatmentRecommendation[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TYPE_LABELS: Record<string, string> = {
  chemical: "Chemical",
  cultural: "Cultural",
  biological: "Biological",
  mechanical: "Mechanical",
};

const URGENCY_VARIANT: Record<string, "error" | "warning" | "info" | "default"> = {
  immediate: "error",
  within_days: "warning",
  preventive: "info",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TreatmentList: React.FC<TreatmentListProps> = ({
  treatments,
  className,
}) => {
  if (treatments.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-sm font-semibold text-foreground">
        Treatment Recommendations
      </h3>

      <ul className="space-y-2" role="list">
        {treatments.map((t, i) => (
          <li
            key={`${t.name}-${i}`}
            className="rounded-lg border border-border p-3 bg-card"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-sm font-medium text-foreground">
                {t.name}
              </span>
              <div className="flex gap-1 shrink-0">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {TYPE_LABELS[t.type] ?? t.type}
                </Badge>
                <Badge
                  variant={URGENCY_VARIANT[t.urgency] ?? "default"}
                  className="text-[10px] px-1.5 py-0"
                >
                  {t.urgency.replace("_", " ")}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

TreatmentList.displayName = "TreatmentList";
