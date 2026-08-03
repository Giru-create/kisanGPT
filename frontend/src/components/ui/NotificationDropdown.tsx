"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  category: "reminder" | "alert" | "update";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    category: "alert",
    title: "Frost Warning",
    message: "Frost expected Saturday night. Protect sensitive crops.",
    timestamp: new Date(0),
    read: false,
  },
  {
    id: "n2",
    category: "reminder",
    title: "Irrigation Reminder",
    message: "Block A needs irrigation within 2 days.",
    timestamp: new Date(0),
    read: false,
  },
  {
    id: "n3",
    category: "update",
    title: "Market Price Update",
    message: "Wheat price increased by 2.01% today.",
    timestamp: new Date(0),
    read: true,
  },
  {
    id: "n4",
    category: "alert",
    title: "Pest Detection",
    message: "Aphid activity found on Mustard in Block B.",
    timestamp: new Date(0),
    read: true,
  },
  {
    id: "n5",
    category: "reminder",
    title: "Scheme Deadline",
    message: "PM-KISAN application deadline in 3 days.",
    timestamp: new Date(0),
    read: true,
  },
];

const CATEGORY_STYLES: Record<Notification["category"], string> = {
  alert: "bg-red-500/10 text-red-600 dark:text-red-400",
  reminder: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  update: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

function formatTimeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const offsets = [30, 120, 240, 360, 1440];
    setNotifications((prev) =>
      prev.map((n, i) => ({
        ...n,
        timestamp: new Date(Date.now() - (offsets[i] ?? 0) * 60 * 1000),
      })),
    );
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const close = useCallback(() => {
    setIsOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, close]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute top-2 right-2 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold px-1 ring-2 ring-background"
          >
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="menu"
            aria-label="Notifications"
            className="absolute right-0 top-full mt-2 w-80 max-h-[420px] rounded-2xl bg-card border border-border shadow-xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="overflow-y-auto max-h-[340px]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4">
                  <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <Bell size={20} className="text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    All caught up
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    No new notifications
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      role="menuitem"
                      tabIndex={0}
                      className={cn(
                        "group flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors",
                        !notif.read && "bg-primary/5",
                      )}
                      onClick={() => markAsRead(notif.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          markAsRead(notif.id);
                        }
                      }}
                    >
                      <div
                        className={cn(
                          "mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                          CATEGORY_STYLES[notif.category],
                        )}
                      >
                        <span className="text-xs font-bold uppercase">
                          {notif.category[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={cn(
                              "text-sm truncate",
                              notif.read
                                ? "text-muted-foreground"
                                : "font-semibold text-foreground",
                            )}
                          >
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span
                              aria-label="Unread"
                              className="h-2 w-2 rounded-full bg-primary shrink-0"
                            />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                          {formatTimeAgo(notif.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        {!notif.read && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notif.id);
                            }}
                            aria-label="Mark as read"
                            className="p-1 rounded-md hover:bg-muted transition-colors"
                          >
                            <Check
                              size={14}
                              className="text-muted-foreground"
                            />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismiss(notif.id);
                          }}
                          aria-label="Dismiss notification"
                          className="p-1 rounded-md hover:bg-muted transition-colors"
                        >
                          <Trash2
                            size={14}
                            className="text-muted-foreground hover:text-destructive"
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

NotificationDropdown.displayName = "NotificationDropdown";
