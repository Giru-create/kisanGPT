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
        className="rounded-2xl border border-border bg-card p-6 sm:p-8 text-center flex flex-col items-center gap-4 shadow-sm"
      >
        <div className="rounded-2xl bg-primary/10 p-4 text-primary shrink-0">
          <Sprout size={36} aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1 max-w-sm">
          <h2 className="text-base sm:text-lg font-extrabold text-foreground">
            No Crop Fields Added Yet
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Add your crop field details or scan a crop leaf to receive
            AI-powered disease alerts and spray recommendations.
          </p>
        </div>
        <Link href="/disease">
          <Button
            variant="primary"
            size="md"
            className="min-h-[48px] px-5 font-bold"
            leftIcon={<Camera size={18} aria-hidden="true" />}
          >
            Scan Crop Leaf Now
          </Button>
        </Link>
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
          <Sprout
            size={20}
            className="text-primary shrink-0"
            aria-hidden="true"
          />
          <h2 className="font-extrabold text-sm sm:text-base text-foreground">
            Crop Health Diagnostics
          </h2>
        </div>
        <Link
          href="/disease"
          aria-label="Scan crop leaf for disease diagnostic"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl px-3 py-2 min-h-[48px]"
        >
          Scan Leaf <Camera size={16} aria-hidden="true" />
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
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border ${
                isAtRisk
                  ? "border-amber-500/30 bg-amber-500/5"
                  : "border-border bg-muted/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0" aria-hidden="true">
                  {isAtRisk ? (
                    <AlertTriangle size={20} className="text-amber-500" />
                  ) : (
                    <CheckCircle2 size={20} className="text-emerald-500" />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base text-foreground">
                      {field.fieldName}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      ({field.cropName})
                    </span>
                  </div>

                  {field.lastScanResult && (
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Scan Result:{" "}
                      <span
                        className={
                          isAtRisk
                            ? "font-bold text-amber-700 dark:text-amber-300"
                            : "font-semibold text-foreground"
                        }
                      >
                        {field.lastScanResult}
                      </span>
                    </p>
                  )}

                  {field.nextAction && (
                    <p className="text-xs font-bold text-primary mt-0.5">
                      👉 {field.nextAction}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/40">
                <Badge
                  variant={isAtRisk ? "warning" : "success"}
                  className="text-xs font-bold px-3 py-1 min-h-[32px]"
                >
                  {field.healthPercent}% Health
                </Badge>

                <Link
                  href="/disease"
                  aria-label={`View detailed diagnostics for ${field.fieldName}`}
                  className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl shrink-0 min-h-[48px] min-w-[48px] flex items-center justify-center transition-colors"
                >
                  <ChevronRight size={20} aria-hidden="true" />
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
