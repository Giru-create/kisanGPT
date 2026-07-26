"use client";

// ─────────────────────────────────────────────────────────────────────────────
// MandiPricesWidget.tsx
// KisanGPT — Dashboard Section: APMC Mandi Market Intelligence Widget
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, ArrowUpRight, Minus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useMarket } from "@/features/market/hooks/useMarket";
import type { CommodityPrice } from "@/features/market/types/market.types";

// ---------------------------------------------------------------------------
// Shared price row primitive (matches PriceListTable card style)
// ---------------------------------------------------------------------------
const MandiPriceRow: React.FC<{ item: CommodityPrice }> = ({ item }) => {
  const isFlat = item.change_amount === 0;

  const mspStatus =
    item.msp > 0 ? (item.msp_difference >= 0 ? "above" : "below") : null;

  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/50 transition-colors">
      <div className="flex flex-col min-w-0">
        <span className="font-bold text-sm text-foreground truncate">
          {item.commodity}
        </span>
        <span className="text-xs text-muted-foreground">
          {item.mandi_name} · {item.variety}
        </span>
      </div>

      <div className="flex flex-col items-end gap-0.5 shrink-0 ml-2">
        <span className="font-bold text-base text-foreground tabular-nums leading-none">
          ₹{item.price_per_quintal.toLocaleString("en-IN")}
          <span className="text-[10px] text-muted-foreground font-normal ml-0.5">
            /qtl
          </span>
        </span>

        <div className="flex items-center gap-1.5">
          {isFlat ? (
            <span className="inline-flex items-center text-xs text-muted-foreground font-medium gap-0.5">
              <Minus size={11} aria-hidden="true" />
              No change
            </span>
          ) : item.is_rise ? (
            <span
              className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-0.5"
              aria-label={`Up ₹${item.change_amount}, ${item.change_percent.toFixed(1)} percent`}
            >
              <TrendingUp size={11} aria-hidden="true" />
              +₹
              {item.change_amount.toLocaleString("en-IN")} (
              {item.change_percent.toFixed(1)}%)
            </span>
          ) : (
            <span
              className="inline-flex items-center text-xs font-semibold text-red-600 dark:text-red-400 gap-0.5"
              aria-label={`Down ₹${Math.abs(item.change_amount)}, ${Math.abs(item.change_percent).toFixed(1)} percent`}
            >
              <TrendingDown size={11} aria-hidden="true" />
              -₹
              {Math.abs(item.change_amount).toLocaleString("en-IN")} (
              {Math.abs(item.change_percent).toFixed(1)}%)
            </span>
          )}

          {/* Fixed: correctly shows +/- MSP difference with semantic badge */}
          {mspStatus && (
            <Badge
              variant={mspStatus === "above" ? "success" : "warning"}
              className="text-[10px] px-1.5 py-0 h-5"
            >
              {mspStatus === "above" ? "+" : "-"}₹
              {Math.abs(item.msp_difference).toLocaleString("en-IN")} MSP
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Widget skeleton
// ---------------------------------------------------------------------------
const WidgetSkeleton: React.FC = () => (
  <section
    role="region"
    aria-label="Mandi Market Prices loading"
    className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm flex flex-col gap-4"
  >
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-4 w-20" />
    </div>
    <div className="flex flex-col gap-2.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20"
        >
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-36" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------
export const MandiPricesWidget: React.FC = () => {
  const { marketState, loadOverview } = useMarket();

  useEffect(() => {
    if (marketState.status === "idle") {
      loadOverview();
    }
  }, [marketState.status, loadOverview]);

  if (marketState.status === "idle" || marketState.status === "loading") {
    return <WidgetSkeleton />;
  }

  const WidgetHeader = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <TrendingUp size={18} className="text-primary" aria-hidden="true" />
        <h2 className="font-semibold text-sm sm:text-base text-foreground">
          APMC Mandi Market Prices
        </h2>
      </div>
      <Link
        href="/market"
        className="inline-flex items-center text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        aria-label="View all mandi prices in Market Intelligence"
      >
        All Mandis
        <ArrowUpRight size={13} className="ml-0.5" aria-hidden="true" />
      </Link>
    </div>
  );

  if (marketState.status === "error") {
    return (
      <section
        role="region"
        aria-label="Mandi Market Prices"
        className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm flex flex-col gap-3"
      >
        {WidgetHeader}
        <p className="text-xs text-muted-foreground">
          Unable to load prices.{" "}
          <Link href="/market" className="text-primary hover:underline">
            View Market Intelligence →
          </Link>
        </p>
      </section>
    );
  }

  const prices = marketState.data.top_commodities;

  return (
    <section
      role="region"
      aria-label="Mandi Market Prices"
      className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm flex flex-col gap-4"
    >
      {WidgetHeader}
      <div className="flex flex-col gap-2.5" aria-label="Top commodity prices">
        {prices.map((item, i) => (
          <MandiPriceRow key={`${item.mandi_name}-${i}`} item={item} />
        ))}
      </div>
    </section>
  );
};

MandiPricesWidget.displayName = "MandiPricesWidget";
