// ─────────────────────────────────────────────────────────────────────────────
// MemoryCategoryFilter.tsx
// KisanGPT — Farm Memory Category Tabs Filter
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { MEMORY_CATEGORIES } from "../constants/memory.constants";
import type { MemoryCategory } from "../types/memory.types";

interface MemoryCategoryFilterProps {
  selected: MemoryCategory;
  onSelect: (category: MemoryCategory) => void;
}

export const MemoryCategoryFilter: React.FC<MemoryCategoryFilterProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div
      role="tablist"
      aria-label="Filter farm memories by category"
      className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
    >
      {MEMORY_CATEGORIES.map((cat) => {
        const isSelected = selected === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelect(cat.id)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-2xl whitespace-nowrap transition-all duration-200 min-h-[40px] flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary ${
              isSelected
                ? "bg-primary text-primary-foreground shadow-sm font-bold scale-[1.02]"
                : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};

MemoryCategoryFilter.displayName = "MemoryCategoryFilter";
