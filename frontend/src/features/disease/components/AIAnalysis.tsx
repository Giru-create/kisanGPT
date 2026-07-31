"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SCANNING_STEPS } from "../constants/disease.constants";

interface AIAnalysisProps {
  previewUrl?: string;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ previewUrl }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    let currentDelay = 0;

    SCANNING_STEPS.forEach((step, i) => {
      // Start step
      timers.push(
        setTimeout(() => {
          setActiveStep(i);
        }, currentDelay),
      );
      // Complete step
      timers.push(
        setTimeout(() => {
          setCompletedSteps((prev) => [...prev, i]);
        }, currentDelay + step.duration),
      );
      currentDelay += step.duration;
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  const totalDuration = SCANNING_STEPS.reduce((a, s) => a + s.duration, 0);
  const elapsed = SCANNING_STEPS.slice(0, activeStep).reduce(
    (a, s) => a + s.duration,
    0,
  );
  const progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));

  return (
    <motion.section
      role="status"
      aria-label="AI analyzing plant image"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Preview thumbnail */}
      {previewUrl && (
        <div className="flex items-center gap-3 mb-5">
          <div className="h-14 w-14 rounded-xl overflow-hidden bg-muted shrink-0">
            <img
              src={previewUrl}
              alt="Plant being analyzed"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Analyzing your plant
            </p>
            <p className="text-[10px] text-muted-foreground">
              AI is examining the image for disease signs
            </p>
          </div>
        </div>
      )}

      {/* Scanning animation */}
      <div className="relative mb-5">
        <div className="h-1 rounded-full bg-border overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full rounded-full bg-primary"
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">
            Step {activeStep + 1} of {SCANNING_STEPS.length}
          </span>
          <span className="text-[10px] text-muted-foreground">
            ~{Math.max(1, Math.round((totalDuration - elapsed) / 1000))}s
            remaining
          </span>
        </div>
      </div>

      {/* Scanning steps */}
      <div className="space-y-2">
        {SCANNING_STEPS.map((step, i) => {
          const isCompleted = completedSteps.includes(i);
          const isActive = activeStep === i;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={cn(
                "flex items-center gap-3 p-2.5 rounded-xl transition-colors",
                isActive && "bg-primary/5",
                isCompleted && "opacity-60",
              )}
            >
              <span className="text-base" aria-hidden="true">
                {step.icon}
              </span>
              <span
                className={cn(
                  "text-xs flex-1",
                  isActive
                    ? "font-semibold text-foreground"
                    : isCompleted
                      ? "text-muted-foreground line-through"
                      : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
              {isCompleted && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-emerald-500 text-xs"
                >
                  {"\u2713"}
                </motion.span>
              )}
              {isActive && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="sr-only">
        Analyzing plant image. Step {activeStep + 1} of {SCANNING_STEPS.length}:{" "}
        {SCANNING_STEPS[activeStep]?.label}
      </p>
    </motion.section>
  );
};

AIAnalysis.displayName = "AIAnalysis";
