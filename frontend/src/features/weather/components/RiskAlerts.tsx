"use client";

// ─────────────────────────────────────────────────────────────────────────────
// RiskAlerts.tsx
// KisanGPT — Weather risk alerts with severity and suggested actions
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CloudRain,
  Flame,
  Snowflake,
  Wind,
  CloudLightning,
  Sun,
  CloudFog,
  ChevronDown,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import {
  RISK_SEVERITY_COLORS,
  RISK_SEVERITY_BADGE,
} from "../constants/weather.constants";
import type { RiskAlert, RiskType } from "../types/weather.types";

// ---------------------------------------------------------------------------
// Risk type → icon
// ---------------------------------------------------------------------------

const RISK_ICONS: Record<RiskType, React.ElementType> = {
  "heavy-rain": CloudRain,
  heatwave: Flame,
  frost: Snowflake,
  "strong-wind": Wind,
  storm: CloudLightning,
  "high-uv": Sun,
  fog: CloudFog,
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface RiskAlertsProps {
  alerts: RiskAlert[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const RiskAlerts: React.FC<RiskAlertsProps> = ({ alerts }) => {
  if (alerts.length === 0) return null;

  return (
    <motion.section
      role="region"
      aria-label="Weather risk alerts"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle
          size={16}
          className="text-amber-500"
          aria-hidden="true"
        />
        <h2 className="text-sm font-semibold text-foreground">Risk Alerts</h2>
        <Badge variant="warning" className="text-[10px] ml-auto">
          {alerts.length} active
        </Badge>
      </div>

      {/* Alert cards */}
      <AnimatePresence>
        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <RiskAlertCard key={alert.id} alert={alert} index={i} />
          ))}
        </div>
      </AnimatePresence>
    </motion.section>
  );
};

RiskAlerts.displayName = "RiskAlerts";

// ---------------------------------------------------------------------------
// Individual Alert Card
// ---------------------------------------------------------------------------

interface RiskAlertCardProps {
  alert: RiskAlert;
  index: number;
}

function RiskAlertCard({ alert, index }: RiskAlertCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const Icon = RISK_ICONS[alert.type] ?? AlertTriangle;
  const severityColor = RISK_SEVERITY_COLORS[alert.severity];
  const badgeVariant = RISK_SEVERITY_BADGE[alert.severity];

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className={cn("rounded-xl border overflow-hidden", severityColor)}
    >
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start gap-3 p-3.5 text-left hover:bg-white/20 dark:hover:bg-white/5 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="p-2 rounded-lg bg-white/50 dark:bg-white/10 shrink-0">
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold">{alert.title}</span>
            <Badge variant={badgeVariant} className="text-[9px] px-1.5 py-0">
              {alert.severity}
            </Badge>
          </div>
          <p className="text-xs opacity-80 line-clamp-1">{alert.description}</p>
        </div>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 mt-1 transition-transform",
            isExpanded && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5 pt-0 space-y-2">
              <p className="text-xs leading-relaxed">{alert.description}</p>
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/30 dark:bg-white/5">
                <Shield size={14} className="shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70 mb-0.5">
                    Suggested Action
                  </p>
                  <p className="text-xs leading-relaxed">{alert.action}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
