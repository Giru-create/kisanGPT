"use client";

// ─────────────────────────────────────────────────────────────────────────────
// CropHealthWidget.tsx
// KisanGPT — Section 4: Crop Health & Disease Diagnostics Summary
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Link from "next/link";
import {
  Sprout,
  Camera,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { CropFieldStatus } from "../types/dashboard.types";

interface CropHealthWidgetProps {
  fields: CropFieldStatus[];
}

export const CropHealthWidget: React.FC<CropHealthWidgetProps> = ({
  fields,
}) => {
  if (!fields || fields.length === 0) {
    return (
      <section
        role="region"
        aria-label="Crop Health Summary"
        className="rounded-2xl border border-border bg-card p-6 text-center flex flex-col items-center gap-3 shadow-sm"
      >
        <div className="rounded-full bg-primary/10 p-4 text-primary">
          <Sprout size={32} />
        </div>
        <h2 className="text-base font-semibold text-foreground">
          No crop fields added yet
        </h2>
        <p className="text-xs text-muted-foreground max-w-xs">
          Add your crop field details to receive tailored disease alerts and
          irrigation recommendations.
        </p>
        <Button variant="primary" size="md" leftIcon={<Sprout size={16} />}>
          + Add Crop Field
        </Button>
      </section>
    );
  }

  return (
    <section
      role="region"
      aria-label="Crop Health Summary"
      className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sprout size={18} className="text-primary" aria-hidden="true" />
          <h2 className="font-semibold text-sm sm:text-base text-foreground">
            Crop Health Diagnostics
          </h2>
        </div>
        <Link
          href="/disease"
          className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
        >
          Scan Leaf <Camera size={14} className="ml-1" />
        </Link>
      </div>

      {/* Field Cards List */}
      <div className="flex flex-col gap-3">
        {fields.map((field) => {
          const isAtRisk =
            field.status === "at_risk" || field.status === "action_required";

          return (
            <div
              key={field.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border ${
                isAtRisk
                  ? "border-amber-500/30 bg-amber-500/5"
                  : "border-border bg-muted/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5" aria-hidden="true">
                  {isAtRisk ? (
                    <AlertTriangle size={18} className="text-amber-500" />
                  ) : (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  )}
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">
                      {field.fieldName}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      ({field.cropName})
                    </span>
                  </div>

                  {field.lastScanResult && (
                    <p className="text-xs text-muted-foreground">
                      Scan Result:{" "}
                      <span
                        className={
                          isAtRisk
                            ? "font-semibold text-amber-700 dark:text-amber-300"
                            : "font-medium"
                        }
                      >
                        {field.lastScanResult}
                      </span>
                    </p>
                  )}

                  {field.nextAction && (
                    <p className="text-xs font-semibold text-primary mt-0.5">
                      👉 {field.nextAction}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
                <Badge
                  variant={isAtRisk ? "warning" : "success"}
                  className="text-xs px-2.5 py-0.5"
                >
                  {field.healthPercent}% Health
                </Badge>

                <Link
                  href="/disease"
                  aria-label={`View diagnostics for ${field.fieldName}`}
                  className="p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

CropHealthWidget.displayName = "CropHealthWidget";
