"use client";

// ─────────────────────────────────────────────────────────────────────────────
// EmergencyAlertBanner.tsx
// KisanGPT — Section 11: Emergency Hazard Alerts Banner
// ─────────────────────────────────────────────────────────────────────────────

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
      aria-live="assertive"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className={`relative w-full rounded-xl border border-l-4 p-4 shadow-sm transition-all ${
        isCritical
          ? "border-red-500/40 border-l-red-600 bg-red-500/10 text-red-950 dark:text-red-200"
          : "border-amber-500/40 border-l-amber-500 bg-amber-500/10 text-amber-950 dark:text-amber-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5" aria-hidden="true">
            {isCritical ? (
              <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400 motion-safe:animate-pulse" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-base leading-tight">
              {alert.title}
            </h3>
            <p className="text-sm opacity-90 leading-normal">{alert.message}</p>
            <p className="text-xs font-semibold mt-1 opacity-100 bg-black/5 dark:bg-white/10 p-2 rounded-lg inline-block">
              👉 Action Needed: {alert.actionAdvice}
            </p>
          </div>
        </div>

        {alert.dismissible && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dismiss(alert.id)}
            aria-label="Dismiss emergency alert"
            className="h-9 w-9 p-0 rounded-full shrink-0 text-foreground hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X size={18} />
          </Button>
        )}
      </div>
    </motion.aside>
  );
};

EmergencyAlertBanner.displayName = "EmergencyAlertBanner";
