// ─────────────────────────────────────────────────────────────────────────────
// PriceAlertCard.tsx
// KisanGPT — Price alert card component
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import type { PriceAlert } from "../types/market.types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PriceAlertCardProps {
  alert: PriceAlert;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PriceAlertCard({
  alert,
  onRemove,
  onToggle,
}: PriceAlertCardProps) {
  const conditionLabel =
    alert.condition === "above"
      ? `Above ₹${alert.target_price.toLocaleString("en-IN")}`
      : `Below ₹${alert.target_price.toLocaleString("en-IN")}`;

  return (
    <article
      className={`rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md ${
        alert.is_active
          ? "border-green-200 bg-white"
          : "border-gray-200 bg-gray-50 opacity-60"
      }`}
      aria-label={`Price alert for ${alert.commodity}: ${conditionLabel}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-green-900">
            {alert.commodity}
          </h3>
          <p className="text-sm text-green-600">{conditionLabel}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
            alert.is_active
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {alert.is_active ? "Active" : "Paused"}
        </span>
      </div>

      <div className="mb-3 text-sm text-green-700">
        <span className="font-medium">Condition:</span>{" "}
        {alert.condition === "above"
          ? "Price rises above"
          : "Price falls below"}{" "}
        ₹{alert.target_price.toLocaleString("en-IN")}/qnt
      </div>

      <div className="flex items-center gap-3 text-xs text-green-500">
        <time dateTime={alert.created_at}>
          Created{" "}
          {new Date(alert.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
        {alert.triggered_at && (
          <span className="text-green-600">
            Triggered{" "}
            {new Date(alert.triggered_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </span>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => onToggle(alert.id)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            alert.is_active
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          aria-label={alert.is_active ? "Pause alert" : "Resume alert"}
        >
          {alert.is_active ? "Pause" : "Resume"}
        </button>
        <button
          type="button"
          onClick={() => onRemove(alert.id)}
          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
          aria-label={`Remove alert for ${alert.commodity}`}
        >
          Remove
        </button>
      </div>
    </article>
  );
}
