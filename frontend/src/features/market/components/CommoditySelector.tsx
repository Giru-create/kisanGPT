// ─────────────────────────────────────────────────────────────────────────────
// CommoditySelector.tsx
// KisanGPT — Commodity pill-based selector with WCAG 2.2 touch targets
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { COMMODITIES } from "../constants/market.constants";

const COMMODITY_EMOJI: Record<string, string> = {
  Wheat: "🌾",
  Mustard: "🌼",
  Paddy: "🍚",
  Cotton: "☁️",
  Soybean: "🫘",
  Gram: "🟡",
  Maize: "🌽",
  Onion: "🧅",
  Potato: "🥔",
  Tomato: "🍅",
};

interface CommoditySelectorProps {
  selected: string;
  onSelect: (commodity: string) => void;
}

export const CommoditySelector: React.FC<CommoditySelectorProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Select Crop
        </span>
        <span className="text-xs text-muted-foreground">
          {COMMODITIES.length} crops available
        </span>
      </div>

      {/* Pill-based horizontal scroll selector */}
      <div
        role="group"
        aria-label="Select commodity"
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1"
        style={{ scrollbarWidth: "none" }}
      >
        {COMMODITIES.map((commodity) => {
          const isSelected = selected === commodity;
          return (
            <button
              key={commodity}
              type="button"
              onClick={() => onSelect(commodity)}
              aria-pressed={isSelected}
              aria-label={`Select ${commodity}`}
              className={cn(
                // Base: min 44px touch target, pill shape
                "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2.5 min-h-[44px] text-sm font-medium",
                "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "select-none shrink-0",
                isSelected
                  ? // Active: primary brand green
                    "border-primary bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                  : // Inactive: subtle muted pill
                    "border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-primary/40",
              )}
            >
              <span aria-hidden="true" className="text-base leading-none">
                {COMMODITY_EMOJI[commodity] ?? "🌿"}
              </span>
              <span>{commodity}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

CommoditySelector.displayName = "CommoditySelector";
