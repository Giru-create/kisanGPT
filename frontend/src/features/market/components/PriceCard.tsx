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
  const changeColor = price.is_rise ? "text-green-600" : "text-red-600";
  const changeBg = price.is_rise ? "bg-green-50" : "bg-red-50";
  const changeIcon = price.is_rise ? "▲" : "▼";
  const mspStatus =
    price.msp_difference > 0
      ? { label: "Above MSP", color: "text-green-700 bg-green-100" }
      : price.msp_difference < 0
        ? { label: "Below MSP", color: "text-red-700 bg-red-100" }
        : { label: "At MSP", color: "text-gray-700 bg-gray-100" };

  return (
    <article
      className="rounded-xl border border-green-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
      aria-label={`${price.commodity} price at ${price.mandi_name}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-green-900">
            {price.commodity}
          </h3>
          <p className="text-sm text-green-600">{price.variety}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${mspStatus.color}`}
        >
          {mspStatus.label}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-3xl font-bold text-green-900">
          ₹{price.price_per_quintal.toLocaleString("en-IN")}
        </p>
        <p className="text-sm text-green-600">per quintal</p>
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

      <div className="flex items-center justify-between text-sm text-green-600">
        <span>{price.mandi_name}</span>
        <span>
          {price.district}, {price.state}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-green-500">
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
