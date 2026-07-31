"use client";

import React from "react";
import Link from "next/link";
import { Droplets, Bug, Leaf, Cloud, ArrowUpRight } from "lucide-react";
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
  water: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  pest: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  fertilizer: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  weather: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

export const RecentAIChatsCard: React.FC<RecentAIChatsCardProps> = ({
  chats,
}) => {
  return (
    <section
      role="region"
      aria-label="Recent AI Advisor Chats"
      className="rounded-2xl border border-border bg-card shadow-sm"
    >
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Recent AI Chats
        </h2>
        <Link
          href="/advisor"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          View All
          <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>

      <div className="px-3 pb-3">
        {chats.map((chat, index) => {
          const Icon = ICON_MAP[chat.iconType] ?? Droplets;
          const iconBg = ICON_BG_MAP[chat.iconType] ?? ICON_BG_MAP.water;

          return (
            <Link
              key={chat.id}
              href="/advisor"
              className={`flex items-start gap-3.5 px-3 py-3.5 hover:bg-muted/40 rounded-xl transition-colors ${
                index < chats.length - 1 ? "border-b border-border/40" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
                aria-hidden="true"
              >
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-semibold text-foreground leading-snug">
                  {chat.title}
                </h5>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {chat.description}
                </p>
                <span className="text-[10px] text-muted-foreground/70 font-medium mt-1.5 block">
                  {chat.timestamp}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

RecentAIChatsCard.displayName = "RecentAIChatsCard";
