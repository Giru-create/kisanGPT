// ─────────────────────────────────────────────────────────────────────────────
// RadioGroup.tsx
// KisanGPT — Reusable radio group component
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface RadioOption {
  id: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  name: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  options,
  onChange,
  name,
}) => {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={name}>
      {options.map((opt) => {
        const isSelected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all duration-200",
              "min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSelected
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-border/80 hover:bg-muted/30",
            )}
          >
            <div
              className={cn(
                "h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center shrink-0",
                isSelected ? "border-primary" : "border-muted-foreground/40",
              )}
            >
              {isSelected && (
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </div>
            <div className="text-left">
              <span className="font-medium">{opt.label}</span>
              {opt.description && (
                <span className="block text-xs text-muted-foreground">
                  {opt.description}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

RadioGroup.displayName = "RadioGroup";
