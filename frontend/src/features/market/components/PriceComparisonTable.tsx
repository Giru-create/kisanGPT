// ─────────────────────────────────────────────────────────────────────────────
// PriceComparisonTable.tsx
// KisanGPT — Price comparison table across mandis
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import type { CommodityPrice } from "../types/market.types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PriceComparisonTableProps {
  prices: CommodityPrice[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PriceComparisonTable({ prices }: PriceComparisonTableProps) {
  if (prices.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-muted-foreground">No price data available.</p>
      </div>
    );
  }

  const sorted = [...prices].sort(
    (a, b) => b.price_per_quintal - a.price_per_quintal,
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            Price comparison across mandis for {prices[0]?.commodity}
          </caption>
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th scope="col" className="px-4 py-3 font-medium text-foreground">Mandi</th>
              <th scope="col" className="px-4 py-3 font-medium text-foreground">District</th>
              <th scope="col" className="px-4 py-3 font-medium text-foreground">State</th>
              <th scope="col" className="px-4 py-3 text-right font-medium text-foreground">
                Price (₹/qnt)
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium text-foreground">
                Change
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium text-foreground">
                MSP Diff
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr
                key={p.mandi_name}
                className="border-b border-border/50 transition-colors hover:bg-muted/30"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {p.mandi_name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.district}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.state}</td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">
                  ₹{p.price_per_quintal.toLocaleString("en-IN")}
                </td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    p.is_rise
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {p.change_amount > 0 ? "+" : ""}₹{p.change_amount} (
                  {p.change_percent > 0 ? "+" : ""}
                  {p.change_percent}%)
                </td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    p.msp_difference > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : p.msp_difference < 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                  }`}
                >
                  {p.msp_difference > 0 ? "+" : ""}₹{p.msp_difference}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
        {prices.length} mandi{prices.length !== 1 ? "s" : ""} compared
      </div>
    </div>
  );
}
