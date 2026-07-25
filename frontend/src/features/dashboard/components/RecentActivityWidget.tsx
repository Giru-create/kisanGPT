"use client";

// ─────────────────────────────────────────────────────────────────────────────
// RecentActivityWidget.tsx
// KisanGPT — Section 9: Recent Activity Log Widget
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Link from "next/link";
import {
  History,
  Camera,
  MessageSquare,
  TrendingUp,
  Landmark,
} from "lucide-react";
import type { ActivityItem, ActivityType } from "../types/dashboard.types";
import { relativeTime } from "@/features/weather/hooks/useWeather";

interface RecentActivityWidgetProps {
  activities: ActivityItem[];
}

const ICON_MAP: Record<ActivityType, React.ElementType> = {
  scan: Camera,
  chat: MessageSquare,
  mandi: TrendingUp,
  scheme: Landmark,
  irrigation: History,
};

export const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({
  activities,
}) => {
  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <section
      role="region"
      aria-label="Recent Activity History"
      className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm flex flex-col gap-3"
    >
      <div className="flex items-center gap-2">
        <History size={18} className="text-primary" aria-hidden="true" />
        <h2 className="font-semibold text-sm sm:text-base text-foreground">
          Recent Activity Log
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        {activities.map((act) => {
          const Icon = ICON_MAP[act.type] ?? History;
          return (
            <Link
              key={act.id}
              href={act.targetHref ?? "#"}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <div
                className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <Icon size={16} />
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-foreground">
                    {act.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {relativeTime(act.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {act.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

RecentActivityWidget.displayName = "RecentActivityWidget";
