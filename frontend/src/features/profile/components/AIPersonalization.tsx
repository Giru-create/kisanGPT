"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  MessageCircle,
  Bookmark,
  Mic,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import type { AIPersonalizationData } from "../types/profile.types";

interface AIPersonalizationProps {
  data: AIPersonalizationData;
}

export const AIPersonalization: React.FC<AIPersonalizationProps> = ({
  data,
}) => {
  const stats = [
    {
      icon: <Brain size={16} className="text-primary" />,
      label: "AI Knowledge Score",
      value: `${data.knowledgeScore}/100`,
      color: "text-primary",
      bg: "bg-primary/5",
      border: "border-primary/20",
    },
    {
      icon: <Sparkles size={16} className="text-amber-600" />,
      label: "Memories Stored",
      value: data.memoryCount.toString(),
      color: "text-amber-700 dark:text-amber-300",
      bg: "bg-amber-500/5",
      border: "border-amber-500/20",
    },
    {
      icon: <TrendingUp size={16} className="text-emerald-600" />,
      label: "Recommendations",
      value: data.recommendationsGenerated.toString(),
      color: "text-emerald-700 dark:text-emerald-300",
      bg: "bg-emerald-500/5",
      border: "border-emerald-500/20",
    },
    {
      icon: <MessageCircle size={16} className="text-blue-600" />,
      label: "Total Conversations",
      value: data.totalConversations.toString(),
      color: "text-blue-700 dark:text-blue-300",
      bg: "bg-blue-500/5",
      border: "border-blue-500/20",
    },
    {
      icon: <Bookmark size={16} className="text-violet-600" />,
      label: "Saved Reports",
      value: data.savedReports.toString(),
      color: "text-violet-700 dark:text-violet-300",
      bg: "bg-violet-500/5",
      border: "border-violet-500/20",
    },
    {
      icon: <Mic size={16} className="text-pink-600" />,
      label: "Voice Hours",
      value: data.voiceUsageHours.toFixed(1),
      color: "text-pink-700 dark:text-pink-300",
      bg: "bg-pink-500/5",
      border: "border-pink-500/20",
    },
  ];

  return (
    <motion.section
      role="region"
      aria-label="AI Personalization"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Brain size={16} className="text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            AI Personalization
          </h2>
          <p className="text-[10px] text-muted-foreground">
            How KisanGPT learns from you
          </p>
        </div>
      </div>

      {/* Progress bars */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-foreground">
              Profile Completeness
            </span>
            <span className="text-[11px] font-bold text-primary">
              {data.profileCompleteness}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.profileCompleteness}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-foreground">
              AI Learning Progress
            </span>
            <span className="text-[11px] font-bold text-emerald-600">
              {data.learningProgress}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.learningProgress}%` }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl ${stat.bg} border ${stat.border} p-3 text-center`}
          >
            <div className="flex justify-center mb-1.5">{stat.icon}</div>
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Top topics */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Most Discussed Topics
        </p>
        <div className="space-y-1.5">
          {data.topTopics.map((topic) => (
            <div key={topic.topic} className="flex items-center gap-2.5">
              <span className="text-[11px] font-medium text-foreground w-20">
                {topic.topic}
              </span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary/60 rounded-full"
                  style={{
                    width: `${(topic.count / data.topTopics[0]!.count) * 100}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground w-6 text-right">
                {topic.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly activity mini chart */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Monthly Conversations
        </p>
        <div className="flex items-end gap-1.5 h-16">
          {data.monthlyActivity.map((m) => {
            const maxVal = Math.max(
              ...data.monthlyActivity.map((x) => x.conversations),
            );
            const height = (m.conversations / maxVal) * 100;
            return (
              <div
                key={m.month}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <span className="text-[8px] text-muted-foreground">
                  {m.conversations}
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-full bg-primary/40 rounded-t-sm min-h-[2px]"
                />
                <span className="text-[8px] text-muted-foreground">
                  {m.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

AIPersonalization.displayName = "AIPersonalization";
