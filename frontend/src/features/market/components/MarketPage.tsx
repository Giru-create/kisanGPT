"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useMarket } from "../hooks/useMarket";
import { HeroSection } from "./HeroSection";
import { CommoditySelector } from "./CommoditySelector";
import { AIRecommendationCard } from "./AIRecommendationCard";
import { MarketTrends } from "./MarketTrends";
import { CommodityExplorer } from "./CommodityExplorer";
import { PriceComparison } from "./PriceComparison";
import { PriceAlerts } from "./PriceAlerts";
import { AIInsights } from "./AIInsights";
import { FarmerActions } from "./FarmerActions";
import { MarketSkeleton } from "./MarketSkeleton";
import { MarketError } from "./MarketError";
import { MarketEmpty } from "./MarketEmpty";
import { PriceAlertModal } from "./PriceAlertModal";
import {
  MOCK_HERO_BRIEF,
  MOCK_PREMIUM_RECOMMENDATION,
  MOCK_MANDI_COMPARISONS,
  MOCK_AI_INSIGHTS,
  MOCK_ENHANCED_TREND_DATA,
} from "../constants/market.constants";

export const MarketPage: React.FC = () => {
  const router = useRouter();
  const {
    marketState,
    activeAlerts,
    selectedCommodity,
    isAlertDialogOpen,
    alertDialogCommodity,
    selectCommodity,
    loadOverview,
    openAlertDialog,
    closeAlertDialog,
    createAlert,
    removeAlert,
    toggleAlert,
  } = useMarket();

  return (
    <section className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="ds-page-title">Market Intelligence</h1>
            <p className="ds-page-subtitle">
              AI-powered mandi prices &amp; market insights
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw size={14} />}
            onClick={loadOverview}
            aria-label="Refresh market data"
            className="text-xs"
          >
            Refresh
          </Button>
        </div>

        {/* Commodity selector */}
        <CommoditySelector
          selected={selectedCommodity}
          onSelect={selectCommodity}
        />

        {/* Main content */}
        <AnimatePresence mode="wait">
          {/* Loading */}
          {(marketState.status === "idle" ||
            marketState.status === "loading") && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-5"
            >
              <MarketSkeleton />
            </motion.div>
          )}

          {/* Error */}
          {marketState.status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-5"
            >
              <MarketError
                message={marketState.message}
                onRetry={loadOverview}
              />
            </motion.div>
          )}

          {/* Empty */}
          {marketState.status === "success" &&
            marketState.data.top_commodities.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-5"
              >
                <MarketEmpty
                  commodity={selectedCommodity}
                  onSelectCommodity={selectCommodity}
                />
              </motion.div>
            )}

          {/* Success */}
          {marketState.status === "success" &&
            marketState.data.top_commodities.length > 0 && (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-5 mt-5"
              >
                {/* Hero Section */}
                <HeroSection brief={MOCK_HERO_BRIEF} onRefresh={loadOverview} />

                {/* AI Recommendation */}
                <AIRecommendationCard
                  recommendation={MOCK_PREMIUM_RECOMMENDATION}
                  onSetAlert={(c) => openAlertDialog(c)}
                  onAskAI={() => {
                    router.push("/advisor");
                  }}
                />

                {/* Market Trends */}
                <MarketTrends data={MOCK_ENHANCED_TREND_DATA} />

                {/* Commodity Explorer with live prices */}
                <CommodityExplorer
                  prices={marketState.data.top_commodities}
                  onSetAlert={(c) => openAlertDialog(c)}
                />

                {/* Price Comparison */}
                <PriceComparison
                  comparisons={MOCK_MANDI_COMPARISONS}
                  commodity={selectedCommodity}
                />

                {/* Price Alerts */}
                <PriceAlerts
                  alerts={activeAlerts}
                  onCreateAlert={(commodity, target, condition) =>
                    createAlert({
                      commodity,
                      target_price: target,
                      condition,
                      channels: ["sms"],
                    })
                  }
                  onRemoveAlert={removeAlert}
                  onToggleAlert={toggleAlert}
                />

                {/* AI Insights */}
                <AIInsights insights={MOCK_AI_INSIGHTS} />

                {/* Farmer Quick Actions */}
                <FarmerActions />
              </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={isAlertDialogOpen}
        onClose={closeAlertDialog}
        defaultCommodity={alertDialogCommodity}
        onSubmit={(draft) => {
          createAlert(draft);
          closeAlertDialog();
        }}
      />
    </section>
  );
};

MarketPage.displayName = "MarketPage";
