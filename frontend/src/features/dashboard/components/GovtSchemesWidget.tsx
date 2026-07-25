"use client";

// ─────────────────────────────────────────────────────────────────────────────
// GovtSchemesWidget.tsx
// KisanGPT — Section 6: Government Schemes & Subsidies Widget
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Link from "next/link";
import { Landmark, ArrowUpRight, Calendar, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { GovtSchemeItem } from "../types/dashboard.types";

interface GovtSchemesWidgetProps {
  schemes: GovtSchemeItem[];
}

export const GovtSchemesWidget: React.FC<GovtSchemesWidgetProps> = ({
  schemes,
}) => {
  return (
    <section
      role="region"
      aria-label="Government Schemes & Subsidies"
      className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Landmark
            size={18}
            className="text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          />
          <h2 className="font-semibold text-sm sm:text-base text-foreground">
            Government Schemes & Financial Aid
          </h2>
        </div>
        <Link
          href="/schemes"
          className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
        >
          View All <ArrowUpRight size={14} className="ml-0.5" />
        </Link>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            className="flex flex-col justify-between gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40 transition-colors"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-sm text-foreground line-clamp-1">
                  {scheme.title}
                </span>
                <Badge
                  variant={
                    scheme.statusBadge === "Eligible" ? "success" : "warning"
                  }
                  className="text-[10px] shrink-0 px-2 py-0.5"
                >
                  {scheme.statusBadge}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2">
                {scheme.summary}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
              <span className="font-bold text-primary flex items-center gap-1">
                <CheckCircle2 size={13} /> {scheme.benefitAmount}
              </span>
              {scheme.deadline && (
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Calendar size={12} /> {scheme.deadline}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

GovtSchemesWidget.displayName = "GovtSchemesWidget";
