"use client";

// ─────────────────────────────────────────────────────────────────────────────
// EmptyState.tsx
// KisanGPT — Premium AI-first empty state for AI Advisor
// Beautiful welcome experience with suggested prompts
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Sprout,
  Droplets,
  Leaf,
  TrendingUp,
  Building,
  CloudSun,
  Mic,
} from "lucide-react";
import { SUGGESTED_PROMPTS } from "../constants/advisor.constants";

interface EmptyStateProps {
  onQuestionSelect: (question: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  sprout: Sprout,
  droplets: Droplets,
  leaf: Leaf,
  "trending-up": TrendingUp,
  building: Building,
  "cloud-sun": CloudSun,
};

const CATEGORY_COLORS: Record<string, string> = {
  disease:
    "from-rose-500/10 to-rose-500/5 border-rose-500/20 hover:border-rose-500/40",
  irrigation:
    "from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:border-blue-500/40",
  fertilizer:
    "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40",
  market:
    "from-amber-500/10 to-amber-500/5 border-amber-500/20 hover:border-amber-500/40",
  government:
    "from-violet-500/10 to-violet-500/5 border-violet-500/20 hover:border-violet-500/40",
  weather:
    "from-sky-500/10 to-sky-500/5 border-sky-500/20 hover:border-sky-500/40",
};

const ICON_COLORS: Record<string, string> = {
  disease: "text-rose-600 dark:text-rose-400",
  irrigation: "text-blue-600 dark:text-blue-400",
  fertilizer: "text-emerald-600 dark:text-emerald-400",
  market: "text-amber-600 dark:text-amber-400",
  government: "text-violet-600 dark:text-violet-400",
  weather: "text-sky-600 dark:text-sky-400",
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export const EmptyState: React.FC<EmptyStateProps> = ({ onQuestionSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
      {/* Hero Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative mb-8"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg">
          <Brain size={40} className="text-primary" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
          <Sprout size={14} className="text-white" />
        </div>
      </motion.div>

      {/* Welcome Text */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Ask KisanGPT Anything
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-lg leading-relaxed">
          Your AI farming expert is ready. Ask about crops, soil health, market
          prices, weather, or government schemes.
        </p>
      </motion.div>

      {/* Suggested Prompts Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl"
      >
        {SUGGESTED_PROMPTS.map((prompt) => {
          const Icon = ICON_MAP[prompt.icon] ?? Brain;
          const categoryColor =
            CATEGORY_COLORS[prompt.category] ?? CATEGORY_COLORS.disease;
          const iconColor = ICON_COLORS[prompt.category] ?? ICON_COLORS.disease;

          return (
            <motion.button
              key={prompt.id}
              variants={item}
              type="button"
              onClick={() => onQuestionSelect(prompt.text)}
              className={`flex items-start gap-3 p-4 rounded-xl border bg-gradient-to-br transition-all group cursor-pointer ${categoryColor}`}
            >
              <div
                className={`p-2 rounded-lg bg-background/80 shrink-0 ${iconColor}`}
              >
                <Icon size={18} />
              </div>
              <p className="text-sm font-medium text-foreground text-left leading-snug">
                {prompt.text}
              </p>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Voice Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex items-center gap-2 text-muted-foreground"
      >
        <Mic size={14} />
        <span className="text-xs">
          Or tap the microphone to ask with your voice
        </span>
      </motion.div>
    </div>
  );
};

EmptyState.displayName = "EmptyState";
