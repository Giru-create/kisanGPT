"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FarmContextSidebar.tsx
// KisanGPT — Right sidebar with farm context, weather, alerts, memory, recommendations
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout,
  MapPin,
  CloudSun,
  AlertTriangle,
  Info,
  CheckCircle2,
  Brain,
  Bookmark,
  Droplets,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { useAdvisorStore } from "../store/advisorStore";
import {
  MOCK_FARM_CONTEXT,
  MOCK_WEATHER_SUMMARY,
  MOCK_FARM_ALERTS,
  MOCK_MEMORY_SUMMARY,
  MOCK_SAVED_RECOMMENDATIONS,
  MOCK_CONVERSATION_HISTORY,
} from "../constants/advisor.constants";

export const FarmContextSidebar: React.FC = () => {
  const { showRightPanel } = useAdvisorStore();

  return (
    <AnimatePresence>
      {showRightPanel && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="hidden xl:flex flex-col h-full border-l border-border bg-card/50 overflow-hidden shrink-0"
          aria-label="Farm Context Sidebar"
        >
          <div className="flex flex-col h-full w-80 px-5 py-6 gap-6 overflow-y-auto">
            {/* Farm Profile Card */}
            <section>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Farm Profile
              </h3>
              <div className="bg-muted/50 rounded-xl p-4 border border-border space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sprout size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {MOCK_FARM_CONTEXT.farmName}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin size={12} aria-hidden="true" />
                      {MOCK_FARM_CONTEXT.location}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-background px-2.5 py-1.5 rounded-lg">
                    <p className="text-[10px] text-muted-foreground">
                      Active Crop
                    </p>
                    <p className="text-sm font-medium">
                      {MOCK_FARM_CONTEXT.activeCrop}
                    </p>
                  </div>
                  <div className="bg-background px-2.5 py-1.5 rounded-lg">
                    <p className="text-[10px] text-muted-foreground">Soil PH</p>
                    <p className="text-sm font-medium">
                      {MOCK_FARM_CONTEXT.soilPH} ({MOCK_FARM_CONTEXT.soilHealth}
                      )
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Weather Summary */}
            <section>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Weather Summary
              </h3>
              <div className="bg-muted/50 rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <CloudSun
                    size={20}
                    className="text-sky-500"
                    aria-hidden="true"
                  />
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold text-foreground">
                      {MOCK_WEATHER_SUMMARY.temperature}°C
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {MOCK_WEATHER_SUMMARY.condition}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                  <Droplets size={12} className="text-blue-500" />
                  <span>{MOCK_WEATHER_SUMMARY.humidity}% humidity</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {MOCK_WEATHER_SUMMARY.advisory}
                </p>
              </div>
            </section>

            {/* Recent Alerts */}
            <section>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Recent Alerts
              </h3>
              <div className="space-y-2">
                {MOCK_FARM_ALERTS.map((alert) => {
                  const AlertIcon =
                    alert.type === "warning"
                      ? AlertTriangle
                      : alert.type === "success"
                        ? CheckCircle2
                        : Info;
                  const alertColor =
                    alert.type === "warning"
                      ? "text-amber-500"
                      : alert.type === "success"
                        ? "text-emerald-500"
                        : "text-blue-500";

                  return (
                    <div
                      key={alert.id}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/30"
                    >
                      <AlertIcon
                        size={14}
                        className={cn("shrink-0 mt-0.5", alertColor)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {alert.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {alert.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Memory Summary */}
            <section>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Memory Summary
              </h3>
              <div className="bg-muted/50 rounded-xl p-4 border border-border space-y-2.5">
                <div className="flex items-center gap-2">
                  <Brain size={14} className="text-primary" />
                  <span className="text-xs font-semibold text-foreground">
                    {MOCK_MEMORY_SUMMARY.totalInteractions} interactions
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {MOCK_MEMORY_SUMMARY.topTopics.map((topic) => (
                    <Badge
                      key={topic}
                      variant="default"
                      className="text-[10px]"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Last: {MOCK_MEMORY_SUMMARY.lastInteraction}
                </p>
              </div>
            </section>

            {/* Saved Recommendations */}
            <section>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Saved Recommendations
              </h3>
              <div className="space-y-1.5">
                {MOCK_SAVED_RECOMMENDATIONS.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <Bookmark
                      size={14}
                      className="text-primary shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {rec.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1.5 py-0"
                        >
                          {rec.category}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {rec.savedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Conversations */}
            <section>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Recent Conversations
              </h3>
              <div className="space-y-1">
                {MOCK_CONVERSATION_HISTORY.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="block w-full p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate text-foreground group-hover:text-primary">
                        {item.title}
                      </p>
                      <ChevronRight
                        size={14}
                        className="text-muted-foreground shrink-0"
                      />
                    </div>
                    {item.preview && (
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {item.preview}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground">
                        {item.timestamp}
                      </span>
                      {item.unread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

FarmContextSidebar.displayName = "FarmContextSidebar";
