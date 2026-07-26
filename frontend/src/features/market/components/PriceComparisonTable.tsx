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
      <div className="rounded-xl border border-green-200 bg-white p-8 text-center shadow-sm">
        <p className="text-green-600">No price data available.</p>
      </div>
    );
  }

  const sorted = [...prices].sort(
    (a, b) => b.price_per_quintal - a.price_per_quintal,
  );

  return (
    <div className="overflow-hidden rounded-xl border border-green-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-green-200 bg-green-50">
              <th className="px-4 py-3 font-medium text-green-900">Mandi</th>
              <th className="px-4 py-3 font-medium text-green-900">District</th>
              <th className="px-4 py-3 font-medium text-green-900">State</th>
              <th className="px-4 py-3 text-right font-medium text-green-900">
                Price (₹/qnt)
              </th>
              <th className="px-4 py-3 text-right font-medium text-green-900">
                Change
              </th>
              <th className="px-4 py-3 text-right font-medium text-green-900">
                MSP Diff
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr
                key={p.mandi_name}
                className="border-b border-green-100 transition-colors hover:bg-green-50/50"
              >
                <td className="px-4 py-3 font-medium text-green-900">
                  {p.mandi_name}
                </td>
                <td className="px-4 py-3 text-green-700">{p.district}</td>
                <td className="px-4 py-3 text-green-700">{p.state}</td>
                <td className="px-4 py-3 text-right font-semibold text-green-900">
                  ₹{p.price_per_quintal.toLocaleString("en-IN")}
                </td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    p.is_rise ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {p.change_amount > 0 ? "+" : ""}₹{p.change_amount} (
                  {p.change_percent > 0 ? "+" : ""}
                  {p.change_percent}%)
                </td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    p.msp_difference > 0
                      ? "text-green-600"
                      : p.msp_difference < 0
                        ? "text-red-600"
                        : "text-gray-600"
                  }`}
                >
                  {p.msp_difference > 0 ? "+" : ""}₹{p.msp_difference}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-green-100 bg-green-50/50 px-4 py-2 text-xs text-green-600">
        {prices.length} mandi{prices.length !== 1 ? "s" : ""} compared
      </div>
    </div>
  );
}
