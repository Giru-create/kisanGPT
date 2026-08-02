"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SettingsCardProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  label,
  description,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-muted/30 border border-border/50",
        "hover:bg-muted/50 transition-colors duration-200",
        className,
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="ds-label text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
};

SettingsCard.displayName = "SettingsCard";
