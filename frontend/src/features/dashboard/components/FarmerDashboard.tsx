"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  RefreshCcw,
  AlertTriangle,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <DashboardTopBar />

      <main id="main-content" className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {dashboardState.status === "loading" && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 sm:px-6 lg:px-8 py-8"
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
              className="px-4 sm:px-6 lg:px-8 py-16"
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
            <motion.div
              key="content"
              variants={stagger}
              initial="hidden"
              animate="show"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-8"
            >
              <EmergencyAlertBanner
                alert={dashboardState.data.emergencyAlert}
              />

              <motion.header variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    {dashboardState.data.profile.greetingPrefix},{" "}
                    {dashboardState.data.profile.name}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Here&apos;s your farm overview for today
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3.5 py-2 rounded-xl border border-border/60">
                  <MapPin
                    size={15}
                    className="text-primary shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-medium">
                    {dashboardState.data.profile.village}
                    {dashboardState.data.profile.state
                      ? `, ${dashboardState.data.profile.state}`
                      : ""}
                  </span>
                </div>
              </motion.header>

              <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
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
                </div>
                <div className="lg:col-span-3">
                  <AIStrategicAdvisoryCard />
                </div>
              </motion.div>

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

              <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentAIChatsCard chats={dashboardState.data.aiAdvisorChats} />
                <PriorityAlertsCard
                  alerts={dashboardState.data.priorityAlerts}
                />
              </motion.div>

              <motion.div variants={fadeUp}>
                <Link
                  href="/advisor"
                  className="group flex items-center justify-between p-5 rounded-2xl border border-border bg-card hover:bg-muted/30 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Sparkles
                        size={22}
                        className="text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Ask KisanGPT AI
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Get personalized farming advice
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={20}
                    className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

FarmerDashboard.displayName = "FarmerDashboard";
