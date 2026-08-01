"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Lightbulb, Sprout, CloudRain } from "lucide-react";
import { Card } from "@/components/ui";
import type { MarketTrendItem, PriorityAlert } from "../types/dashboard.types";

interface InsightsSectionProps {
  marketTrends: MarketTrendItem[];
  priorityAlerts: PriorityAlert[];
}

const ALERT_ICONS: Record<PriorityAlert["type"], React.ElementType> = {
  frost: CloudRain,
  subsidy: Sprout,
  weather: CloudRain,
  pest: Sprout,
};

const ALERT_COLORS: Record<PriorityAlert["type"], string> = {
  frost: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  subsidy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  weather: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  pest: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export const InsightsSection: React.FC<InsightsSectionProps> = ({
  marketTrends,
  priorityAlerts,
}) => {
  return (
    <section role="region" aria-label="Farm Insights">
      <div className="ds-section-header">
        <div className="ds-section-header-bar" />
        <h2>Farm Insights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Market insight */}
        {marketTrends[0] && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="interactive" padding="md" className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="ds-icon-container-sm bg-violet-500/10">
                  <Lightbulb
                    size={18}
                    className="text-violet-600 dark:text-violet-400"
                    aria-hidden="true"
                  />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Market Intelligence
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground leading-snug">
                {marketTrends[0].commodity} prices{" "}
                {marketTrends[0].isRise ? "surged" : "dropped"} by{" "}
                <span
                  className={
                    marketTrends[0].isRise
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  {marketTrends[0].isRise ? "+" : ""}
                  {marketTrends[0].changePercent}%
                </span>{" "}
                today.
              </p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                AI recommends{" "}
                {marketTrends[0].isRise
                  ? "holding for 10-14 days for peak pricing"
                  : "selling now before further decline"}
                .
              </p>
            </Card>
          </motion.div>
        )}

        {/* Priority alert insights */}
        {priorityAlerts.slice(0, 2).map((alert, index) => {
          const AlertIcon = ALERT_ICONS[alert.type] ?? CloudRain;
          const colorClass = ALERT_COLORS[alert.type] ?? ALERT_COLORS.frost;

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
            >
              <Card
                variant="interactive"
                padding="md"
                className="h-full border-current/20 bg-current/5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`ds-icon-container-sm ${colorClass}`}>
                    <AlertIcon size={18} aria-hidden="true" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Priority Alert
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {alert.title}
                </p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {alert.description}
                </p>
              </Card>
            </motion.div>
          );
        })}

        {/* Quick action card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card
            variant="muted"
            padding="md"
            className="h-full border-dashed flex flex-col items-center justify-center text-center"
          >
            <Link href="/advisor" className="flex flex-col items-center gap-3">
              <div className="ds-icon-lg bg-primary/10 flex items-center justify-center rounded-2xl">
                <TrendingUp
                  size={22}
                  className="text-primary"
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Get AI Analysis
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ask about any farming topic
                </p>
              </div>
            </Link>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

InsightsSection.displayName = "InsightsSection";
