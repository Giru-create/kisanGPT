"use client";

// ─────────────────────────────────────────────────────────────────────────────
// NotificationsWidget.tsx
// KisanGPT — Section 10: Notifications & Reminders Widget
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  Bell,
  Check,
  Info,
  AlertTriangle,
  RefreshCcw,
  CheckCheck,
} from "lucide-react";
import type { DashboardNotification } from "../types/dashboard.types";
import { relativeTime } from "@/features/weather/hooks/useWeather";

interface NotificationsWidgetProps {
  notifications: DashboardNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead?: () => void;
}

export const NotificationsWidget: React.FC<NotificationsWidgetProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
}) => {
  if (!notifications || notifications.length === 0) {
    return (
      <section
        role="region"
        aria-label="Notifications"
        className="rounded-2xl border border-border bg-card p-6 text-center flex flex-col items-center gap-3 shadow-sm"
      >
        <div className="rounded-2xl bg-muted/60 p-3 text-muted-foreground shrink-0">
          <Bell size={24} aria-hidden="true" />
        </div>
        <h2 className="text-sm font-extrabold text-foreground">
          All Caught Up!
        </h2>
        <p className="text-xs text-muted-foreground">
          No new alerts or farming reminders at this time.
        </p>
      </section>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <section
      role="region"
      aria-label="Notifications and Reminders"
      className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell
            size={20}
            className="text-secondary shrink-0"
            aria-hidden="true"
          />
          <h2 className="font-extrabold text-sm sm:text-base text-foreground">
            Notifications &amp; Alerts
          </h2>
          {unreadCount > 0 && (
            <span className="text-[11px] font-extrabold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full ml-1">
              {unreadCount} Unread
            </span>
          )}
        </div>

        {unreadCount > 0 && onMarkAllRead && (
          <button
            type="button"
            onClick={onMarkAllRead}
            aria-label="Mark all notifications as read"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl px-2.5 py-2 min-h-[48px]"
          >
            <CheckCheck size={16} aria-hidden="true" />
            Mark All Read
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2.5" role="list">
        {notifications.map((n) => (
          <div
            key={n.id}
            role="listitem"
            className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-colors ${
              n.read
                ? "border-border/50 bg-muted/20 opacity-80"
                : "border-primary/30 bg-primary/5 font-medium"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0" aria-hidden="true">
                {n.category === "alert" ? (
                  <AlertTriangle size={18} className="text-amber-500" />
                ) : n.category === "reminder" ? (
                  <RefreshCcw size={18} className="text-blue-500" />
                ) : (
                  <Info size={18} className="text-emerald-500" />
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-foreground">
                    {n.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {relativeTime(n.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {n.message}
                </p>
              </div>
            </div>

            {!n.read && (
              <button
                type="button"
                onClick={() => onMarkRead(n.id)}
                aria-label={`Mark notification "${n.title}" as read`}
                className="flex items-center justify-center p-2 text-muted-foreground hover:text-foreground hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl shrink-0 min-h-[48px] min-w-[48px] transition-colors"
              >
                <Check size={18} aria-hidden="true" />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

NotificationsWidget.displayName = "NotificationsWidget";
