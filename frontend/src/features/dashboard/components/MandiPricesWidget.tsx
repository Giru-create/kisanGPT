"use client";

// ─────────────────────────────────────────────────────────────────────────────
// MandiPricesWidget.tsx
// KisanGPT — Section 5: APMC Mandi Market Intelligence Widget
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from "react";
import Link from "next/link";
import { TrendingUp, ArrowUpRight, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useMarket } from "@/features/market/hooks/useMarket";
import { Skeleton } from "@/components/ui/Skeleton";

export const MandiPricesWidget: React.FC = () => {
  const { marketState, loadOverview } = useMarket();

  useEffect(() => {
    if (marketState.status === "idle") {
      loadOverview();
    }
  }, [marketState.status, loadOverview]);

  if (marketState.status === "idle" || marketState.status === "loading") {
    return (
      <section
        role="region"
        aria-label="Mandi Market Prices"
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
  }

  if (marketState.status === "error") {
    return (
      <section
        role="region"
        aria-label="Mandi Market Prices"
        className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp
              size={18}
              className="text-amber-500"
              aria-hidden="true"
            />
            <h2 className="font-semibold text-sm sm:text-base text-foreground">
              APMC Mandi Market Prices
            </h2>
          </div>
          <Link
            href="/market"
            className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
          >
            All Mandis <ArrowUpRight size={14} className="ml-0.5" />
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          Unable to load prices.{" "}
          <Link href="/market" className="text-primary hover:underline">
            View details
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-amber-500" aria-hidden="true" />
          <h2 className="font-semibold text-sm sm:text-base text-foreground">
            APMC Mandi Market Prices
          </h2>
        </div>
        <Link
          href="/market"
          className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
        >
          All Mandis <ArrowUpRight size={14} className="ml-0.5" />
        </Link>
      </div>

      {/* Price Table / List */}
      <div className="flex flex-col gap-2.5">
        {prices.map((item, i) => (
          <div
            key={`${item.mandi_name}-${i}`}
            className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col">
              <span className="font-bold text-sm text-foreground">
                {item.commodity}
              </span>
              <span className="text-xs text-muted-foreground">
                {item.mandi_name} · {item.variety}
              </span>
            </div>

            <div className="flex flex-col items-end gap-0.5">
              <span className="font-bold text-base text-foreground tabular-nums">
                ₹{item.price_per_quintal.toLocaleString("en-IN")}
                <span className="text-[10px] text-muted-foreground font-normal">
                  {" "}
                  /qnt
                </span>
              </span>

              <div className="flex items-center gap-1.5 text-xs">
                <span
                  className={`inline-flex items-center font-semibold ${
                    item.is_rise
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {item.is_rise ? (
                    <TrendingUp size={12} className="mr-0.5" />
                  ) : (
                    <TrendingDown size={12} className="mr-0.5" />
                  )}
                  {item.is_rise ? "+" : ""}₹
                  {Math.abs(item.change_amount).toLocaleString("en-IN")} (
                  {item.change_percent.toFixed(1)}%)
                </span>

                {item.msp > 0 && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    +₹{item.msp_difference.toLocaleString("en-IN")} vs MSP
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

MandiPricesWidget.displayName = "MandiPricesWidget";
