"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Droplets,
  Bug,
  Leaf,
  Cloud,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react";
import type { AIAdvisorChat } from "../types/dashboard.types";

interface TasksTimelineProps {
  chats: AIAdvisorChat[];
}

const ICON_MAP: Record<AIAdvisorChat["iconType"], React.ElementType> = {
  water: Droplets,
  pest: Bug,
  fertilizer: Leaf,
  weather: Cloud,
};

const ICON_COLORS: Record<AIAdvisorChat["iconType"], string> = {
  water: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  pest: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  fertilizer: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  weather: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

const PRIORITY_COLORS: Record<AIAdvisorChat["iconType"], string> = {
  water: "bg-blue-500",
  pest: "bg-rose-500",
  fertilizer: "bg-emerald-500",
  weather: "bg-sky-500",
};

export const TasksTimeline: React.FC<TasksTimelineProps> = ({ chats }) => {
  if (chats.length === 0) return null;

  return (
    <section role="region" aria-label="Today's Tasks">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-primary" />
          <h2 className="text-lg font-semibold text-foreground">Today&apos;s Tasks</h2>
        </div>
        <Link
          href="/advisor"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          View All
          <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {chats.map((chat, index) => {
          const Icon = ICON_MAP[chat.iconType] ?? Droplets;
          const iconColor = ICON_COLORS[chat.iconType] ?? ICON_COLORS.water;
          const dotColor = PRIORITY_COLORS[chat.iconType] ?? PRIORITY_COLORS.water;
          const isLast = index === chats.length - 1;

          return (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href="/advisor"
                className={`group flex items-start gap-4 px-5 py-4 hover:bg-muted/30 transition-colors ${
                  !isLast ? "border-b border-border/40" : ""
                }`}
              >
                {/* Timeline dot */}
                <div className="flex flex-col items-center pt-1 shrink-0">
                  <div className={`w-3 h-3 rounded-full ${dotColor} ring-4 ring-background`} />
                  {!isLast && (
                    <div className="w-px h-full bg-border/40 mt-2 min-h-[24px]" />
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}
                  aria-hidden="true"
                >
                  <Icon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {chat.title}
                    </h4>
                    {index === 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md shrink-0">
                        <Clock size={10} aria-hidden="true" />
                        Now
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {chat.description}
                  </p>
                </div>

                {/* Status */}
                <div className="shrink-0 pt-1">
                  {index < 2 ? (
                    <CheckCircle2
                      size={16}
                      className="text-emerald-500"
                      aria-label="Completed"
                    />
                  ) : (
                    <Circle
                      size={16}
                      className="text-muted-foreground/40"
                      aria-label="Pending"
                    />
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

TasksTimeline.displayName = "TasksTimeline";
