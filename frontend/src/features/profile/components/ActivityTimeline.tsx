"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACTIVITY_TYPE_CONFIG } from "../constants/profile.constants";
import type { ActivityItem } from "../types/profile.types";

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
}) => {
  return (
    <motion.section
      role="region"
      aria-label="Recent Activity"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
          <Activity size={16} className="text-violet-600" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Recent Activity
          </h2>
          <p className="text-[10px] text-muted-foreground">
            Your KisanGPT journey
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {activities.map((activity, idx) => {
          const typeCfg = ACTIVITY_TYPE_CONFIG[activity.type];
          const time = new Date(activity.timestamp).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.03 }}
              className="flex gap-3 relative"
            >
              {/* Vertical line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-sm",
                    typeCfg?.bg ?? "bg-muted",
                  )}
                >
                  {typeCfg?.icon ?? "📋"}
                </div>
                {idx < activities.length - 1 && (
                  <div className="w-px flex-1 bg-border/50 my-1" />
                )}
              </div>

              {/* Content */}
              <div className="pb-4 pt-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {activity.title}
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                  {activity.description}
                </p>
                <p className="text-[9px] text-muted-foreground mt-1">{time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

ActivityTimeline.displayName = "ActivityTimeline";
