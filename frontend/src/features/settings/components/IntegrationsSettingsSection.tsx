// ─────────────────────────────────────────────────────────────────────────────
// IntegrationsSettingsSection.tsx
// KisanGPT — Integrations settings section
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cloud, CloudSun, Landmark, TrendingUp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingsSection } from "./SettingsSection";
import { Button } from "@/components/ui/Button";
import type { IntegrationItem } from "../types/settings.types";

const INTEGRATION_ICONS: Record<string, React.FC<{ className?: string }>> = {
  cloud: Cloud,
  "cloud-sun": CloudSun,
  landmark: Landmark,
  "trending-up": TrendingUp,
};

const CATEGORY_LABELS: Record<string, string> = {
  cloud: "Cloud Storage",
  weather: "Weather Services",
  government: "Government Portals",
  market: "Market APIs",
  future: "Coming Soon",
};

interface IntegrationsSettingsSectionProps {
  integrations: IntegrationItem[];
}

export const IntegrationsSettingsSection: React.FC<
  IntegrationsSettingsSectionProps
> = ({ integrations }) => {
  const grouped = integrations.reduce<Record<string, IntegrationItem[]>>(
    (acc, item) => {
      const key = item.category;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([category, items], sectionIdx) => (
        <SettingsSection
          key={category}
          title={CATEGORY_LABELS[category] ?? category}
          delay={sectionIdx * 0.05}
        >
          <div className="space-y-2">
            {items.map((integration, idx) => {
              const Icon = INTEGRATION_ICONS[integration.icon];
              return (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-muted/30",
                    "hover:bg-muted/50 transition-colors duration-200",
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                      integration.connected
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {integration.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {integration.description}
                    </p>
                  </div>
                  <Button
                    variant={integration.connected ? "outline" : "primary"}
                    size="sm"
                  >
                    {integration.connected ? "Connected" : "Connect"}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </SettingsSection>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
      >
        <Button variant="outline" className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Browse More Integrations
        </Button>
      </motion.div>
    </div>
  );
};

IntegrationsSettingsSection.displayName = "IntegrationsSettingsSection";
