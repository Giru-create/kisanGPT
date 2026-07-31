"use client";

import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";

export const MarketSkeleton: React.FC = () => (
  <motion.div
    role="status"
    aria-busy="true"
    aria-label="Loading market data"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2 }}
    className="space-y-5"
  >
    <span className="sr-only">Loading market data...</span>

    {/* Hero skeleton */}
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-muted/50 p-3">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-1.5 w-full mt-2 rounded-full" />
          </div>
        ))}
      </div>
    </div>

    {/* Trend skeleton */}
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg mb-4" />
      <Skeleton className="h-32 w-full rounded-xl mb-4" />
      <div className="flex gap-1.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-16 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center p-2 rounded-xl bg-muted/50">
            <Skeleton className="h-2.5 w-8 mx-auto mb-1" />
            <Skeleton className="h-3.5 w-14 mx-auto" />
          </div>
        ))}
      </div>
    </div>

    {/* AI Recommendation skeleton */}
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 bg-muted/30">
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-4 w-48 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-2 w-full mb-4 rounded-full" />
        <Skeleton className="h-12 w-full mb-4" />
        <div className="flex gap-2 mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-24 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </div>

    {/* Price cards skeleton */}
    <div className="rounded-2xl border border-border bg-card p-5">
      <Skeleton className="h-4 w-28 mb-4" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border p-4">
            <Skeleton className="h-1 w-full rounded-t-full mb-3" />
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-3.5 w-20 mb-1" />
                <Skeleton className="h-2.5 w-14" />
              </div>
            </div>
            <Skeleton className="h-7 w-28 mb-2" />
            <Skeleton className="h-5 w-16 rounded-full mb-3" />
            <Skeleton className="h-px w-full" />
            <div className="flex justify-between mt-3">
              <Skeleton className="h-2.5 w-24" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

MarketSkeleton.displayName = "MarketSkeleton";
