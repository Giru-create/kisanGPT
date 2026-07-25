"use client";

// ─────────────────────────────────────────────────────────────────────────────
// WeatherStatBadge.tsx
// KisanGPT — Inline stat pill (humidity, wind, UV)
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { cn } from "@/lib/utils";

interface WeatherStatBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}

export const WeatherStatBadge: React.FC<WeatherStatBadgeProps> = ({
  icon,
  label,
  value,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 rounded-xl",
        "bg-white/60 dark:bg-white/5",
        "border border-white/80 dark:border-white/10",
        "backdrop-blur-sm",
        "px-3 py-2.5 min-w-[72px]",
        className,
      )}
    >
      {/* Icon */}
      <span className="text-muted-foreground" aria-hidden="true">
        {icon}
      </span>

      {/* Value */}
      <span className="text-sm font-semibold text-foreground leading-none">
        {value}
      </span>

      {/* Label */}
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide leading-none">
        {label}
      </span>
    </div>
  );
};

WeatherStatBadge.displayName = "WeatherStatBadge";
