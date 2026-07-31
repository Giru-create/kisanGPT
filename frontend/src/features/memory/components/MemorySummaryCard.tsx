"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Wheat,
  Globe,
  Sprout,
  MessageCircle,
  Brain,
  Clock,
} from "lucide-react";

interface MemorySummaryCardProps {
  className?: string;
}

export const MemorySummaryCard: React.FC<MemorySummaryCardProps> = () => {
  return (
    <motion.section
      role="region"
      aria-label="AI Memory Summary"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
    >
      {/* Accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-emerald-400 to-violet-400" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain size={16} className="text-primary" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              AI Memory Summary
            </h3>
            <p className="text-[10px] text-muted-foreground">
              What KisanGPT knows about your farm
            </p>
          </div>
        </div>

        {/* Profile grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50">
            <MapPin
              size={14}
              className="text-muted-foreground shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                Location
              </p>
              <p className="text-[11px] font-semibold text-foreground">
                Karnal, Haryana
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50">
            <Wheat
              size={14}
              className="text-muted-foreground shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                Current Crops
              </p>
              <p className="text-[11px] font-semibold text-foreground">
                Wheat (PBW 550), Paddy (PR 121)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50">
            <Globe
              size={14}
              className="text-muted-foreground shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                Preferred Language
              </p>
              <p className="text-[11px] font-semibold text-foreground">
                Hindi / English
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50">
            <Sprout
              size={14}
              className="text-muted-foreground shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                Farming Practice
              </p>
              <p className="text-[11px] font-semibold text-foreground">
                Conventional + Drip Irrigation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50">
            <MessageCircle
              size={14}
              className="text-muted-foreground shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                Typical Questions
              </p>
              <p className="text-[11px] font-semibold text-foreground">
                Irrigation timing, Disease ID, Market prices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50">
            <Brain
              size={14}
              className="text-muted-foreground shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                AI Insights
              </p>
              <p className="text-[11px] font-semibold text-foreground">
                6 active insights
              </p>
            </div>
          </div>
        </div>

        {/* AI Insights preview */}
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 mb-3">
          <p className="text-[10px] font-semibold text-primary mb-1.5 uppercase tracking-wider">
            Key Insight
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your wheat and paddy yields consistently exceed Haryana state
            averages. KisanGPT recommends maintaining your current fertilizer
            schedule while addressing the low Organic Carbon levels in your
            soil.
          </p>
        </div>

        {/* Last updated */}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock size={11} aria-hidden="true" />
          <span>Last updated: 2 hours ago</span>
        </div>
      </div>
    </motion.section>
  );
};

MemorySummaryCard.displayName = "MemorySummaryCard";
