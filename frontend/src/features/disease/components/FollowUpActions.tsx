"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Save,
  Share2,
  Download,
  Bell,
  BarChart3,
  Camera,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowUpActionsProps {
  onAskAI?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onSchedule?: () => void;
  onMonitor?: () => void;
  onScanAnother?: () => void;
}

const ACTIONS = [
  {
    id: "ask-ai",
    label: "Ask AI",
    description: "Get more details about treatment",
    icon: MessageCircle,
    variant: "primary" as const,
  },
  {
    id: "save",
    label: "Save",
    description: "Save this diagnosis",
    icon: Save,
    variant: "secondary" as const,
  },
  {
    id: "share",
    label: "Share",
    description: "Share with family or advisor",
    icon: Share2,
    variant: "secondary" as const,
  },
  {
    id: "download",
    label: "Download",
    description: "Save report as PDF",
    icon: Download,
    variant: "ghost" as const,
  },
  {
    id: "schedule",
    label: "Reminder",
    description: "Set treatment reminder",
    icon: Bell,
    variant: "ghost" as const,
  },
  {
    id: "monitor",
    label: "Monitor",
    description: "Track recovery progress",
    icon: BarChart3,
    variant: "ghost" as const,
  },
];

const VARIANT_STYLES: Record<string, string> = {
  primary: "border-primary/30 bg-primary/5 hover:bg-primary/10",
  secondary: "border-border bg-background hover:bg-muted",
  ghost: "border-transparent bg-background hover:bg-muted",
};

export const FollowUpActions: React.FC<FollowUpActionsProps> = ({
  onAskAI,
  onSave,
  onShare,
  onDownload,
  onSchedule,
  onMonitor,
  onScanAnother,
}) => {
  const handlers: Record<string, (() => void) | undefined> = {
    "ask-ai": onAskAI,
    save: onSave,
    share: onShare,
    download: onDownload,
    schedule: onSchedule,
    monitor: onMonitor,
  };

  return (
    <motion.section
      role="region"
      aria-label="Follow-up actions"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <ExternalLink size={16} className="text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">
          What&apos;s Next
        </h2>
      </div>

      {/* Action grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              onClick={() => handlers[action.id]?.()}
              className={cn(
                "flex flex-col items-center text-center p-3 rounded-xl border transition-all hover:shadow-sm",
                VARIANT_STYLES[action.variant],
              )}
              aria-label={action.label}
            >
              <Icon
                size={18}
                className={cn(
                  "mb-1.5",
                  action.variant === "primary"
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              />
              <p className="text-[10px] font-semibold text-foreground">
                {action.label}
              </p>
              <p className="text-[8px] text-muted-foreground mt-0.5 leading-tight hidden sm:block">
                {action.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Scan another */}
      {onScanAnother && (
        <button
          onClick={onScanAnother}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
        >
          <Camera size={14} />
          Scan Another Plant
        </button>
      )}
    </motion.section>
  );
};

FollowUpActions.displayName = "FollowUpActions";
