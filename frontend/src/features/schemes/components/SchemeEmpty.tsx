"use client";

// ─────────────────────────────────────────────────────────────────────────────
// SchemeEmpty.tsx
// KisanGPT — Government Schemes empty state component
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Landmark } from "lucide-react";

interface SchemeEmptyProps {
  onReset: () => void;
}

export const SchemeEmpty: React.FC<SchemeEmptyProps> = ({ onReset }) => {
  return (
    <section
      role="status"
      aria-label="No schemes found"
      className="rounded-2xl border border-border bg-card p-8 text-center flex flex-col items-center gap-3 shadow-sm"
    >
      <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400 shrink-0">
        <Landmark size={28} aria-hidden="true" />
      </div>
      <h2 className="text-base font-extrabold text-foreground">
        No Schemes Found
      </h2>
      <p className="text-xs text-muted-foreground max-w-xs">
        No government schemes match your current filters. Try adjusting your
        search criteria or clear all filters.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-2 inline-flex items-center text-xs font-bold text-primary hover:underline min-h-[44px]"
      >
        Clear All Filters
      </button>
    </section>
  );
};

SchemeEmpty.displayName = "SchemeEmpty";
