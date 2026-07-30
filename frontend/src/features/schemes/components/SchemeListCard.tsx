"use client";

// ─────────────────────────────────────────────────────────────────────────────
// SchemeListCard.tsx
// KisanGPT — Government Scheme card component
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Calendar, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Scheme } from "../types/schemes.types";

interface SchemeListCardProps {
  scheme: Scheme;
  onSelect: (scheme: Scheme) => void;
}

export const SchemeListCard: React.FC<SchemeListCardProps> = ({
  scheme,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(scheme)}
      className="flex flex-col justify-between gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[48px]"
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <span className="font-extrabold text-sm text-foreground line-clamp-1">
            {scheme.title}
          </span>
          <Badge
            variant={scheme.statusBadge === "Eligible" ? "success" : "warning"}
            className="text-[11px] font-bold shrink-0 px-2.5 py-0.5"
          >
            {scheme.statusBadge}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {scheme.summary}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-border/40 text-xs font-semibold">
        <span className="text-primary flex items-center gap-1">
          <CheckCircle2 size={14} className="shrink-0" aria-hidden="true" />{" "}
          {scheme.benefitAmount}
        </span>
        <div className="flex items-center gap-2">
          {scheme.deadline && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Calendar size={13} className="shrink-0" aria-hidden="true" />{" "}
              {scheme.deadline}
            </span>
          )}
          <ArrowUpRight
            size={14}
            className="text-muted-foreground shrink-0"
            aria-hidden="true"
          />
        </div>
      </div>
    </button>
  );
};

SchemeListCard.displayName = "SchemeListCard";
