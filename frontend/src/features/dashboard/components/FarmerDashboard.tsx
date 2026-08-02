"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import { Button, ErrorMessage } from "@/components/ui";
import { useDashboard } from "../hooks/useDashboard";
import { motionPresets } from "@/lib/motion";
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

export const FarmerDashboard: React.FC = () => {
  const { dashboardState, refresh } = useDashboard();

  return (
    <div className="ds-page">
      <AnimatePresence mode="wait">
        {dashboardState.status === "loading" && (
          <div key="skeleton" className="animate-fade-in">
            <DashboardSkeleton />
          </div>
        )}

        {dashboardState.status === "error" && (
          <div
            key="error"
            className="ds-page-content-wide flex items-center justify-center py-16"
          >
            <ErrorMessage
              title="Dashboard Unavailable"
              message={dashboardState.message}
              action={
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<RefreshCcw size={16} aria-hidden="true" />}
                  onClick={refresh}
                >
                  Try Again
                </Button>
              }
            />
          </div>
        )}

        {dashboardState.status === "success" && (
          <>
            <TopBar
              profile={dashboardState.data.profile}
              temperatureC={dashboardState.data.weatherSummary.temperatureC}
              condition={dashboardState.data.weatherSummary.condition}
              advisorySafe={dashboardState.data.weatherSummary.advisorySafe}
            />

            <section id="main-content" className="ds-page-content-wide">
              <div
                className="ds-section-wide"
                {...motionPresets.staggerContainer}
              >
                <EmergencyAlertBanner
                  alert={dashboardState.data.emergencyAlert}
                />

                <DashboardHero />

                <StatCardsGrid
                  weather={dashboardState.data.weatherSummary}
                  marketTrends={dashboardState.data.marketTrends}
                  cropHealthCards={dashboardState.data.cropHealthCards}
                  schemes={dashboardState.data.schemes}
                />

                <div {...motionPresets.staggerItem}>
                  <div className="ds-section-header">
                    <div className="ds-section-header-bar" />
                    <h2>Crop Health</h2>
                  </div>
                  <CropHealthCard items={dashboardState.data.cropHealthCards} />
                </div>

                <div {...motionPresets.staggerItem}>
                  <div className="ds-section-header">
                    <div className="ds-section-header-bar" />
                    <h2>Market Intelligence</h2>
                  </div>
                  <MarketTrendsCard trends={dashboardState.data.marketTrends} />
                </div>

                <div {...motionPresets.staggerItem}>
                  <TasksTimeline chats={dashboardState.data.aiAdvisorChats} />
                </div>

                <div
                  {...motionPresets.staggerItem}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <RecentAIChatsCard
                    chats={dashboardState.data.aiAdvisorChats}
                  />
                  <PriorityAlertsCard
                    alerts={dashboardState.data.priorityAlerts}
                  />
                </div>

                <div {...motionPresets.staggerItem}>
                  <InsightsSection
                    marketTrends={dashboardState.data.marketTrends}
                    priorityAlerts={dashboardState.data.priorityAlerts}
                  />
                </div>
              </div>
            </section>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

FarmerDashboard.displayName = "FarmerDashboard";
