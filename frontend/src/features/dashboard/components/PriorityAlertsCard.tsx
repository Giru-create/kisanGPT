"use client";

import React from "react";
import { AlertTriangle, Landmark } from "lucide-react";
import type { PriorityAlert } from "../types/dashboard.types";

interface PriorityAlertsCardProps {
  alerts: PriorityAlert[];
}

const ALERT_ICON_MAP: Record<
  PriorityAlert["type"],
  { icon: React.ElementType; color: string }
> = {
  frost: { icon: AlertTriangle, color: "text-red-500" },
  subsidy: { icon: Landmark, color: "text-emerald-600 dark:text-emerald-400" },
  weather: { icon: AlertTriangle, color: "text-amber-500" },
  pest: { icon: AlertTriangle, color: "text-red-500" },
};

export const PriorityAlertsCard: React.FC<PriorityAlertsCardProps> = ({
  alerts,
}) => {
  return (
    <section
      role="region"
      aria-label="Priority Alerts"
      className="flex flex-col gap-3"
    >
      <h2 className="font-semibold text-base text-foreground">
        Priority Alerts
      </h2>

      {alerts.map((alert) => {
        const { icon: Icon, color } =
          ALERT_ICON_MAP[alert.type] ?? ALERT_ICON_MAP.frost;

        return (
          <div
            key={alert.id}
            className={`bg-card border border-border rounded-xl p-4 flex gap-3 items-center shadow-sm border-l-4 ${alert.borderColor}`}
          >
            <Icon
              size={20}
              className={`${color} shrink-0`}
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">{alert.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {alert.description}
              </p>
            </div>
            <button
              type="button"
              className="text-xs font-bold text-primary px-3 py-2 shrink-0 hover:underline min-h-[44px]"
            >
              {alert.type === "frost" ? "Review" : "Details"}
            </button>
          </div>
        );
      })}
    </section>
  );
};

PriorityAlertsCard.displayName = "PriorityAlertsCard";
