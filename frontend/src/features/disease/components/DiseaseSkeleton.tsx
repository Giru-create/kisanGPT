"use client";

import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";

export const DiseaseSkeleton: React.FC = () => (
  <motion.div
    role="status"
    aria-busy="true"
    aria-label="Loading disease detection"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2 }}
    className="space-y-5"
  >
    <span className="sr-only">Loading disease detection results...</span>

    {/* Hero skeleton */}
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div>
          <Skeleton className="h-4 w-36 mb-1" />
          <Skeleton className="h-2.5 w-24" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-16 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>

    {/* Image capture skeleton */}
    <div className="rounded-2xl border-2 border-dashed border-border p-8">
      <div className="flex flex-col items-center">
        <Skeleton className="h-14 w-14 rounded-2xl mb-4" />
        <Skeleton className="h-4 w-40 mb-1" />
        <Skeleton className="h-3 w-32 mb-4" />
        <div className="flex gap-2 w-full max-w-xs">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 flex-1 rounded-lg" />
        </div>
      </div>
    </div>

    {/* Diagnosis result skeleton */}
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <Skeleton className="h-1.5 w-full" />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Skeleton className="h-5 w-40 mb-1" />
            <Skeleton className="h-3 w-28 mb-0.5" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-2.5 w-full mb-4 rounded-full" />
        <div className="flex gap-2 mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-20 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-16 w-full rounded-xl mb-4" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>

    {/* Treatment skeleton */}
    <div className="rounded-2xl border border-border bg-card p-5">
      <Skeleton className="h-4 w-28 mb-4" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border p-3.5 mb-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-lg" />
              <div>
                <Skeleton className="h-3.5 w-24 mb-1" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-4 w-20 rounded-full" />
          </div>
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  </motion.div>
);

DiseaseSkeleton.displayName = "DiseaseSkeleton";
