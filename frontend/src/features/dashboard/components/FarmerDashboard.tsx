"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FarmerDashboard.tsx
// KisanGPT — Main Farmer Dashboard Feature Assembly
// Matches the design-reference layout: hero section, 7/12 + 5/12 grid
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCcw, AlertTriangle, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDashboard } from "../hooks/useDashboard";
import { DashboardTopBar } from "./DashboardTopBar";
import { EmergencyAlertBanner } from "./EmergencyAlertBanner";
import { WeatherSummaryWidget } from "./WeatherSummaryWidget";
import { AIStrategicAdvisoryCard } from "./AIStrategicAdvisoryCard";
import { CropHealthCard } from "./CropHealthCard";
import { MarketTrendsCard } from "./MarketTrendsCard";
import { RecentAIChatsCard } from "./RecentAIChatsCard";
import { PriorityAlertsCard } from "./PriorityAlertsCard";
import { DashboardSkeleton } from "./DashboardSkeleton";

export const FarmerDashboard: React.FC = () => {
  const { dashboardState, refresh } = useDashboard();

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard-specific top bar */}
      <DashboardTopBar />

      <main
        id="main-content"
        className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto"
      >
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

          {/* ── Success State ── */}
          {dashboardState.status === "success" && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              {/* Emergency Alert Banner */}
              <EmergencyAlertBanner
                alert={dashboardState.data.emergencyAlert}
              />

              {/* Welcome Header with Location */}
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold text-foreground tracking-tight">
                    {dashboardState.data.profile.greetingPrefix},{" "}
                    {dashboardState.data.profile.name}.
                  </h1>
                  <p className="text-base text-muted-foreground mt-1">
                    Here&apos;s your farm overview for today.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-card p-2.5 rounded-xl border border-border shadow-sm">
                  <MapPin
                    size={18}
                    className="text-emerald-600 dark:text-emerald-400 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {dashboardState.data.profile.village},{" "}
                    {dashboardState.data.profile.state}
                  </span>
                </div>
              </header>

              {/* Hero Section: Weather & AI Advisory */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-1">
                  <WeatherSummaryWidget
                    temperatureC={
                      dashboardState.data.weatherSummary.temperatureC
                    }
                    feelsLikeC={
                      dashboardState.data.weatherSummary.feelsLikeC
                    }
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
                </div>
                <div className="lg:col-span-2">
                  <AIStrategicAdvisoryCard />
                </div>
              </div>

              {/* Main Grid: Crop Health (7/12) + Market Trends (5/12) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <section className="lg:col-span-7">
                  <CropHealthCard
                    items={dashboardState.data.cropHealthCards}
                  />
                </section>
                <section className="lg:col-span-5">
                  <MarketTrendsCard
                    trends={dashboardState.data.marketTrends}
                  />
                </section>
              </div>

              {/* Bottom Row: Recent AI Chats + Priority Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-6">
                <RecentAIChatsCard
                  chats={dashboardState.data.aiAdvisorChats}
                />
                <PriorityAlertsCard
                  alerts={dashboardState.data.priorityAlerts}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button */}
        <button
          type="button"
          aria-label="Ask KisanGPT AI"
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-90 z-50 group hover:bg-primary/90"
        >
          <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" aria-hidden="true" />
          <div className="absolute right-16 bg-foreground text-background px-3 py-1.5 rounded-lg whitespace-nowrap text-sm font-medium opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all pointer-events-none shadow-lg">
            Ask KisanGPT AI
          </div>
        </button>
      </main>
    </div>
  );
};

FarmerDashboard.displayName = "FarmerDashboard";
