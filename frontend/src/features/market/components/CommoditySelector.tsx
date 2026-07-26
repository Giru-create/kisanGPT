// ─────────────────────────────────────────────────────────────────────────────
// CommoditySelector.tsx
// KisanGPT — Commodity dropdown selector
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { COMMODITIES } from "../constants/market.constants";

interface CommoditySelectorProps {
  selected: string;
  onSelect: (commodity: string) => void;
}

export const CommoditySelector: React.FC<CommoditySelectorProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="commodity-select"
        className="text-xs font-medium text-muted-foreground"
      >
        Select Commodity
      </label>
      <select
        id="commodity-select"
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {COMMODITIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
};

CommoditySelector.displayName = "CommoditySelector";
