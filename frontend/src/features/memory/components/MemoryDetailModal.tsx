"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  MapPin,
  Tag,
  CheckCircle2,
  Pin,
  Bookmark,
  Share2,
  Trash2,
  MessageCircle,
  Clock,
  Edit3,
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
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { Badge } from "@/components/ui/Badge";
import {
  MEMORY_CATEGORIES,
  SOURCE_CONFIG,
  IMPORTANCE_CONFIG,
} from "../constants/memory.constants";
import type { FarmMemoryItem } from "../types/memory.types";

interface MemoryDetailModalProps {
  item: FarmMemoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onPin?: (id: string) => void;
  onSave?: (id: string) => void;
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

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onDelete,
  onPin,
  onSave,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useFocusTrap(containerRef, isOpen);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!item) return null;

  const CategoryIcon = CATEGORY_ICONS[item.category] ?? FileText;
  const categoryCfg = MEMORY_CATEGORIES.find((c) => c.id === item.category);
  const sourceCfg = item.source ? SOURCE_CONFIG[item.source] : undefined;
  const importanceCfg = item.importance
    ? IMPORTANCE_CONFIG[item.importance]
    : undefined;

  const createdDate = new Date(item.timestamp).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const updatedDate = item.updatedAt
    ? new Date(item.updatedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Memory detail"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-card/95 backdrop-blur-sm border-b border-border/50">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "p-1.5 rounded-xl flex items-center justify-center",
                    categoryCfg?.bg ?? "bg-muted/60",
                  )}
                >
                  <CategoryIcon
                    size={16}
                    className={categoryCfg?.color ?? "text-muted-foreground"}
                  />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Memory Detail
                  </h2>
                  <p className="text-[10px] text-muted-foreground">
                    {categoryCfg?.label ?? item.category}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close detail view"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Title & badges */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-foreground leading-snug">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    className={cn(
                      "text-[9px]",
                      categoryCfg?.color,
                      categoryCfg?.bg,
                    )}
                  >
                    {categoryCfg?.label}
                  </Badge>
                  {item.isVerified && (
                    <Badge variant="success" className="text-[9px]">
                      <CheckCircle2 size={9} className="mr-1" />
                      Verified
                    </Badge>
                  )}
                  {item.isPinned && (
                    <Badge className="text-[9px] bg-amber-500/10 text-amber-600">
                      <Pin size={9} className="mr-1" />
                      Pinned
                    </Badge>
                  )}
                  {importanceCfg && (
                    <Badge
                      className={cn(
                        "text-[9px]",
                        importanceCfg.color,
                        importanceCfg.bg,
                      )}
                    >
                      {importanceCfg.label} Priority
                    </Badge>
                  )}
                  {sourceCfg && (
                    <Badge
                      className={cn(
                        "text-[9px]",
                        sourceCfg.color,
                        sourceCfg.bg,
                      )}
                    >
                      {sourceCfg.label}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Details
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* AI Explanation */}
              {item.aiExplanation && (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-1.5">
                  <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                    AI Explanation
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.aiExplanation}
                  </p>
                </div>
              )}

              {/* Metrics */}
              {item.metrics && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Metrics
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {item.metrics.ph !== undefined && (
                      <div className="p-2.5 rounded-xl bg-muted/50 text-center">
                        <p className="text-[9px] text-muted-foreground">
                          pH Level
                        </p>
                        <p className="text-sm font-bold text-foreground">
                          {item.metrics.ph}
                        </p>
                      </div>
                    )}
                    {item.metrics.nitrogen !== undefined && (
                      <div className="p-2.5 rounded-xl bg-muted/50 text-center">
                        <p className="text-[9px] text-muted-foreground">
                          Nitrogen (N)
                        </p>
                        <p className="text-sm font-bold text-foreground">
                          {item.metrics.nitrogen}
                        </p>
                      </div>
                    )}
                    {item.metrics.phosphorus !== undefined && (
                      <div className="p-2.5 rounded-xl bg-muted/50 text-center">
                        <p className="text-[9px] text-muted-foreground">
                          Phosphorus (P)
                        </p>
                        <p className="text-sm font-bold text-foreground">
                          {item.metrics.phosphorus}
                        </p>
                      </div>
                    )}
                    {item.metrics.potassium !== undefined && (
                      <div className="p-2.5 rounded-xl bg-muted/50 text-center">
                        <p className="text-[9px] text-muted-foreground">
                          Potassium (K)
                        </p>
                        <p className="text-sm font-bold text-foreground">
                          {item.metrics.potassium}
                        </p>
                      </div>
                    )}
                    {item.metrics.yield_quintals !== undefined && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                        <p className="text-[9px] text-muted-foreground">
                          Yield
                        </p>
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {item.metrics.yield_quintals} qtl/acre
                        </p>
                      </div>
                    )}
                    {item.metrics.water_liters !== undefined && (
                      <div className="p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
                        <p className="text-[9px] text-muted-foreground">
                          Water
                        </p>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {item.metrics.water_liters.toLocaleString()} L
                        </p>
                      </div>
                    )}
                    {item.metrics.area_acres !== undefined && (
                      <div className="p-2.5 rounded-xl bg-muted/50 text-center">
                        <p className="text-[9px] text-muted-foreground">Area</p>
                        <p className="text-sm font-bold text-foreground">
                          {item.metrics.area_acres} acres
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Tags
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium flex items-center gap-1"
                      >
                        <Tag size={9} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Metadata
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50">
                    <Calendar
                      size={13}
                      className="text-muted-foreground shrink-0"
                    />
                    <div>
                      <p className="text-[9px] text-muted-foreground">
                        Created
                      </p>
                      <p className="text-[11px] font-semibold text-foreground">
                        {createdDate}
                      </p>
                    </div>
                  </div>
                  {updatedDate && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50">
                      <Clock
                        size={13}
                        className="text-muted-foreground shrink-0"
                      />
                      <div>
                        <p className="text-[9px] text-muted-foreground">
                          Updated
                        </p>
                        <p className="text-[11px] font-semibold text-foreground">
                          {updatedDate}
                        </p>
                      </div>
                    </div>
                  )}
                  {item.location && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50">
                      <MapPin
                        size={13}
                        className="text-muted-foreground shrink-0"
                      />
                      <div>
                        <p className="text-[9px] text-muted-foreground">
                          Location
                        </p>
                        <p className="text-[11px] font-semibold text-foreground">
                          {item.location}
                        </p>
                      </div>
                    </div>
                  )}
                  {item.season && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50">
                      <span className="text-sm shrink-0">📅</span>
                      <div>
                        <p className="text-[9px] text-muted-foreground">
                          Season
                        </p>
                        <p className="text-[11px] font-semibold text-foreground">
                          {item.season}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                {onPin && (
                  <button
                    onClick={() => onPin(item.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors min-h-[44px]",
                      item.isPinned
                        ? "bg-amber-500/10 text-amber-600"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground",
                    )}
                  >
                    <Pin
                      size={13}
                      className={item.isPinned ? "fill-current" : ""}
                    />
                    {item.isPinned ? "Unpin" : "Pin"}
                  </button>
                )}
                {onSave && (
                  <button
                    onClick={() => onSave(item.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors min-h-[44px]",
                      item.isSaved
                        ? "bg-violet-500/10 text-violet-600"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground",
                    )}
                  >
                    <Bookmark
                      size={13}
                      className={item.isSaved ? "fill-current" : ""}
                    />
                    {item.isSaved ? "Unsave" : "Save"}
                  </button>
                )}
                <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground transition-colors min-h-[44px]">
                  <Share2 size={13} />
                  Share
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground transition-colors min-h-[44px]">
                  <Edit3 size={13} />
                  Edit
                </button>
                {item.relatedConversationId && (
                  <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors min-h-[44px]">
                    <MessageCircle size={13} />
                    View Chat
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      onDelete(item.id);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors min-h-[44px] ml-auto"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

MemoryDetailModal.displayName = "MemoryDetailModal";
