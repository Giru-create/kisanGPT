"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, X, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { EmergencyAlert } from "../types/dashboard.types";
import {
  useDashboardStore,
  selectDismissedAlertId,
} from "../store/dashboardStore";

interface EmergencyAlertBannerProps {
  alert?: EmergencyAlert;
}

export const EmergencyAlertBanner: React.FC<EmergencyAlertBannerProps> = ({
  alert,
}) => {
  const dismissedId = useDashboardStore(selectDismissedAlertId);
  const dismiss = useDashboardStore((s) => s.dismissEmergencyAlert);

  if (!alert || alert.id === dismissedId) return null;

  const isCritical = alert.severity === "critical";

  return (
    <motion.aside
      role="alert"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`relative w-full rounded-2xl border p-4 sm:p-5 shadow-sm ${
        isCritical
          ? "border-red-500/25 bg-red-500/5 dark:bg-red-500/10"
          : "border-amber-500/25 bg-amber-500/5 dark:bg-amber-500/10"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
              isCritical ? "bg-red-500/10" : "bg-amber-500/10"
            }`}
          >
            {isCritical ? (
              <ShieldAlert
                size={20}
                className="text-red-500 motion-safe:animate-pulse"
                aria-hidden="true"
              />
            ) : (
              <AlertTriangle
                size={20}
                className="text-amber-500"
                aria-hidden="true"
              />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="font-semibold text-sm text-foreground">
              {alert.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {alert.message}
            </p>
            <p className="text-xs font-medium text-foreground bg-muted/50 px-3 py-1.5 rounded-lg inline-block mt-1">
              {alert.actionAdvice}
            </p>
          </div>
        </div>

        {alert.dismissible && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dismiss(alert.id)}
            aria-label="Dismiss emergency alert"
            className="h-8 w-8 p-0 rounded-lg shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </Button>
        )}
      </div>
    </motion.aside>
  );
};

EmergencyAlertBanner.displayName = "EmergencyAlertBanner";
