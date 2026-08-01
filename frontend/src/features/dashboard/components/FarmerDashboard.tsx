"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDashboard } from "../hooks/useDashboard";
import { TopBar } from "./TopBar";
import { DashboardHero } from "./DashboardHero";
import { StatCardsGrid } from "./StatCardsGrid";
import { TasksTimeline } from "./TasksTimeline";
import { InsightsSection } from "./InsightsSection";
import { MarketTrendsCard } from "./MarketTrendsCard";
import { CropHealthCard } from "./CropHealthCard";
import { RecentAIChatsCard } from "./RecentAIChatsCard";
import { PriorityAlertsCard } from "./PriorityAlertsCard";
import { EmergencyAlertBanner } from "./EmergencyAlertBanner";
import { DashboardSkeleton } from "./DashboardSkeleton";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export const FarmerDashboard: React.FC = () => {
  const { dashboardState, refresh } = useDashboard();

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {dashboardState.status === "loading" && (
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

        {dashboardState.status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
          >
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center flex flex-col items-center gap-5 max-w-md mx-auto">
              <div className="rounded-2xl bg-destructive/10 p-5">
                <AlertTriangle
                  size={32}
                  className="text-destructive"
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-foreground">
                  Dashboard Unavailable
                </h2>
                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                  {dashboardState.message}
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                leftIcon={<RefreshCcw size={16} aria-hidden="true" />}
                onClick={refresh}
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        )}

        {dashboardState.status === "success" && (
          <>
            <TopBar
              profile={dashboardState.data.profile}
              temperatureC={dashboardState.data.weatherSummary.temperatureC}
              condition={dashboardState.data.weatherSummary.condition}
              advisorySafe={dashboardState.data.weatherSummary.advisorySafe}
            />

            <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <motion.div
                key="content"
                variants={stagger}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-8"
              >
              <EmergencyAlertBanner
                alert={dashboardState.data.emergencyAlert}
              />

              <TopBar
                profile={dashboardState.data.profile}
                temperatureC={dashboardState.data.weatherSummary.temperatureC}
                condition={dashboardState.data.weatherSummary.condition}
                advisorySafe={dashboardState.data.weatherSummary.advisorySafe}
              />

              <DashboardHero />

              <StatCardsGrid
                weather={dashboardState.data.weatherSummary}
                marketTrends={dashboardState.data.marketTrends}
                cropHealthCards={dashboardState.data.cropHealthCards}
                schemes={dashboardState.data.schemes}
              />

              <motion.div variants={fadeUp}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1 h-6 rounded-full bg-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Crop Health
                  </h2>
                </div>
                <CropHealthCard items={dashboardState.data.cropHealthCards} />
              </motion.div>

              <motion.div variants={fadeUp}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1 h-6 rounded-full bg-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Market Intelligence
                  </h2>
                </div>
                <MarketTrendsCard trends={dashboardState.data.marketTrends} />
              </motion.div>

              <motion.div variants={fadeUp}>
                <TasksTimeline chats={dashboardState.data.aiAdvisorChats} />
              </motion.div>

              <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentAIChatsCard chats={dashboardState.data.aiAdvisorChats} />
                <PriorityAlertsCard
                  alerts={dashboardState.data.priorityAlerts}
                />
              </motion.div>

              <motion.div variants={fadeUp}>
                <InsightsSection
                  marketTrends={dashboardState.data.marketTrends}
                  priorityAlerts={dashboardState.data.priorityAlerts}
                />
              </motion.div>
            </motion.div>
            </main>
          </>
          )}
        </AnimatePresence>
    </div>
  );
};

FarmerDashboard.displayName = "FarmerDashboard";
