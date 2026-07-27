// ─────────────────────────────────────────────────────────────────────────────
// MemoryCard.tsx
// KisanGPT — Individual Farm Memory Item Card Component
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import {
  Calendar,
  MapPin,
  Tag,
  CheckCircle2,
  Trash2,
  Wheat,
  Bug,
  Droplets,
  FlaskConical,
  FileText,
  Layers,
} from "lucide-react";
import type { FarmMemoryItem } from "../types/memory.types";

interface MemoryCardProps {
  item: FarmMemoryItem;
  onDelete?: (id: string) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ item, onDelete }) => {
  const formattedDate = new Date(item.timestamp).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const getCategoryIcon = () => {
    switch (item.category) {
      case "soil":
        return (
          <Layers size={16} className="text-amber-600 dark:text-amber-400" />
        );
      case "crop_yield":
        return (
          <Wheat size={16} className="text-emerald-600 dark:text-emerald-400" />
        );
      case "disease_history":
        return <Bug size={16} className="text-red-500" />;
      case "irrigation":
        return <Droplets size={16} className="text-blue-500" />;
      case "fertilizer":
        return <FlaskConical size={16} className="text-purple-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all shadow-xs space-y-3">
      {/* Header Badges */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-muted/60 flex items-center justify-center shrink-0">
            {getCategoryIcon()}
          </span>
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-primary/10 text-primary capitalize">
            {item.category.replace("_", " ")}
          </span>
          {item.isVerified && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={12} /> Verified
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <Calendar size={12} />
            {formattedDate}
          </span>

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              aria-label={`Delete record ${item.title}`}
              className="p-1 text-muted-foreground hover:text-destructive transition-colors rounded-lg min-h-[32px] min-w-[32px] flex items-center justify-center"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-foreground leading-tight">
          {item.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Metrics Row if present */}
      {item.metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl bg-muted/40 text-xs font-medium">
          {item.metrics.ph !== undefined && (
            <div>
              <span className="text-[10px] text-muted-foreground block">
                pH
              </span>
              <span className="font-bold text-foreground">
                {item.metrics.ph}
              </span>
            </div>
          )}
          {item.metrics.yield_quintals !== undefined && (
            <div>
              <span className="text-[10px] text-muted-foreground block">
                Yield (qtl/acre)
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {item.metrics.yield_quintals} qtl
              </span>
            </div>
          )}
          {item.metrics.water_liters !== undefined && (
            <div>
              <span className="text-[10px] text-muted-foreground block">
                Water Volume
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {item.metrics.water_liters} L
              </span>
            </div>
          )}
          {item.metrics.nitrogen !== undefined && (
            <div>
              <span className="text-[10px] text-muted-foreground block">
                N-P-K Ratio
              </span>
              <span className="font-bold text-foreground">
                {item.metrics.nitrogen}-{item.metrics.phosphorus}-
                {item.metrics.potassium}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Footer Location & Tags */}
      <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px]">
        {item.location && (
          <span className="flex items-center gap-1 font-medium text-muted-foreground">
            <MapPin size={12} />
            {item.location}
          </span>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            <Tag size={11} className="text-muted-foreground shrink-0" />
            {item.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-muted/70 text-[10px] font-medium text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

MemoryCard.displayName = "MemoryCard";
