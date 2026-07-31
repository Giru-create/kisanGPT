"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SchemeFilters } from "../types/schemes.types";

interface SchemeExplorerProps {
  filters: SchemeFilters;
  onSetState: (state: string | null) => void;
  onSetCrop: (crop: string | null) => void;
  onSetFarmerCategory: (category: string | null) => void;
  onSetSchemeType: (type: string | null) => void;
  onSetSearch: (search: string) => void;
  onReset: () => void;
}

const STATES = [
  "Andhra Pradesh",
  "Bihar",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Uttar Pradesh",
  "West Bengal",
];

const CROPS = ["Rice", "Wheat", "Cotton", "Sugarcane", "Pulses", "Oilseeds"];

const FARMER_CATEGORIES = [
  { label: "All Farmers", value: null },
  { label: "Small", value: "small" },
  { label: "Marginal", value: "marginal" },
];

const SCHEME_TYPES = [
  { label: "All Types", value: null },
  { label: "Income Support", value: "income_support" },
  { label: "Insurance", value: "insurance" },
  { label: "Subsidy", value: "subsidy" },
  { label: "Training", value: "training" },
];

export const SchemeExplorer: React.FC<SchemeExplorerProps> = ({
  filters,
  onSetState,
  onSetCrop,
  onSetFarmerCategory,
  onSetSchemeType,
  onSetSearch,
  onReset,
}) => {
  const [showFilters, setShowFilters] = React.useState(false);

  const hasActiveFilters =
    filters.state ||
    filters.crop ||
    filters.farmerCategory ||
    filters.schemeType;

  const activeFilterCount = [
    filters.state,
    filters.crop,
    filters.farmerCategory,
    filters.schemeType,
  ].filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
    >
      {/* Search bar */}
      <div className="flex items-center gap-2 p-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search schemes by name, category, or keyword..."
            value={filters.search}
            onChange={(e) => onSetSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
            aria-label="Search government schemes"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "relative flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-xl border border-border min-h-[44px] transition-colors",
            showFilters || hasActiveFilters
              ? "bg-primary/5 border-primary/30 text-primary"
              : "bg-background hover:bg-muted",
          )}
          aria-label="Toggle filters"
          aria-expanded={showFilters}
        >
          <SlidersHorizontal size={14} />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="px-3 pb-3 border-t border-border/50 pt-3">
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.state ?? ""}
              onChange={(e) => onSetState(e.target.value || null)}
              className="px-3 py-2 text-xs rounded-xl border border-border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[40px]"
              aria-label="Filter by state"
            >
              <option value="">All States</option>
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={filters.crop ?? ""}
              onChange={(e) => onSetCrop(e.target.value || null)}
              className="px-3 py-2 text-xs rounded-xl border border-border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[40px]"
              aria-label="Filter by crop"
            >
              <option value="">All Crops</option>
              {CROPS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={filters.farmerCategory ?? ""}
              onChange={(e) => onSetFarmerCategory(e.target.value || null)}
              className="px-3 py-2 text-xs rounded-xl border border-border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[40px]"
              aria-label="Filter by farmer category"
            >
              {FARMER_CATEGORIES.map((fc) => (
                <option key={fc.label} value={fc.value ?? ""}>
                  {fc.label}
                </option>
              ))}
            </select>

            <select
              value={filters.schemeType ?? ""}
              onChange={(e) => onSetSchemeType(e.target.value || null)}
              className="px-3 py-2 text-xs rounded-xl border border-border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[40px]"
              aria-label="Filter by scheme type"
            >
              {SCHEME_TYPES.map((st) => (
                <option key={st.label} value={st.value ?? ""}>
                  {st.label}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-500/10 rounded-xl min-h-[40px] transition-colors"
                aria-label="Clear all filters"
              >
                <X size={12} aria-hidden="true" /> Clear All
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

SchemeExplorer.displayName = "SchemeExplorer";
