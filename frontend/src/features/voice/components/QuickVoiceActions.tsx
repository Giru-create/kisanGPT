"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { QUICK_VOICE_ACTIONS } from "../constants/voice.constants";

interface QuickVoiceActionsProps {
  onSelectAction?: (prompt: string) => void;
}

export const QuickVoiceActions: React.FC<QuickVoiceActionsProps> = ({
  onSelectAction,
}) => {
  return (
    <motion.section
      role="region"
      aria-label="Quick Voice Actions"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Zap size={16} className="text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">Quick Actions</h2>
      </div>

      {/* Action grid */}
      <div className="grid grid-cols-3 gap-2">
        {QUICK_VOICE_ACTIONS.map((action, i) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: i * 0.03 }}
            onClick={() => onSelectAction?.(action.prompt)}
            className="flex flex-col items-center text-center p-3 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all bg-background"
            aria-label={action.label}
          >
            <span className="text-xl mb-1.5">{action.icon}</span>
            <p className="text-[10px] font-bold text-foreground">
              {action.label}
            </p>
            <p className="text-[8px] text-muted-foreground mt-0.5 leading-tight hidden sm:block">
              {action.description}
            </p>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
};

QuickVoiceActions.displayName = "QuickVoiceActions";
