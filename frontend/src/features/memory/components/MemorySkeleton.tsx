"use client";

import React from "react";
import { motion } from "framer-motion";

export const MemorySkeleton: React.FC = () => {
  return (
    <div
      aria-label="Loading farm memory records..."
      role="status"
      className="space-y-6 w-full"
    >
      {/* Hero skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-border bg-card p-5 animate-pulse"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-muted" />
            <div className="space-y-1.5">
              <div className="h-4 bg-muted rounded-md w-32" />
              <div className="h-3 bg-muted rounded-md w-48" />
            </div>
          </div>
          <div className="h-5 bg-muted rounded-full w-16" />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl bg-muted/50 p-3 text-center">
              <div className="h-6 bg-muted rounded-md w-8 mx-auto mb-1" />
              <div className="h-3 bg-muted rounded-md w-16 mx-auto" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Summary skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border border-border bg-card p-5 animate-pulse"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-muted" />
          <div className="space-y-1.5">
            <div className="h-4 bg-muted rounded-md w-36" />
            <div className="h-3 bg-muted rounded-md w-52" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50"
            >
              <div className="h-7 w-7 rounded-lg bg-muted" />
              <div className="space-y-1">
                <div className="h-2.5 bg-muted rounded-md w-16" />
                <div className="h-3 bg-muted rounded-md w-24" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Search skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-3 animate-pulse"
      >
        <div className="flex items-center gap-2">
          <div className="flex-1 h-11 bg-muted rounded-xl" />
          <div className="h-11 w-11 bg-muted rounded-xl" />
        </div>
      </motion.div>

      {/* Timeline skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-muted" />
              <div className="h-4 bg-muted rounded-md w-28" />
              <div className="h-3 bg-muted rounded-md w-20" />
              <div className="flex-1 h-px bg-border/50" />
            </div>
            <div className="ml-3.5 border-l-2 border-border/40 pl-4 space-y-3">
              {[1, 2].map((j) => (
                <div
                  key={j}
                  className="p-4 rounded-2xl bg-card border border-border/50 animate-pulse space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-xl bg-muted" />
                      <div className="h-4 bg-muted rounded-full w-20" />
                      <div className="h-4 bg-muted rounded-full w-16" />
                    </div>
                    <div className="h-3 bg-muted rounded-md w-20" />
                  </div>
                  <div className="h-4 bg-muted rounded-md w-3/4" />
                  <div className="h-3 bg-muted rounded-md w-full" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-muted rounded-full w-16" />
                    <div className="h-5 bg-muted rounded-full w-20" />
                    <div className="h-5 bg-muted rounded-full w-14" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

MemorySkeleton.displayName = "MemorySkeleton";
