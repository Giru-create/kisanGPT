"use client";

// ─────────────────────────────────────────────────────────────────────────────
// MandiPricesWidget.tsx
// KisanGPT — Section 5: APMC Mandi Market Intelligence Widget
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Link from "next/link";
import { TrendingUp, ArrowUpRight, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { MandiPriceItem } from "../types/dashboard.types";

interface MandiPricesWidgetProps {
  prices: MandiPriceItem[];
}

export const MandiPricesWidget: React.FC<MandiPricesWidgetProps> = ({ prices }) => {
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
        {prices.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col">
              <span className="font-bold text-sm text-foreground">
                {item.commodity}
              </span>
              <span className="text-xs text-muted-foreground">
                {item.mandiName} · {item.variety}
              </span>
            </div>

            <div className="flex flex-col items-end gap-0.5">
              <span className="font-bold text-base text-foreground tabular-nums">
                ₹{item.pricePerQuintal.toLocaleString("en-IN")}
                <span className="text-[10px] text-muted-foreground font-normal"> /qnt</span>
              </span>

              <div className="flex items-center gap-1.5 text-xs">
                <span
                  className={`inline-flex items-center font-semibold ${
                    item.isRise
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {item.isRise ? (
                    <TrendingUp size={12} className="mr-0.5" />
                  ) : (
                    <TrendingDown size={12} className="mr-0.5" />
                  )}
                  {item.isRise ? "+" : ""}
                  ₹{Math.abs(item.changeAmount)} ({item.changePercent.toFixed(1)}%)
                </span>

                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  +₹{item.mspDifference} vs MSP
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

MandiPricesWidget.displayName = "MandiPricesWidget";
