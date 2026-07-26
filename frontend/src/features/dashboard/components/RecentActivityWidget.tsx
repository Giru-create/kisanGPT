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
    return (
      <section
        role="region"
        aria-label="Recent Activity History"
        className="rounded-2xl border border-border bg-card p-5 text-center flex flex-col items-center gap-2.5 shadow-sm"
      >
        <div className="rounded-2xl bg-muted/60 p-3 text-muted-foreground shrink-0">
          <History size={24} aria-hidden="true" />
        </div>
        <h2 className="text-sm font-extrabold text-foreground">
          No Recent Activity
        </h2>
        <p className="text-xs text-muted-foreground max-w-xs">
          Your diagnostic scans, chat conversations, and market price checks
          will appear here.
        </p>
      </section>
    );
  }

  return (
    <section
      role="region"
      aria-label="Recent Activity History"
      className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm flex flex-col gap-3"
    >
      <div className="flex items-center gap-2">
        <History
          size={20}
          className="text-primary shrink-0"
          aria-hidden="true"
        />
        <h2 className="font-extrabold text-sm sm:text-base text-foreground">
          Recent Activity Log
        </h2>
      </div>

      <div className="flex flex-col gap-2" role="list">
        {activities.map((act) => {
          const Icon = ICON_MAP[act.type] ?? History;
          return (
            <Link
              key={act.id}
              href={act.targetHref ?? "#"}
              role="listitem"
              aria-label={`${act.title}: ${act.description}, ${relativeTime(act.timestamp)}`}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[52px]"
            >
              <div
                className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <Icon size={18} />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs sm:text-sm text-foreground truncate">
                    {act.title}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium shrink-0">
                    {relativeTime(act.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
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
