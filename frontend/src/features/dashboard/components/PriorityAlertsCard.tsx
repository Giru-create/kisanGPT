"use client";

import React from "react";
import Link from "next/link";
import {
  Landmark,
  ArrowUpRight,
  Snowflake,
  Bug,
  CloudRain,
} from "lucide-react";
import type { PriorityAlert } from "../types/dashboard.types";

interface PriorityAlertsCardProps {
  alerts: PriorityAlert[];
}

const ALERT_ICON_MAP: Record<
  PriorityAlert["type"],
  { icon: React.ElementType; color: string; bg: string }
> = {
  frost: {
    icon: Snowflake,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  subsidy: {
    icon: Landmark,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  weather: {
    icon: CloudRain,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  pest: {
    icon: Bug,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
};

export const PriorityAlertsCard: React.FC<PriorityAlertsCardProps> = ({
  alerts,
}) => {
  return (
    <section
      role="region"
      aria-label="Priority Alerts"
      className="rounded-2xl border border-border bg-card shadow-sm"
    >
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <h2 className="ds-label-sm uppercase tracking-wider">
          Priority Alerts
        </h2>
      </div>

      <div className="px-3 pb-3 flex flex-col gap-1">
        {alerts.map((alert) => {
          const {
            icon: Icon,
            color,
            bg,
          } = ALERT_ICON_MAP[alert.type] ?? ALERT_ICON_MAP.frost;

          return (
            <div
              key={alert.id}
              className="flex items-center gap-3.5 px-3 py-3.5 hover:bg-muted/40 rounded-xl transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}
              >
                <Icon size={18} className={color} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {alert.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {alert.description}
                </p>
              </div>
              <Link
                href="/weather"
                className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors min-h-[36px] px-2"
              >
                {alert.type === "frost" ? "Review" : "Details"}
                <ArrowUpRight size={12} aria-hidden="true" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

PriorityAlertsCard.displayName = "PriorityAlertsCard";
