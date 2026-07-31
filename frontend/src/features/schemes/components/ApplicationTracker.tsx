"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { APPLICATION_STATUS_CONFIG } from "../constants/schemes.constants";
import type { ApplicationTrackerItem } from "../types/schemes.types";

interface ApplicationTrackerProps {
  applications: ApplicationTrackerItem[];
  onSelectScheme?: (schemeId: string) => void;
}

const ALL_STATUSES = [
  "not_started",
  "documents_pending",
  "applied",
  "under_review",
  "approved",
  "rejected",
  "benefit_received",
] as const;

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  onSelectScheme,
}) => {
  if (applications.length === 0) return null;

  return (
    <motion.section
      role="region"
      aria-label="Application Tracker"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">
          Application Tracker
        </h2>
        <Badge variant="info" className="text-[10px] ml-auto">
          {applications.length} active
        </Badge>
      </div>

      {/* Applications list */}
      <div className="space-y-4">
        {applications.map((app, idx) => {
          const statusCfg = (APPLICATION_STATUS_CONFIG[app.currentStatus] ??
            APPLICATION_STATUS_CONFIG.not_started) as {
            label: string;
            color: string;
            bg: string;
            icon: string;
          };
          const currentStepIndex = ALL_STATUSES.indexOf(app.currentStatus);

          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
              className="rounded-xl border border-border p-3.5"
            >
              {/* App header */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => onSelectScheme?.(app.schemeId)}
                  className="text-xs font-bold text-foreground hover:text-primary transition-colors text-left"
                >
                  {app.schemeName}
                </button>
                <Badge
                  className={cn("text-[9px]", statusCfg.color, statusCfg.bg)}
                >
                  {statusCfg.label}
                </Badge>
              </div>

              {/* Timeline progress */}
              <div className="flex items-center gap-1 mb-3">
                {ALL_STATUSES.map((step, i) => {
                  const isCompleted = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  const stepCfg = (APPLICATION_STATUS_CONFIG[step] ??
                    APPLICATION_STATUS_CONFIG.not_started) as {
                    label: string;
                    color: string;
                    bg: string;
                    icon: string;
                  };

                  return (
                    <React.Fragment key={step}>
                      <div
                        className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-all shrink-0",
                          isCompleted
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-background border-border text-muted-foreground",
                          isCurrent && "ring-2 ring-primary/30",
                        )}
                        title={stepCfg.label}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>
                      {i < ALL_STATUSES.length - 1 && (
                        <div
                          className={cn(
                            "flex-1 h-0.5 rounded-full",
                            i < currentStepIndex ? "bg-primary" : "bg-border",
                          )}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Meta row */}
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>
                  Applied:{" "}
                  {app.appliedDate
                    ? new Date(app.appliedDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Not yet"}
                </span>
                {app.estimatedCompletion && (
                  <span>
                    Est:{" "}
                    {new Date(app.estimatedCompletion).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </span>
                )}
              </div>

              {/* Latest status note */}
              {app.statusHistory.length > 0 && (
                <div className="mt-2 p-2 rounded-lg bg-muted/50 text-[10px] text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Latest update:
                  </span>{" "}
                  {app.statusHistory[app.statusHistory.length - 1]?.note ?? ""}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

ApplicationTracker.displayName = "ApplicationTracker";
