"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  CheckCircle2,
  Trash2,
  Pin,
  Bookmark,
  Share2,
  ArrowUpRight,
  Layers,
  Wheat,
  Bug,
  Droplets,
  FlaskConical,
  Cloud,
  TrendingUp,
  Shield,
  Mic,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import {
  MEMORY_CATEGORIES,
  SOURCE_CONFIG,
  IMPORTANCE_CONFIG,
} from "../constants/memory.constants";
import type { FarmMemoryItem } from "../types/memory.types";

interface MemoryCardProps {
  item: FarmMemoryItem;
  index?: number;
  onDelete?: (id: string) => void;
  onPin?: (id: string) => void;
  onSave?: (id: string) => void;
  onSelect?: (item: FarmMemoryItem) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  soil: Layers,
  crop_yield: Wheat,
  disease_history: Bug,
  irrigation: Droplets,
  fertilizer: FlaskConical,
  weather_decisions: Cloud,
  market_decisions: TrendingUp,
  govt_schemes: Shield,
  voice_conversations: Mic,
  saved_ai_advice: Bookmark,
  custom_note: FileText,
};

export const MemoryCard: React.FC<MemoryCardProps> = ({
  item,
  index = 0,
  onDelete,
  onPin,
  onSave,
  onSelect,
}) => {
  const formattedDate = new Date(item.timestamp).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const CategoryIcon = CATEGORY_ICONS[item.category] ?? FileText;
  const categoryCfg = MEMORY_CATEGORIES.find((c) => c.id === item.category);
  const sourceCfg = item.source ? SOURCE_CONFIG[item.source] : undefined;
  const importanceCfg = item.importance
    ? IMPORTANCE_CONFIG[item.importance]
    : undefined;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
      className={cn(
        "p-4 rounded-2xl border bg-card hover:border-primary/30 transition-all shadow-xs space-y-3 cursor-pointer group",
        item.isPinned
          ? "border-amber-500/30 bg-amber-500/5"
          : "border-border/60",
      )}
      onClick={() => onSelect?.(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(item);
        }
      }}
      aria-label={`Memory: ${item.title}`}
    >
      {/* Header Badges */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "p-1.5 rounded-xl flex items-center justify-center shrink-0",
              categoryCfg?.bg ?? "bg-muted/60",
            )}
          >
            <CategoryIcon
              size={14}
              className={categoryCfg?.color ?? "text-muted-foreground"}
            />
          </span>
          <Badge
            className={cn(
              "text-[9px] px-2 py-0",
              categoryCfg?.color,
              categoryCfg?.bg,
            )}
          >
            {categoryCfg?.label ?? item.category}
          </Badge>
          {item.isVerified && (
            <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={10} /> Verified
            </span>
          )}
          {item.isPinned && (
            <span className="flex items-center gap-1 text-[9px] font-semibold text-amber-600 dark:text-amber-400">
              <Pin size={10} /> Pinned
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {importanceCfg && (
            <span
              className={cn(
                "text-[9px] font-semibold px-1.5 py-0.5 rounded-full",
                importanceCfg.bg,
                importanceCfg.color,
              )}
            >
              {importanceCfg.label}
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>

      {/* AI Explanation */}
      {item.aiExplanation && (
        <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-[10px] font-semibold text-primary mb-1">
            AI Insight
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
            {item.aiExplanation}
          </p>
        </div>
      )}

      {/* Metrics Row */}
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
                Yield
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {item.metrics.yield_quintals} qtl
              </span>
            </div>
          )}
          {item.metrics.water_liters !== undefined && (
            <div>
              <span className="text-[10px] text-muted-foreground block">
                Water
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {item.metrics.water_liters.toLocaleString()} L
              </span>
            </div>
          )}
          {item.metrics.nitrogen !== undefined && (
            <div>
              <span className="text-[10px] text-muted-foreground block">
                N-P-K
              </span>
              <span className="font-bold text-foreground">
                {item.metrics.nitrogen}-{item.metrics.phosphorus ?? 0}-
                {item.metrics.potassium ?? 0}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {item.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 4 && (
            <span className="text-[9px] text-muted-foreground">
              +{item.tags.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-border/30">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {formattedDate}
          </span>
          {item.location && (
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {item.location}
            </span>
          )}
          {sourceCfg && (
            <span
              className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded-full font-semibold",
                sourceCfg.bg,
                sourceCfg.color,
              )}
            >
              {sourceCfg.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onPin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPin(item.id);
              }}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                item.isPinned
                  ? "text-amber-600 bg-amber-500/10"
                  : "text-muted-foreground hover:bg-muted",
              )}
              aria-label={item.isPinned ? "Unpin memory" : "Pin memory"}
            >
              <Pin size={13} className={item.isPinned ? "fill-current" : ""} />
            </button>
          )}
          {onSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave(item.id);
              }}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                item.isSaved
                  ? "text-violet-600 bg-violet-500/10"
                  : "text-muted-foreground hover:bg-muted",
              )}
              aria-label={item.isSaved ? "Unsave memory" : "Save memory"}
            >
              <Bookmark
                size={13}
                className={item.isSaved ? "fill-current" : ""}
              />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Share memory"
          >
            <Share2 size={13} />
          </button>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors"
              aria-label={`Delete memory: ${item.title}`}
            >
              <Trash2 size={13} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(item);
            }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            aria-label="View details"
          >
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

MemoryCard.displayName = "MemoryCard";
