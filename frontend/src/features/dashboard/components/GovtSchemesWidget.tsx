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
  if (!schemes || schemes.length === 0) {
    return (
      <section
        role="region"
        aria-label="Government Schemes & Subsidies"
        className="rounded-2xl border border-border bg-card p-6 text-center flex flex-col items-center gap-3 shadow-sm"
      >
        <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400 shrink-0">
          <Landmark size={28} aria-hidden="true" />
        </div>
        <h2 className="text-base font-extrabold text-foreground">
          No Active Scheme Notifications
        </h2>
        <p className="text-xs text-muted-foreground max-w-xs">
          Explore government subsidies, PM-Kisan DBT updates, and agricultural
          loan waivers tailored to your state.
        </p>
        <Link href="/schemes">
          <span className="inline-flex items-center text-xs font-bold text-primary hover:underline min-h-[48px]">
            Browse All Schemes →
          </span>
        </Link>
      </section>
    );
  }

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
            size={20}
            className="text-blue-600 dark:text-blue-400 shrink-0"
            aria-hidden="true"
          />
          <h2 className="font-extrabold text-sm sm:text-base text-foreground">
            Government Schemes &amp; Financial Aid
          </h2>
        </div>
        <Link
          href="/schemes"
          aria-label="View all government schemes and subsidies"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl px-3 py-2 min-h-[48px]"
        >
          View All <ArrowUpRight size={14} aria-hidden="true" />
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
                <span className="font-extrabold text-sm text-foreground line-clamp-1">
                  {scheme.title}
                </span>
                <Badge
                  variant={
                    scheme.statusBadge === "Eligible" ? "success" : "warning"
                  }
                  className="text-[11px] font-bold shrink-0 px-2.5 py-0.5"
                >
                  {scheme.statusBadge}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {scheme.summary}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-border/40 text-xs font-semibold">
              <span className="text-primary flex items-center gap-1">
                <CheckCircle2
                  size={14}
                  className="shrink-0"
                  aria-hidden="true"
                />{" "}
                {scheme.benefitAmount}
              </span>
              {scheme.deadline && (
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Calendar size={13} className="shrink-0" aria-hidden="true" />{" "}
                  {scheme.deadline}
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
