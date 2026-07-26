// ─────────────────────────────────────────────────────────────────────────────
// PriceListTable.tsx
// KisanGPT — Mandi price list table
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { CommodityPrice } from "../types/market.types";

interface PriceListTableProps {
  prices: CommodityPrice[];
  commodity: string;
}

export const PriceListTable: React.FC<PriceListTableProps> = ({
  prices,
  commodity,
}) => {
  return (
    <section
      role="region"
      aria-label={`${commodity} prices across mandis`}
      className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm"
    >
      <h2 className="font-semibold text-sm sm:text-base text-foreground mb-4">
        {commodity} — Mandi Prices
      </h2>

      <div className="flex flex-col gap-2.5">
        {prices.map((item, i) => (
          <div
            key={`${item.mandi_name}-${i}`}
            className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col">
              <span className="font-bold text-sm text-foreground">
                {item.mandi_name}
              </span>
              <span className="text-xs text-muted-foreground">
                {item.district}, {item.state} · {item.variety}
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
                    {item.msp_difference >= 0 ? "+" : ""}₹
                    {item.msp_difference.toLocaleString("en-IN")} vs MSP
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

PriceListTable.displayName = "PriceListTable";
