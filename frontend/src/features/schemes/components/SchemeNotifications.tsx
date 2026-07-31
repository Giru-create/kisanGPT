"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Clock,
  FileCheck,
  CheckCircle2,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { NOTIFICATION_TYPE_CONFIG } from "../constants/schemes.constants";
import type { SchemeNotification } from "../types/schemes.types";

interface SchemeNotificationsProps {
  notifications: SchemeNotification[];
  onDismiss?: (id: string) => void;
  onMarkRead?: (id: string) => void;
}

const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  deadline: <Clock size={14} className="text-amber-600" />,
  document_reminder: <FileCheck size={14} className="text-blue-600" />,
  approval_update: <CheckCircle2 size={14} className="text-emerald-600" />,
  new_scheme: <Star size={14} className="text-violet-600" />,
  policy_update: <TrendingUp size={14} className="text-slate-600" />,
};

export const SchemeNotifications: React.FC<SchemeNotificationsProps> = ({
  notifications,
  onDismiss,
  onMarkRead,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (notifications.length === 0) return null;

  return (
    <motion.section
      role="region"
      aria-label="Scheme Notifications"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Bell size={16} className="text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
        {unreadCount > 0 && (
          <Badge variant="error" className="text-[10px] ml-auto">
            {unreadCount} new
          </Badge>
        )}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {notifications.map((notif, idx) => {
          const typeCfg = (NOTIFICATION_TYPE_CONFIG[notif.type] ??
            NOTIFICATION_TYPE_CONFIG.policy_update) as {
            label: string;
            color: string;
            bg: string;
            icon: string;
          };
          const Icon = NOTIFICATION_ICONS[notif.type];

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border transition-colors",
                notif.isRead
                  ? "border-border/50 bg-background"
                  : "border-primary/20 bg-primary/5",
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                  typeCfg.bg,
                )}
              >
                {Icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {notif.title}
                  </p>
                  {!notif.isRead && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                  {notif.message}
                </p>
                <p className="text-[9px] text-muted-foreground mt-1">
                  {new Date(notif.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                  {notif.schemeName && (
                    <span className="ml-1.5 text-primary font-medium">
                      {notif.schemeName}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!notif.isRead && onMarkRead && (
                  <button
                    onClick={() => onMarkRead(notif.id)}
                    className="p-1 rounded hover:bg-muted transition-colors"
                    aria-label="Mark as read"
                  >
                    <CheckCircle2 size={12} className="text-muted-foreground" />
                  </button>
                )}
                {onDismiss && (
                  <button
                    onClick={() => onDismiss(notif.id)}
                    className="p-1 rounded hover:bg-muted transition-colors"
                    aria-label="Dismiss notification"
                  >
                    <X size={12} className="text-muted-foreground" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

SchemeNotifications.displayName = "SchemeNotifications";
