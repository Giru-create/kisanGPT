"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Achievement } from "../types/profile.types";

interface AchievementsProps {
  achievements: Achievement[];
}

export const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <motion.section
      role="region"
      aria-label="Achievements"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Trophy size={16} className="text-amber-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Achievements
            </h2>
            <p className="text-[10px] text-muted-foreground">
              {unlockedCount}/{achievements.length} unlocked
            </p>
          </div>
        </div>
      </div>

      {/* Achievement cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {achievements.map((achievement, idx) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            className={cn(
              "relative p-4 rounded-xl border transition-all",
              achievement.isUnlocked
                ? "bg-amber-500/5 border-amber-500/20 shadow-xs"
                : "bg-muted/30 border-border/50 opacity-75",
            )}
          >
            {/* Icon */}
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">{achievement.icon}</span>
              {achievement.isUnlocked ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : (
                <Lock size={14} className="text-muted-foreground" />
              )}
            </div>

            {/* Title & description */}
            <h3 className="text-xs font-bold text-foreground mb-0.5">
              {achievement.title}
            </h3>
            <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">
              {achievement.description}
            </p>

            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] text-muted-foreground">
                  Progress
                </span>
                <span className="text-[9px] font-semibold text-foreground">
                  {achievement.progress}/{achievement.maxProgress}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                  }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className={cn(
                    "h-full rounded-full",
                    achievement.isUnlocked ? "bg-emerald-500" : "bg-primary/50",
                  )}
                />
              </div>
            </div>

            {/* Unlocked date */}
            {achievement.unlockedAt && (
              <p className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                Unlocked{" "}
                {new Date(achievement.unlockedAt).toLocaleDateString("en-IN", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

Achievements.displayName = "Achievements";
