// ─────────────────────────────────────────────────────────────────────────────
// DetectionResultCard.tsx
// KisanGPT — Diagnosis result display card
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { TreatmentList } from "./TreatmentList";
import type { DiagnosisResult, DiseaseSeverity } from "../types/disease.types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DetectionResultCardProps {
  result: DiagnosisResult;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function confidencePercent(c: number): string {
  return `${Math.round(c * 100)}%`;
}

function confidenceColor(c: number): string {
  if (c >= 0.8) return "text-green-600 dark:text-green-400";
  if (c >= 0.5) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

const SEVERITY_CONFIG: Record<
  DiseaseSeverity,
  { icon: React.ElementType; variant: "error" | "warning" | "info" | "default"; label: string }
> = {
  critical: {
    icon: AlertTriangle,
    variant: "error",
    label: "Critical",
  },
  high: {
    icon: ShieldAlert,
    variant: "warning",
    label: "High",
  },
  medium: {
    icon: Info,
    variant: "info",
    label: "Medium",
  },
  low: {
    icon: ShieldCheck,
    variant: "default",
    label: "Low",
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const DetectionResultCard: React.FC<DetectionResultCardProps> = ({
  result,
  className,
}) => {
  const sev = SEVERITY_CONFIG[result.severity] ?? SEVERITY_CONFIG.medium;
  const SevIcon = sev.icon;

  return (
    <article
      className={cn(
        "rounded-xl border border-border bg-card p-4 sm:p-6 space-y-4",
        className,
      )}
      aria-label={`Diagnosis: ${result.disease_name}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            {result.is_healthy ? "Healthy Plant" : result.disease_name}
          </h2>
          <p className="text-sm text-muted-foreground">
            Crop: {result.crop}
          </p>
        </div>

        <Badge variant={sev.variant} className="flex items-center gap-1">
          <SevIcon size={12} aria-hidden="true" />
          {sev.label}
        </Badge>
      </div>

      {/* Confidence */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Confidence:</span>
        <span
          className={cn("text-sm font-semibold", confidenceColor(result.confidence))}
          aria-label={`Confidence: ${confidencePercent(result.confidence)}`}
        >
          {confidencePercent(result.confidence)}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {result.description}
      </p>

      {/* Similar diseases */}
      {result.similar_diseases.length > 0 && (
        <div>
          <span className="text-xs text-muted-foreground">
            Could also be:
          </span>{" "}
          <span className="text-xs text-foreground">
            {result.similar_diseases.join(", ")}
          </span>
        </div>
      )}

      {/* Treatments */}
      <TreatmentList treatments={result.treatments} />

      {/* Prevention */}
      {result.prevention.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">
            Prevention Tips
          </h3>
          <ul className="list-disc list-inside space-y-1" role="list">
            {result.prevention.map((tip, i) => (
              <li
                key={i}
                className="text-xs text-muted-foreground leading-relaxed"
              >
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[10px] text-muted-foreground italic border-t border-border pt-3">
        AI-generated diagnosis. Consult a local agricultural expert for
        confirmation.
      </p>
    </article>
  );
};

DetectionResultCard.displayName = "DetectionResultCard";
