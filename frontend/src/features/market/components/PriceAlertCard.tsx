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
          ? "border-border bg-card"
          : "border-border bg-muted/30 opacity-60"
      }`}
      aria-label={`Price alert for ${alert.commodity}: ${conditionLabel}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {alert.commodity}
          </h3>
          <p className="text-sm text-muted-foreground">{conditionLabel}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
            alert.is_active
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {alert.is_active ? "Active" : "Paused"}
        </span>
      </div>

      <div className="mb-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Condition:</span>{" "}
        {alert.condition === "above"
          ? "Price rises above"
          : "Price falls below"}{" "}
        ₹{alert.target_price.toLocaleString("en-IN")}/qnt
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <time dateTime={alert.created_at}>
          Created{" "}
          {new Date(alert.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
        {alert.triggered_at && (
          <span className="text-emerald-600 dark:text-emerald-400">
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
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
          aria-label={alert.is_active ? "Pause alert" : "Resume alert"}
        >
          {alert.is_active ? "Pause" : "Resume"}
        </button>
        <button
          type="button"
          onClick={() => onRemove(alert.id)}
          className="rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-100 dark:hover:bg-red-900/30"
          aria-label={`Remove alert for ${alert.commodity}`}
        >
          Remove
        </button>
      </div>
    </article>
  );
}
