"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  Pin,
  Bookmark,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { MOCK_HERO_STATS } from "../constants/memory.constants";

interface HeroSectionProps {
  onSearchFocus?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const stats = MOCK_HERO_STATS;

  return (
    <motion.section
      role="region"
      aria-label="AI Memory Overview"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain size={16} className="text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2 className="ds-heading-sm text-foreground">AI Memory System</h2>
            <p className="ds-caption text-muted-foreground">
              KisanGPT remembers your farm journey
            </p>
          </div>
        </div>
        <Badge variant="success" className="text-[10px]">
          <Sparkles size={10} className="mr-1" />
          AI Active
        </Badge>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-center">
          <p className="text-lg font-bold text-primary">
            {stats.totalMemories}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Total Memories
          </p>
        </div>
        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3 text-center">
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
            {stats.recentUpdates}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Recent Updates
          </p>
        </div>
        <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3 text-center">
          <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
            {stats.pinnedCount}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Pinned</p>
        </div>
        <div className="rounded-xl bg-violet-500/5 border border-violet-500/20 p-3 text-center">
          <p className="text-lg font-bold text-violet-700 dark:text-violet-300">
            {stats.savedCount}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Saved</p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-none">
        <span className="text-[10px] text-muted-foreground shrink-0">
          Categories:
        </span>
        {stats.categoryBreakdown.slice(0, 6).map((cat) => (
          <span
            key={cat.category}
            className="shrink-0 text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground"
          >
            {cat.label} ({cat.count})
          </span>
        ))}
      </div>

      {/* Quick info */}
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <CheckCircle2 size={11} className="text-emerald-500" />
          {stats.verifiedCount} verified
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Pin size={11} className="text-amber-500" />
          {stats.pinnedCount} pinned
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Bookmark size={11} className="text-violet-500" />
          {stats.savedCount} saved
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Clock size={11} />
          Updated 2h ago
        </span>
      </div>
    </motion.section>
  );
};

HeroSection.displayName = "HeroSection";
