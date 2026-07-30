"use client";

import React from "react";
import { Droplets, Bug, Leaf, Cloud } from "lucide-react";
import type { AIAdvisorChat } from "../types/dashboard.types";

interface RecentAIChatsCardProps {
  chats: AIAdvisorChat[];
}

const ICON_MAP: Record<AIAdvisorChat["iconType"], React.ElementType> = {
  water: Droplets,
  pest: Bug,
  fertilizer: Leaf,
  weather: Cloud,
};

const ICON_BG_MAP: Record<AIAdvisorChat["iconType"], string> = {
  water: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  pest: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  fertilizer: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  weather: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
};

export const RecentAIChatsCard: React.FC<RecentAIChatsCardProps> = ({
  chats,
}) => {
  return (
    <section
      role="region"
      aria-label="Recent AI Advisor Chats"
      className="bg-card border border-border rounded-xl shadow-sm divide-y divide-border"
    >
      <div className="px-5 pt-5 pb-3">
        <h2 className="font-semibold text-base text-foreground">
          Recent AI Advisor Chats
        </h2>
      </div>

      {chats.map((chat) => {
        const Icon = ICON_MAP[chat.iconType] ?? Droplets;
        const iconBg = ICON_BG_MAP[chat.iconType] ?? ICON_BG_MAP.water;

        return (
          <div
            key={chat.id}
            className="px-5 py-4 flex items-start gap-3 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div
              className={`p-2.5 rounded-full shrink-0 ${iconBg}`}
              aria-hidden="true"
            >
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-bold text-foreground">{chat.title}</h5>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {chat.description}
              </p>
              <span className="text-[10px] text-muted-foreground font-medium uppercase mt-2 block">
                {chat.timestamp}
              </span>
            </div>
          </div>
        );
      })}

      {/* Skeleton placeholder */}
      <div className="px-5 py-4 flex items-start gap-3 opacity-60">
        <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 bg-muted rounded animate-pulse" />
          <div className="h-2 w-3/4 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </section>
  );
};

RecentAIChatsCard.displayName = "RecentAIChatsCard";
