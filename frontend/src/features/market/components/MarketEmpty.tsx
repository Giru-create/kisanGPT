// ─────────────────────────────────────────────────────────────────────────────
// MarketEmpty.tsx
// KisanGPT — Market Intelligence empty state with quick-pick crop chips
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

interface MarketEmptyProps {
  commodity?: string;
  onSelectCommodity?: (c: string) => void;
}

const QUICK_CROPS = ["Wheat", "Mustard", "Paddy", "Cotton", "Onion"];

export const MarketEmpty: React.FC<MarketEmptyProps> = ({
  commodity,
  onSelectCommodity,
}) => {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-dashed border-border bg-card p-8 flex flex-col items-center gap-4 text-center"
    >
      <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center">
        <BarChart3
          size={28}
          className="text-muted-foreground"
          aria-hidden="true"
        />
      </div>

      <div>
        <p className="text-base font-semibold text-foreground">
          {commodity
            ? `No prices found for "${commodity}"`
            : "No market data available"}
        </p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          {commodity
            ? "Try selecting a different crop or check back shortly."
            : "Select a commodity above to view current mandi prices and trends."}
        </p>
      </div>

      {/* Quick-pick crop chips */}
      {onSelectCommodity && (
        <div className="flex flex-col items-center gap-2 mt-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Popular crops
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {QUICK_CROPS.map((crop) => (
              <button
                key={crop}
                type="button"
                onClick={() => onSelectCommodity(crop)}
                aria-label={`View prices for ${crop}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-2 min-h-[44px] text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-primary/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {crop}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

MarketEmpty.displayName = "MarketEmpty";
