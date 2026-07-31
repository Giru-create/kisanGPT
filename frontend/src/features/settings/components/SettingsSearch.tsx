// ─────────────────────────────────────────────────────────────────────────────
// SettingsSearch.tsx
// KisanGPT — Global settings search component
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, { useCallback } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SettingsSearch: React.FC<SettingsSearchProps> = ({
  value,
  onChange,
  placeholder = "Search settings...",
}) => {
  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-card text-foreground",
          "text-sm placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "transition-colors duration-200",
        )}
        aria-label="Search settings"
      />
      {value.length > 0 && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3 w-3 text-muted-foreground" />
        </button>
      )}
    </div>
  );
};

SettingsSearch.displayName = "SettingsSearch";
