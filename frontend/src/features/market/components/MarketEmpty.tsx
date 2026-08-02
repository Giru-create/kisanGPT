"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { COMMODITY_EMOJI } from "../constants/market.constants";

interface MarketEmptyProps {
  commodity?: string;
  onSelectCommodity?: (commodity: string) => void;
}

const SUGGESTED_SEARCHES = ["Wheat", "Rice", "Tomato", "Cotton", "Maize"];

export const MarketEmpty: React.FC<MarketEmptyProps> = ({
  commodity,
  onSelectCommodity,
}) => {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-8 text-center"
    >
      {/* Icon cluster */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="text-3xl"
        >
          {COMMODITY_EMOJI["Wheat"]}
        </motion.span>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-2xl opacity-60"
        >
          {COMMODITY_EMOJI["Tomato"]}
        </motion.span>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="text-3xl"
        >
          {COMMODITY_EMOJI["Cotton"]}
        </motion.span>
      </div>

      {/* Title */}
      <h3 className="ds-heading-sm text-foreground mb-2">
        {commodity
          ? `No data found for "${commodity}"`
          : "Explore Commodity Markets"}
      </h3>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed mb-5">
        {commodity
          ? "Try a different commodity or clear your search to browse all available markets."
          : "Search for any crop to see live mandi prices, AI recommendations, and price trends across India."}
      </p>

      {/* Suggested searches */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
        <span className="text-[10px] text-muted-foreground">
          Try searching:
        </span>
        {SUGGESTED_SEARCHES.map((search) => (
          <button
            key={search}
            onClick={() => onSelectCommodity?.(search)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border bg-background text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            {COMMODITY_EMOJI[search] ?? "\uD83C\uDF3E"} {search}
          </button>
        ))}
      </div>

      {/* CTA */}
      {onSelectCommodity && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectCommodity("Wheat")}
          leftIcon={<Search size={14} />}
          className="text-xs"
        >
          Browse All Commodities
        </Button>
      )}
    </motion.div>
  );
};

MarketEmpty.displayName = "MarketEmpty";
