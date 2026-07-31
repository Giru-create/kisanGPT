"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Cloud, Lightbulb, MessageCircle } from "lucide-react";
import { MOCK_AI_CONTEXT } from "../constants/voice.constants";

interface AIContextPanelProps {
  isOpen?: boolean;
}

export const AIContextPanel: React.FC<AIContextPanelProps> = () => {
  const ctx = MOCK_AI_CONTEXT;

  return (
    <motion.section
      role="region"
      aria-label="AI Context"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
          <MessageCircle size={12} className="text-primary" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">AI Context</h2>
      </div>

      {/* Context items */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50">
          <span className="text-sm">🌾</span>
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
              Current Crop
            </p>
            <p className="text-[11px] font-semibold text-foreground">
              {ctx.currentCrop}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50">
          <MapPin size={14} className="text-muted-foreground shrink-0" />
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
              Location
            </p>
            <p className="text-[11px] font-semibold text-foreground">
              {ctx.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50">
          <Cloud size={14} className="text-muted-foreground shrink-0" />
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
              Weather
            </p>
            <p className="text-[11px] font-semibold text-foreground">
              {ctx.weatherSummary}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50">
          <Lightbulb size={14} className="text-muted-foreground shrink-0" />
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
              Recent Recommendation
            </p>
            <p className="text-[11px] font-semibold text-foreground">
              {ctx.recentRecommendation}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

AIContextPanel.displayName = "AIContextPanel";
