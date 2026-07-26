// ─────────────────────────────────────────────────────────────────────────────
// MarketPage.tsx
// KisanGPT — Market Intelligence top-level page assembly
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMarket } from "../hooks/useMarket";
import { MarketOverviewCard } from "./MarketOverviewCard";
import { CommoditySelector } from "./CommoditySelector";
import { PriceListTable } from "./PriceListTable";
import { TrendChart } from "./TrendChart";
import { MarketSkeleton } from "./MarketSkeleton";
import { MarketError } from "./MarketError";
import { MarketEmpty } from "./MarketEmpty";

export const MarketPage: React.FC = () => {
  const {
    marketState,
    priceListState,
    trendState,
    selectedCommodity,
    loadOverview,
    loadPrices,
    loadTrend,
    selectCommodity,
  } = useMarket();

  useEffect(() => {
    if (marketState.status === "idle") {
      loadOverview();
      loadPrices(selectedCommodity);
      loadTrend(selectedCommodity);
    }
  }, [
    marketState.status,
    selectedCommodity,
    loadOverview,
    loadPrices,
    loadTrend,
  ]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 pb-10 pt-6">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">
            Market Intelligence
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time mandi prices and trends
          </p>
        </div>

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
            >
              <MarketError
                message={marketState.message}
                onRetry={loadOverview}
              />
            </motion.div>
          )}

          {/* Success */}
          {marketState.status === "success" && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              <MarketOverviewCard data={marketState.data} />

              <CommoditySelector
                selected={selectedCommodity}
                onSelect={selectCommodity}
              />

              {priceListState.status === "success" &&
                priceListState.data.prices.length > 0 && (
                  <PriceListTable
                    prices={priceListState.data.prices}
                    commodity={selectedCommodity}
                  />
                )}

              {priceListState.status === "success" &&
                priceListState.data.prices.length === 0 && <MarketEmpty />}

              {trendState.status === "success" && (
                <TrendChart trend={trendState.data.trend} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

MarketPage.displayName = "MarketPage";
