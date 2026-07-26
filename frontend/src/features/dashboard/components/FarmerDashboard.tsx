"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FarmerDashboard.tsx
// KisanGPT — Main Farmer Dashboard Feature Assembly (Production Ready)
// Responsive: Mobile stacked → Desktop 12-column layout (8 cols feed + 4 cols sidebar)
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
  const {
    dashboardState,
    refresh,
    markNotificationRead,
    markAllNotificationsRead,
  } = useDashboard();

  return (
    <main id="main-content" className="min-h-screen bg-background pb-20 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {/* ── Loading State ── */}
          {(dashboardState.status === "idle" ||
            dashboardState.status === "loading") && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
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
              className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center flex flex-col items-center gap-4 max-w-md mx-auto my-12"
            >
              <div className="p-4 rounded-2xl bg-destructive/20 text-destructive">
                <AlertTriangle size={40} aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-extrabold text-foreground">
                  Dashboard Data Unavailable
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {dashboardState.message}
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                className="min-h-[48px] px-6 font-bold"
                leftIcon={<RefreshCcw size={18} aria-hidden="true" />}
                onClick={refresh}
              >
                Retry Loading Dashboard
              </Button>
            </motion.div>
          )}

          {/* ── Success State: Responsive 12-Column Layout ── */}
          {dashboardState.status === "success" && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              {/* Emergency Alert Banner (Spans full width if present) */}
              <EmergencyAlertBanner
                alert={dashboardState.data.emergencyAlert}
              />

              {/* Greeting & Location Context Header */}
              <GreetingHeader profile={dashboardState.data.profile} />

              {/* 12-Column Responsive Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* ═══ MAIN FEED COLUMN (8 cols on xl) ════════════════════ */}
                <div className="xl:col-span-8 flex flex-col gap-6">
                  {/* Section 2: Current Weather & Advisory */}
                  <WeatherSummaryWidget
                    temperatureC={
                      dashboardState.data.weatherSummary.temperatureC
                    }
                    feelsLikeC={dashboardState.data.weatherSummary.feelsLikeC}
                    condition={dashboardState.data.weatherSummary.condition}
                    humidity={dashboardState.data.weatherSummary.humidity}
                    windSpeedKmh={
                      dashboardState.data.weatherSummary.windSpeedKmh
                    }
                    advisory={dashboardState.data.weatherSummary.advisory}
                    advisorySafe={
                      dashboardState.data.weatherSummary.advisorySafe
                    }
                  />

                  {/* Section 8: Multilingual Voice Assistant (Mobile View) */}
                  <div className="xl:hidden">
                    <VoiceAssistantBar />
                  </div>

                  {/* Section 3: AI Chat Shortcut */}
                  <AIChatShortcutWidget />

                  {/* Section 7: Quick Actions Grid (Mobile View) */}
                  <div className="xl:hidden">
                    <QuickActionsGrid />
                  </div>

                  {/* Section 4: Crop Health Diagnostics */}
                  <CropHealthWidget fields={dashboardState.data.cropFields} />

                  {/* Section 5: APMC Mandi Market Prices */}
                  <MandiPricesWidget />

                  {/* Section 6: Government Schemes & Subsidies */}
                  <GovtSchemesWidget schemes={dashboardState.data.schemes} />

                  {/* Section 10: Notifications (Mobile View) */}
                  <div className="xl:hidden">
                    <NotificationsWidget
                      notifications={dashboardState.data.notifications}
                      onMarkRead={markNotificationRead}
                      onMarkAllRead={markAllNotificationsRead}
                    />
                  </div>

                  {/* Section 9: Recent Activity Log (Mobile View) */}
                  <div className="xl:hidden">
                    <RecentActivityWidget
                      activities={dashboardState.data.recentActivities}
                    />
                  </div>
                </div>

                {/* ═══ STICKY SIDEBAR (4 cols on xl, hidden on mobile) ══════ */}
                <aside
                  className="hidden xl:block xl:col-span-4"
                  aria-label="Dashboard Sidebar Tools"
                >
                  <div className="sticky top-20 flex flex-col gap-6">
                    {/* Section 8: Voice Assistant Bar */}
                    <VoiceAssistantBar />

                    {/* Section 7: Quick Actions 2×2 Grid */}
                    <QuickActionsGrid />

                    {/* Section 10: Notifications & Reminders */}
                    <NotificationsWidget
                      notifications={dashboardState.data.notifications}
                      onMarkRead={markNotificationRead}
                      onMarkAllRead={markAllNotificationsRead}
                    />

                    {/* Section 9: Recent Activity Log */}
                    <RecentActivityWidget
                      activities={dashboardState.data.recentActivities}
                    />
                  </div>
                </aside>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

FarmerDashboard.displayName = "FarmerDashboard";
