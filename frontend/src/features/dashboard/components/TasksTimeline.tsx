"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Droplets, Bug, Leaf, Cloud, Clock } from "lucide-react";
import { Card, Chip, StatusIndicator } from "@/components/ui";
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
      <div className="ds-section-header">
        <div className="ds-section-header-bar" />
        <h2>Today&apos;s Tasks</h2>
      </div>

      <Card padding="none" className="overflow-hidden">
        {chats.map((chat, index) => {
          const Icon = ICON_MAP[chat.iconType] ?? Droplets;
          const iconColor = ICON_COLORS[chat.iconType] ?? ICON_COLORS.water;
          const dotColor =
            PRIORITY_COLORS[chat.iconType] ?? PRIORITY_COLORS.water;
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
                className={`group flex items-start gap-3 sm:gap-4 px-3 sm:px-5 py-4 hover:bg-muted/30 transition-colors ${
                  !isLast ? "border-b border-border/40" : ""
                }`}
              >
                {/* Timeline dot */}
                <div className="flex flex-col items-center pt-1 shrink-0">
                  <div
                    className={`w-3 h-3 rounded-full ${dotColor} ring-4 ring-background`}
                  />
                  {!isLast && (
                    <div className="w-px h-full bg-border/40 mt-2 min-h-[24px]" />
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`ds-icon-container-md ${iconColor}`}
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
                      <Chip variant="default" size="sm">
                        <Clock size={10} aria-hidden="true" />
                        Now
                      </Chip>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {chat.description}
                  </p>
                </div>

                {/* Status */}
                <div className="shrink-0 pt-1">
                  {index < 2 ? (
                    <StatusIndicator status="success" size="md" />
                  ) : (
                    <StatusIndicator status="neutral" size="md" />
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </Card>
    </section>
  );
};

TasksTimeline.displayName = "TasksTimeline";
