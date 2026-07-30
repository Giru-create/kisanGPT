// ─────────────────────────────────────────────────────────────────────────────
// MarketPage.tsx
// KisanGPT — Market Intelligence top-level page assembly
// Responsive: mobile-first stacked → desktop 2-column layout with sticky sidebar
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useMarket } from "../hooks/useMarket";
import { MarketOverviewCard } from "./MarketOverviewCard";
import { CommoditySelector } from "./CommoditySelector";
import { PriceListTable } from "./PriceListTable";
import { TrendChart } from "./TrendChart";
import { AIRecommendationCard } from "./AIRecommendationCard";
import { PriceAlertModal } from "./PriceAlertModal";
import { MarketSkeleton } from "./MarketSkeleton";
import { MarketError } from "./MarketError";
import { MarketEmpty } from "./MarketEmpty";
import { LiveRegion } from "@/components/accessibility/LiveRegion";
import type { PriceAlertDraft } from "../types/market.types";

// ---------------------------------------------------------------------------
// Helper: active alert counter badge for sidebar
// ---------------------------------------------------------------------------
const AlertCountBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) return null;
  return (
    <span
      className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold tabular-nums"
      aria-label={`${count} active alert${count > 1 ? "s" : ""}`}
    >
      {count}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export const MarketPage: React.FC = () => {
  const {
    marketState,
    priceListState,
    trendState,
    selectedCommodity,
    recommendation,
    activeAlerts,
    isAlertDialogOpen,
    alertDialogCommodity,
    loadOverview,
    loadPrices,
    loadTrend,
    selectCommodity,
    openAlertDialog,
    closeAlertDialog,
    createAlert,
    removeAlert,
  } = useMarket();

  // Initial load
  useEffect(() => {
    if (marketState.status === "idle") {
      loadOverview();
      loadPrices(selectedCommodity);
      loadTrend();
    }
  }, [
    marketState.status,
    selectedCommodity,
    loadOverview,
    loadPrices,
    loadTrend,
  ]);

  const handleCreateAlert = (draft: PriceAlertDraft) => {
    createAlert(draft);
  };

  // Current price for the selected commodity (for alert modal pre-fill)
  const currentPrice =
    priceListState.status === "success" && priceListState.data.prices[0]
      ? priceListState.data.prices[0].price_per_quintal
      : undefined;

  // Live region announcement when commodity changes successfully
  const liveMessage =
    priceListState.status === "success"
      ? `Loaded ${priceListState.data.prices.length} mandi prices for ${selectedCommodity}.`
      : priceListState.status === "loading"
        ? `Loading prices for ${selectedCommodity}…`
        : "";

  return (
    <>
      {/* WCAG 4.1.3 — Live region for dynamic updates */}
      <LiveRegion>{liveMessage}</LiveRegion>

      <main
        id="main-content"
        className="min-h-screen bg-background"
        aria-label="Market Intelligence"
      >
        {/* ── Page Container ─────────────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24 pt-6">
          {/* ── Page Header ──────────────────────────────────────────────── */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <span aria-hidden="true" className="text-lg">
                  🌾
                </span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  Market Intelligence
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-time mandi prices · Agmarknet &amp; e-NAM data
                </p>
              </div>
            </div>
          </div>

          {/* ── Commodity selector ───────────────────────────────────────── */}
          <div className="mb-6">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <CommoditySelector
                selected={selectedCommodity}
                onSelect={selectCommodity}
              />
            </div>
          </div>

          {/* ── Responsive Grid ───────────────────────────────────────────── */}
          {/* Desktop: 2-column (8+4). Mobile: single stacked column. */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* ═══ MAIN CONTENT COLUMN (8 cols on xl) ════════════════════ */}
            <div className="xl:col-span-8 flex flex-col gap-4">
              <AnimatePresence mode="wait">
                {/* Loading skeleton */}
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

                {/* Error state */}
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

                {/* Success — main content */}
                {marketState.status === "success" && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4"
                  >
                    {/* 1. Market overview hero card */}
                    <MarketOverviewCard
                      data={marketState.data}
                      onRefresh={loadOverview}
                    />

                    {/* 2. Price list table — with sub-states */}
                    <AnimatePresence mode="wait">
                      {priceListState.status === "loading" && (
                        <motion.div
                          key="price-loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm"
                        >
                          <div className="space-y-3">
                            {[0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className="h-24 rounded-2xl border border-border animate-pulse bg-muted/30"
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                      {priceListState.status === "success" &&
                        priceListState.data.prices.length > 0 && (
                          <motion.div
                            key="price-table"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <PriceListTable
                              prices={priceListState.data.prices}
                              commodity={selectedCommodity}
                              onSetAlert={openAlertDialog}
                            />
                          </motion.div>
                        )}
                      {priceListState.status === "success" &&
                        priceListState.data.prices.length === 0 && (
                          <motion.div
                            key="price-empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <MarketEmpty
                              commodity={selectedCommodity}
                              onSelectCommodity={selectCommodity}
                            />
                          </motion.div>
                        )}
                      {priceListState.status === "error" && (
                        <motion.div
                          key="price-error"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <MarketError
                            message={priceListState.message}
                            onRetry={() => loadPrices(selectedCommodity)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 3. Trend chart */}
                    <AnimatePresence mode="wait">
                      {trendState.status === "loading" && (
                        <motion.div
                          key="trend-loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm"
                        >
                          <div className="h-48 rounded-xl animate-pulse bg-muted/30" />
                        </motion.div>
                      )}
                      {trendState.status === "success" && (
                        <motion.div
                          key="trend-chart"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <TrendChart trend={trendState.data.trend} />
                        </motion.div>
                      )}
                      {trendState.status === "error" && (
                        <motion.div
                          key="trend-error"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <MarketError
                            message={trendState.message}
                            onRetry={loadTrend}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 4. AI Recommendation (mobile — on desktop in sidebar) */}
                    <div className="xl:hidden">
                      {recommendation && (
                        <AIRecommendationCard
                          recommendation={recommendation}
                          onSetAlert={openAlertDialog}
                        />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ═══ STICKY SIDEBAR (4 cols on xl, hidden on mobile) ══════ */}
            <aside
              className="hidden xl:block xl:col-span-4"
              aria-label="Market sidebar"
            >
              <div className="sticky top-20 flex flex-col gap-4">
                {/* AI Recommendation Card */}
                {marketState.status === "success" && recommendation && (
                  <AIRecommendationCard
                    recommendation={recommendation}
                    onSetAlert={openAlertDialog}
                  />
                )}

                {/* Active Alerts Panel */}
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Bell
                        size={15}
                        className="text-muted-foreground"
                        aria-hidden="true"
                      />
                      <h2 className="font-semibold text-sm text-foreground">
                        Active Alerts
                      </h2>
                      <AlertCountBadge count={activeAlerts.length} />
                    </div>
                    <button
                      type="button"
                      onClick={() => openAlertDialog(selectedCommodity)}
                      aria-label="Create a new price alert"
                      className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    >
                      + New
                    </button>
                  </div>

                  {activeAlerts.length === 0 ? (
                    <div className="py-4 flex flex-col items-center gap-2 text-center">
                      <Bell
                        size={22}
                        className="text-muted-foreground/40"
                        aria-hidden="true"
                      />
                      <p className="text-xs text-muted-foreground">
                        No alerts set. Get notified when prices hit your target.
                      </p>
                    </div>
                  ) : (
                    <ul
                      className="space-y-2"
                      aria-label="Your active price alerts"
                    >
                      {activeAlerts.map((alert) => (
                        <li
                          key={alert.id}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-muted/20"
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-foreground truncate">
                              {alert.commodity}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {alert.condition === "above" ? "⬆" : "⬇"} ₹
                              {alert.target_price.toLocaleString("en-IN")}/qtl
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAlert(alert.id)}
                            aria-label={`Remove price alert for ${alert.commodity}`}
                            className="flex items-center justify-center h-8 w-8 min-h-[44px] min-w-[44px] rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <span aria-hidden="true" className="text-sm">
                              ✕
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* MSP Reference Card */}
                {marketState.status === "success" &&
                  marketState.data.top_commodities.length > 0 && (
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                      <h2 className="font-semibold text-sm text-foreground mb-3">
                        MSP Reference
                      </h2>
                      <p className="text-[11px] text-muted-foreground mb-3">
                        Government Minimum Support Prices 2024–25
                      </p>
                      <ul
                        className="space-y-2"
                        aria-label="MSP reference prices"
                      >
                        {marketState.data.top_commodities.map((c) => (
                          <li
                            key={c.commodity}
                            className="flex items-center justify-between"
                          >
                            <span className="text-xs font-medium text-foreground">
                              {c.commodity}
                            </span>
                            <span className="text-xs tabular-nums text-muted-foreground">
                              ₹{c.msp.toLocaleString("en-IN")}/qtl
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </aside>
          </div>
        </div>

        {/* ── Sticky Mobile Bottom CTA ────────────────────────────────────── */}
        {marketState.status === "success" && (
          <div
            className="xl:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-background/95 backdrop-blur border-t border-border"
            aria-label="Set price alert"
          >
            <button
              type="button"
              onClick={() => openAlertDialog(selectedCommodity)}
              className="w-full inline-flex items-center justify-center gap-2 h-12 min-h-[48px] rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Set price alert for ${selectedCommodity}`}
            >
              <Bell size={16} aria-hidden="true" />
              Set Price Alert for {selectedCommodity}
              {activeAlerts.length > 0 && (
                <AlertCountBadge count={activeAlerts.length} />
              )}
            </button>
          </div>
        )}
      </main>

      {/* ── Price Alert Modal ──────────────────────────────────────────── */}
      <PriceAlertModal
        isOpen={isAlertDialogOpen}
        onClose={closeAlertDialog}
        defaultCommodity={alertDialogCommodity}
        currentPrice={currentPrice}
        onSubmit={handleCreateAlert}
      />
    </>
  );
};

MarketPage.displayName = "MarketPage";
