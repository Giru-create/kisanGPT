// ─────────────────────────────────────────────────────────────────────────────
// PriceListTable.tsx
// KisanGPT — Rich mandi price comparison cards with full accessibility
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { TrendingUp, TrendingDown, Bell, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import type { CommodityPrice } from "../types/market.types";

interface PriceListTableProps {
  prices: CommodityPrice[];
  commodity: string;
  onSetAlert?: (commodity: string) => void;
}

const PriceRow: React.FC<{
  item: CommodityPrice;
  index: number;
  onSetAlert?: (commodity: string) => void;
}> = ({ item, index, onSetAlert }) => {
  const isFlat = item.change_amount === 0;

  const mspStatus =
    item.msp > 0 ? (item.msp_difference >= 0 ? "above" : "below") : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06 }}
      className="rounded-2xl border border-border bg-card hover:shadow-md hover:border-primary/30 transition-all duration-200 overflow-hidden"
    >
      {/* Accent top bar based on trend */}
      <div
        className={`h-0.5 w-full ${
          item.is_rise
            ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
            : isFlat
              ? "bg-muted"
              : "bg-gradient-to-r from-red-400 to-red-600"
        }`}
        aria-hidden="true"
      />

      <div className="p-4">
        {/* Top row: mandi info + alert button */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-foreground truncate">
              {item.mandi_name}
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">
              {item.district}, {item.state} · {item.variety}
            </span>
          </div>
          {onSetAlert && (
            <button
              type="button"
              onClick={() => onSetAlert(item.commodity)}
              aria-label={`Set price alert for ${item.commodity} at ${item.mandi_name}`}
              className="flex items-center justify-center h-9 w-9 min-h-[44px] min-w-[44px] rounded-xl border border-border bg-muted/30 text-muted-foreground hover:bg-accent hover:text-primary hover:border-primary/40 transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Bell size={15} />
            </button>
          )}
        </div>

        {/* Price + change */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-2xl font-extrabold text-foreground tabular-nums leading-none">
              ₹{item.price_per_quintal.toLocaleString("en-IN")}
              <span className="text-xs text-muted-foreground font-normal ml-1">
                /qtl
              </span>
            </p>

            {/* Change indicator — color + icon + text for WCAG 1.4.1 */}
            <div className="flex items-center gap-1 mt-1.5">
              {isFlat ? (
                <>
                  <Minus
                    size={12}
                    className="text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="text-xs text-muted-foreground font-medium">
                    No change
                  </span>
                </>
              ) : item.is_rise ? (
                <>
                  <TrendingUp
                    size={13}
                    className="text-emerald-600 dark:text-emerald-400"
                    aria-hidden="true"
                  />
                  <span
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                    aria-label={`Price up by ₹${item.change_amount}, ${item.change_percent.toFixed(1)} percent`}
                  >
                    +₹{item.change_amount.toLocaleString("en-IN")} (+
                    {item.change_percent.toFixed(1)}%)
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown
                    size={13}
                    className="text-red-600 dark:text-red-400"
                    aria-hidden="true"
                  />
                  <span
                    className="text-xs font-semibold text-red-600 dark:text-red-400"
                    aria-label={`Price down by ₹${Math.abs(item.change_amount)}, ${Math.abs(item.change_percent).toFixed(1)} percent`}
                  >
                    -₹{Math.abs(item.change_amount).toLocaleString("en-IN")} (
                    {item.change_percent.toFixed(1)}%)
                  </span>
                </>
              )}
            </div>
          </div>

          {/* MSP badge */}
          {mspStatus && (
            <Badge
              variant={mspStatus === "above" ? "success" : "warning"}
              className="text-[10px] shrink-0"
            >
              {mspStatus === "above" ? "✓ " : "! "}₹
              {Math.abs(item.msp_difference).toLocaleString("en-IN")}{" "}
              {mspStatus === "above" ? "above" : "below"} MSP
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const PriceListTable: React.FC<PriceListTableProps> = ({
  prices,
  commodity,
  onSetAlert,
}) => {
  return (
    <section
      role="region"
      aria-label={`${commodity} prices across mandis`}
      className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-sm sm:text-base text-foreground">
          {commodity} — Mandi Comparison
        </h2>
        <span className="text-xs text-muted-foreground">
          {prices.length} mandi{prices.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {prices.map((item, i) => (
          <PriceRow
            key={`${item.mandi_name}-${i}`}
            item={item}
            index={i}
            onSetAlert={onSetAlert}
          />
        ))}
      </div>
    </section>
  );
};

PriceListTable.displayName = "PriceListTable";
