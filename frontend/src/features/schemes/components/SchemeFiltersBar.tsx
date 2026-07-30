"use client";

// ─────────────────────────────────────────────────────────────────────────────
// SchemeFiltersBar.tsx
// KisanGPT — Government Schemes filter bar component
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Search, X } from "lucide-react";
import type { SchemeFilters } from "../types/schemes.types";

interface SchemeFiltersBarProps {
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

export const SchemeFiltersBar: React.FC<SchemeFiltersBarProps> = ({
  filters,
  onSetState,
  onSetCrop,
  onSetFarmerCategory,
  onSetSchemeType,
  onSetSearch,
  onReset,
}) => {
  const hasActiveFilters =
    filters.state ||
    filters.crop ||
    filters.farmerCategory ||
    filters.schemeType ||
    filters.search;

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search schemes..."
          value={filters.search}
          onChange={(e) => onSetSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
          aria-label="Search government schemes"
        />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2">
        {/* State */}
        <select
          value={filters.state ?? ""}
          onChange={(e) => onSetState(e.target.value || null)}
          className="px-3 py-2 text-sm rounded-xl border border-border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
          aria-label="Filter by state"
        >
          <option value="">All States</option>
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Crop */}
        <select
          value={filters.crop ?? ""}
          onChange={(e) => onSetCrop(e.target.value || null)}
          className="px-3 py-2 text-sm rounded-xl border border-border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
          aria-label="Filter by crop"
        >
          <option value="">All Crops</option>
          {CROPS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Farmer Category */}
        <select
          value={filters.farmerCategory ?? ""}
          onChange={(e) => onSetFarmerCategory(e.target.value || null)}
          className="px-3 py-2 text-sm rounded-xl border border-border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
          aria-label="Filter by farmer category"
        >
          {FARMER_CATEGORIES.map((fc) => (
            <option key={fc.label} value={fc.value ?? ""}>
              {fc.label}
            </option>
          ))}
        </select>

        {/* Scheme Type */}
        <select
          value={filters.schemeType ?? ""}
          onChange={(e) => onSetSchemeType(e.target.value || null)}
          className="px-3 py-2 text-sm rounded-xl border border-border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
          aria-label="Filter by scheme type"
        >
          {SCHEME_TYPES.map((st) => (
            <option key={st.label} value={st.value ?? ""}>
              {st.label}
            </option>
          ))}
        </select>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 rounded-xl min-h-[44px]"
            aria-label="Clear all filters"
          >
            <X size={14} aria-hidden="true" /> Clear
          </button>
        )}
      </div>
    </div>
  );
};

SchemeFiltersBar.displayName = "SchemeFiltersBar";
