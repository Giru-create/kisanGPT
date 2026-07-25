"use client";

// ─────────────────────────────────────────────────────────────────────────────
// NotificationsWidget.tsx
// KisanGPT — Section 10: Notifications & Reminders Widget
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Bell, Check, Info, AlertTriangle, RefreshCcw } from "lucide-react";
import type { DashboardNotification } from "../types/dashboard.types";
import { relativeTime } from "@/features/weather/hooks/useWeather";

interface NotificationsWidgetProps {
  notifications: DashboardNotification[];
  onMarkRead: (id: string) => void;
}

export const NotificationsWidget: React.FC<NotificationsWidgetProps> = ({
  notifications,
  onMarkRead,
}) => {
  if (!notifications || notifications.length === 0) {
    return (
      <section
        role="region"
        aria-label="Notifications"
        className="rounded-2xl border border-border bg-card p-4 text-center text-xs text-muted-foreground shadow-sm"
      >
        All caught up! No unread notifications.
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
          <Bell size={18} className="text-secondary" aria-hidden="true" />
          <h2 className="font-semibold text-sm sm:text-base text-foreground">
            Notifications & Alerts
          </h2>
        </div>
        {unreadCount > 0 && (
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {unreadCount} Unread
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition-colors ${
              n.read
                ? "border-border/50 bg-muted/20 opacity-75"
                : "border-primary/30 bg-primary/5 font-medium"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0" aria-hidden="true">
                {n.category === "alert" ? (
                  <AlertTriangle size={16} className="text-amber-500" />
                ) : n.category === "reminder" ? (
                  <RefreshCcw size={16} className="text-blue-500" />
                ) : (
                  <Info size={16} className="text-emerald-500" />
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-foreground">
                    {n.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {relativeTime(n.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-snug">
                  {n.message}
                </p>
              </div>
            </div>

            {!n.read && (
              <button
                onClick={() => onMarkRead(n.id)}
                aria-label={`Mark notification ${n.title} as read`}
                className="p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg shrink-0 min-h-[36px]"
              >
                <Check size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

NotificationsWidget.displayName = "NotificationsWidget";
