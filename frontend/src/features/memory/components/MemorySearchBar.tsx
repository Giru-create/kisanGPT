"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { MEMORY_CATEGORIES } from "../constants/memory.constants";
import type { MemoryCategory, FilterTab } from "../types/memory.types";

interface MemorySearchBarProps {
  search: string;
  category: MemoryCategory;
  filterTab: FilterTab;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: MemoryCategory) => void;
  onFilterTabChange: (tab: FilterTab) => void;
  onClear: () => void;
}

const FILTER_TABS: Array<{ id: FilterTab; label: string; icon: string }> = [
  { id: "all", label: "All", icon: "📋" },
  { id: "pinned", label: "Pinned", icon: "📌" },
  { id: "saved", label: "Saved", icon: "🔖" },
  { id: "recent", label: "Recent", icon: "🕐" },
];

export const MemorySearchBar: React.FC<MemorySearchBarProps> = ({
  search,
  category,
  filterTab,
  onSearchChange,
  onCategoryChange,
  onFilterTabChange,
  onClear,
}) => {
  const [showCategories, setShowCategories] = React.useState(false);

  const hasActiveFilters = category !== "all" || filterTab !== "all" || search;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.12, ease: "easeOut" }}
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
            placeholder="Search memories by keyword, crop, or tag..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
            aria-label="Search farm memories"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
              aria-label="Clear search"
            >
              <X size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowCategories(!showCategories)}
          className={cn(
            "relative flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-xl border border-border min-h-[44px] transition-colors",
            showCategories
              ? "bg-primary/5 border-primary/30 text-primary"
              : "bg-background hover:bg-muted",
          )}
          aria-label="Toggle category filters"
          aria-expanded={showCategories}
        >
          <SlidersHorizontal size={14} />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
              {
                [category !== "all", filterTab !== "all", !!search].filter(
                  Boolean,
                ).length
              }
            </span>
          )}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onFilterTabChange(tab.id)}
              className={cn(
                "shrink-0 px-3 py-1.5 text-[11px] font-semibold rounded-full transition-all min-h-[32px]",
                filterTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="shrink-0 px-3 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-500/10 rounded-full min-h-[32px] transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Category chips */}
      <AnimatePresence>
        {showCategories && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 border-t border-border/50 pt-3">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {MEMORY_CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => onCategoryChange(cat.id as MemoryCategory)}
                      className={cn(
                        "shrink-0 px-2.5 py-1.5 text-[10px] font-semibold rounded-full transition-all min-h-[28px]",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

MemorySearchBar.displayName = "MemorySearchBar";
