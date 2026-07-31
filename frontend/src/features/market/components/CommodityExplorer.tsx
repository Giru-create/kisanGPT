"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, TrendingUp, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { MandiPriceCard } from "./MandiPriceCard";
import {
  COMMODITY_CATEGORIES,
  CATEGORY_LABELS,
} from "../constants/market.constants";
import type { CommodityPrice, CommodityCategory } from "../types/market.types";

interface CommodityExplorerProps {
  prices: CommodityPrice[];
  onSetAlert?: (commodity: string) => void;
  onViewHistory?: (commodity: string, mandi: string) => void;
}

export const CommodityExplorer: React.FC<CommodityExplorerProps> = ({
  prices,
  onSetAlert,
  onViewHistory,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    CommodityCategory | "all"
  >("all");
  const [showTrending, setShowTrending] = useState(false);
  const [showHighestProfit, setShowHighestProfit] = useState(false);

  const categories = Object.keys(CATEGORY_LABELS) as CommodityCategory[];

  // Filter logic
  let filtered = prices;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.commodity.toLowerCase().includes(q) ||
        p.mandi_name.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.variety.toLowerCase().includes(q),
    );
  }

  if (selectedCategory !== "all") {
    filtered = filtered.filter((p) => {
      const cat = COMMODITY_CATEGORIES[p.commodity];
      return cat === selectedCategory;
    });
  }

  if (showTrending) {
    filtered = filtered.filter((p) => p.change_percent > 1.5);
  }

  if (showHighestProfit) {
    filtered = [...filtered].sort(
      (a, b) => b.msp_difference - a.msp_difference,
    );
  }

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (showTrending ? 1 : 0) +
    (showHighestProfit ? 1 : 0);

  return (
    <motion.section
      role="region"
      aria-label="Commodity Explorer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={16}
            className="text-primary"
            aria-hidden="true"
          />
          <h2 className="text-sm font-semibold text-foreground">
            Commodity Explorer
          </h2>
          {activeFilterCount > 0 && (
            <Badge variant="info" className="text-[10px]">
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Search bar */}
      <div className="relative mb-3">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search commodity, mandi, state..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          aria-label="Search commodities"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("all")}
          className={cn(
            "shrink-0 px-3 py-1.5 rounded-full text-[10px] font-medium border transition-colors",
            selectedCategory === "all"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-background text-muted-foreground hover:text-foreground",
          )}
          aria-pressed={selectedCategory === "all"}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-[10px] font-medium border transition-colors",
              selectedCategory === cat
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={selectedCategory === cat}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Quick filters */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowTrending(!showTrending)}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-medium border transition-colors",
            showTrending
              ? "border-amber-300 bg-amber-50 text-amber-700"
              : "border-border bg-background text-muted-foreground hover:text-foreground",
          )}
          aria-pressed={showTrending}
        >
          <TrendingUp size={10} />
          Trending
        </button>
        <button
          onClick={() => setShowHighestProfit(!showHighestProfit)}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-medium border transition-colors",
            showHighestProfit
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "border-border bg-background text-muted-foreground hover:text-foreground",
          )}
          aria-pressed={showHighestProfit}
        >
          <Flame size={10} />
          Highest Profit
        </button>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            No commodities match your filters.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setShowTrending(false);
              setShowHighestProfit(false);
            }}
            className="text-xs text-primary mt-2 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((price, i) => (
            <MandiPriceCard
              key={`${price.commodity}-${price.mandi_name}`}
              price={price}
              onSetAlert={onSetAlert}
              onViewHistory={onViewHistory}
              index={i}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
};

CommodityExplorer.displayName = "CommodityExplorer";
