// ─────────────────────────────────────────────────────────────────────────────
// PriceCard.tsx
// KisanGPT — Individual commodity price card
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import type { CommodityPrice } from "../types/market.types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PriceCardProps {
  price: CommodityPrice;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PriceCard({ price }: PriceCardProps) {
  const changeColor = price.is_rise
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-red-600 dark:text-red-400";
  const changeBg = price.is_rise ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-red-50 dark:bg-red-900/20";
  const changeIcon = price.is_rise ? "▲" : "▼";
  const mspStatus =
    price.msp_difference > 0
      ? {
          label: "Above MSP",
          color:
            "text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30",
        }
      : price.msp_difference < 0
        ? {
            label: "Below MSP",
            color: "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30",
          }
        : {
            label: "At MSP",
            color:
              "text-muted-foreground bg-muted dark:bg-muted/50",
          };

  return (
    <article
      className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
      aria-label={`${price.commodity} price at ${price.mandi_name}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {price.commodity}
          </h3>
          <p className="text-sm text-muted-foreground">{price.variety}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${mspStatus.color}`}
        >
          {mspStatus.label}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-3xl font-bold text-foreground">
          ₹{price.price_per_quintal.toLocaleString("en-IN")}
        </p>
        <p className="text-sm text-muted-foreground">per quintal</p>
      </div>

      <div
        className={`mb-3 flex items-center gap-2 rounded-lg px-3 py-2 ${changeBg}`}
      >
        <span className={changeColor}>{changeIcon}</span>
        <span className={`text-sm font-medium ${changeColor}`}>
          {price.change_amount > 0 ? "+" : ""}₹{price.change_amount} (
          {price.change_percent > 0 ? "+" : ""}
          {price.change_percent}%)
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{price.mandi_name}</span>
        <span>
          {price.district}, {price.state}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground/80">
        <span>MSP: ₹{price.msp.toLocaleString("en-IN")}/qnt</span>
        <time dateTime={price.updated_at}>
          {new Date(price.updated_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })}
        </time>
      </div>
    </article>
  );
}
