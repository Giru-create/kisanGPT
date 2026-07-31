"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  FileText,
  Clock,
  Bookmark,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { SCHEME_CATEGORY_CONFIG } from "../constants/schemes.constants";
import type { Scheme } from "../types/schemes.types";

interface SchemeCardProps {
  scheme: Scheme;
  index?: number;
  onSelect: (scheme: Scheme) => void;
  onSave?: (scheme: Scheme) => void;
  onShare?: (scheme: Scheme) => void;
  isSaved?: boolean;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  index = 0,
  onSelect,
  onSave,
  onShare,
  isSaved = false,
}) => {
  const categoryCfg = SCHEME_CATEGORY_CONFIG[scheme.category];

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
      className="flex flex-col justify-between gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all text-left group"
    >
      {/* Top section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              {categoryCfg && (
                <Badge
                  className={cn(
                    "text-[9px] px-2 py-0",
                    categoryCfg.color,
                    categoryCfg.bg,
                  )}
                >
                  {categoryCfg.label}
                </Badge>
              )}
              {scheme.statusBadge && (
                <Badge
                  variant={
                    scheme.statusBadge === "Eligible"
                      ? "success"
                      : scheme.statusBadge === "Action Needed"
                        ? "warning"
                        : scheme.statusBadge === "Approved"
                          ? "success"
                          : scheme.statusBadge === "Closed"
                            ? "error"
                            : "info"
                  }
                  className="text-[9px] px-2 py-0"
                >
                  {scheme.statusBadge}
                </Badge>
              )}
            </div>
            <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {scheme.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {onSave && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(scheme);
                }}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                aria-label={isSaved ? "Unsave scheme" : "Save scheme"}
              >
                <Bookmark
                  size={14}
                  className={cn(
                    isSaved
                      ? "text-primary fill-primary"
                      : "text-muted-foreground",
                  )}
                />
              </button>
            )}
            {onShare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(scheme);
                }}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                aria-label="Share scheme"
              >
                <Share2 size={14} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {scheme.summary}
        </p>
      </div>

      {/* Benefit amount */}
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
        <CheckCircle2
          size={14}
          className="text-primary shrink-0"
          aria-hidden="true"
        />
        <span className="text-xs font-bold text-primary">
          {scheme.benefitAmount}
        </span>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-2.5 border-t border-border/40 text-xs">
        <div className="flex items-center gap-3 text-muted-foreground">
          {scheme.requiredDocuments.length > 0 && (
            <span className="flex items-center gap-1">
              <FileText size={12} aria-hidden="true" />
              {scheme.requiredDocuments.length} docs
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={12} aria-hidden="true" />
            2-4 weeks
          </span>
        </div>
        <div className="flex items-center gap-2">
          {scheme.deadline && (
            <span className="text-[11px] text-amber-600 flex items-center gap-1 font-medium">
              <Calendar size={12} aria-hidden="true" />
              {scheme.deadline}
            </span>
          )}
          <button
            onClick={() => onSelect(scheme)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label={`View ${scheme.title} details`}
          >
            <ArrowUpRight size={14} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

SchemeCard.displayName = "SchemeCard";
