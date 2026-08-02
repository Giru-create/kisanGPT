"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Shield, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { MOCK_HERO_BRIEF } from "../constants/schemes.constants";

interface HeroSectionProps {
  onQuickSearch?: (term: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onQuickSearch }) => {
  const brief = MOCK_HERO_BRIEF;

  return (
    <motion.section
      role="region"
      aria-label="Government Schemes Overview"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles size={16} className="text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2 className="ds-heading-sm text-foreground">
              AI Scheme Recommendations
            </h2>
            <p className="ds-caption text-muted-foreground">
              Personalized for your farm profile
            </p>
          </div>
        </div>
        <Badge variant="success" className="text-[10px]">
          <Shield size={10} className="mr-1" />
          Verified
        </Badge>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3 text-center">
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
            {brief.totalEligibleSchemes}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Eligible Schemes
          </p>
        </div>
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-center">
          <p className="text-lg font-bold text-primary">
            {brief.estimatedTotalBenefits}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Est. Total Benefits
          </p>
        </div>
        <div className="rounded-xl bg-violet-500/5 border border-violet-500/20 p-3 text-center">
          <p className="text-lg font-bold text-violet-700 dark:text-violet-300">
            {brief.recentlyAddedCount}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Recently Added
          </p>
        </div>
        <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3 text-center">
          <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
            {brief.upcomingDeadlines}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Upcoming Deadlines
          </p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-none">
        <span className="text-[10px] text-muted-foreground shrink-0">
          Top categories:
        </span>
        {brief.topCategories.map((cat) => (
          <span
            key={cat.label}
            className="shrink-0 text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground"
          >
            {cat.icon} {cat.label} ({cat.count})
          </span>
        ))}
      </div>

      {/* Quick search suggestions */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
        <TrendingUp
          size={14}
          className="text-muted-foreground shrink-0"
          aria-hidden="true"
        />
        <span className="text-[10px] text-muted-foreground shrink-0">
          Popular:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {["PM-KISAN", "PMFBY", "KCC", "Soil Health", "PMKSY"].map((term) => (
            <button
              key={term}
              onClick={() => onQuickSearch?.(term)}
              className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-background border border-border hover:border-primary/30 transition-colors font-medium text-muted-foreground hover:text-foreground"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

HeroSection.displayName = "HeroSection";
