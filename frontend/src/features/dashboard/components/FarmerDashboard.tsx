"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FarmerDashboard.tsx
// KisanGPT — Main Farmer Dashboard Feature Assembly
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDashboard } from "../hooks/useDashboard";
import { GreetingHeader } from "./GreetingHeader";
import { EmergencyAlertBanner } from "./EmergencyAlertBanner";
import { WeatherSummaryWidget } from "./WeatherSummaryWidget";
import { VoiceAssistantBar } from "./VoiceAssistantBar";
import { AIChatShortcutWidget } from "./AIChatShortcutWidget";
import { QuickActionsGrid } from "./QuickActionsGrid";
import { CropHealthWidget } from "./CropHealthWidget";
import { MandiPricesWidget } from "./MandiPricesWidget";
import { GovtSchemesWidget } from "./GovtSchemesWidget";
import { RecentActivityWidget } from "./RecentActivityWidget";
import { NotificationsWidget } from "./NotificationsWidget";
import { DashboardSkeleton } from "./DashboardSkeleton";

export const FarmerDashboard: React.FC = () => {
  const { dashboardState, refresh, markNotificationRead } = useDashboard();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 flex flex-col gap-5">
        <AnimatePresence mode="wait">
          {/* ── Loading State ── */}
          {(dashboardState.status === "idle" ||
            dashboardState.status === "loading") && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DashboardSkeleton />
            </motion.div>
          )}

          {/* ── Error State ── */}
          {dashboardState.status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center flex flex-col items-center gap-4"
            >
              <div className="p-4 rounded-full bg-destructive/20 text-destructive">
                <AlertTriangle size={36} />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-foreground">
                  Dashboard Data Unavailable
                </h2>
                <p className="text-xs text-muted-foreground max-w-sm">
                  {dashboardState.message}
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                leftIcon={<RefreshCcw size={16} />}
                onClick={refresh}
              >
                Retry Loading
              </Button>
            </motion.div>
          )}

          {/* ── Success State: Full Dashboard ── */}
          {dashboardState.status === "success" && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5"
            >
              {/* Section 11: Emergency Alert Banner (Conditional) */}
              <EmergencyAlertBanner
                alert={dashboardState.data.emergencyAlert}
              />

              {/* Section 1: Greeting & Farm Context */}
              <GreetingHeader profile={dashboardState.data.profile} />

              {/* Section 2: Current Weather & Advisory */}
              <WeatherSummaryWidget
                temperatureC={dashboardState.data.weatherSummary.temperatureC}
                feelsLikeC={dashboardState.data.weatherSummary.feelsLikeC}
                condition={dashboardState.data.weatherSummary.condition}
                humidity={dashboardState.data.weatherSummary.humidity}
                windSpeedKmh={dashboardState.data.weatherSummary.windSpeedKmh}
                advisory={dashboardState.data.weatherSummary.advisory}
                advisorySafe={dashboardState.data.weatherSummary.advisorySafe}
              />

              {/* Section 8: Multilingual Voice Assistant Bar */}
              <VoiceAssistantBar />

              {/* Section 3: AI Chat Shortcut */}
              <AIChatShortcutWidget />

              {/* Section 7: Quick Actions Grid (2×2) */}
              <QuickActionsGrid />

              {/* Section 4: Crop Health Diagnostics */}
              <CropHealthWidget fields={dashboardState.data.cropFields} />

              {/* Section 5: APMC Mandi Market Prices */}
              <MandiPricesWidget prices={dashboardState.data.mandiPrices} />

              {/* Section 6: Government Schemes & Subsidies */}
              <GovtSchemesWidget schemes={dashboardState.data.schemes} />

              {/* Section 9: Recent Activity Log */}
              <RecentActivityWidget
                activities={dashboardState.data.recentActivities}
              />

              {/* Section 10: Notifications & Reminders */}
              <NotificationsWidget
                notifications={dashboardState.data.notifications}
                onMarkRead={markNotificationRead}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

FarmerDashboard.displayName = "FarmerDashboard";
