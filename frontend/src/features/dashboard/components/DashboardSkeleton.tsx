"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading farmer dashboard"
      className="w-full flex flex-col gap-8"
    >
      <span className="sr-only">Loading farmer dashboard data...</span>

      {/* Hero card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <Skeleton className="h-6 w-36 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-64 rounded-lg" />
            <div className="flex gap-3 mt-2">
              <Skeleton className="h-16 w-32 rounded-xl" />
              <Skeleton className="h-16 w-32 rounded-xl" />
            </div>
            <Skeleton className="h-10 w-40 rounded-xl mt-2" />
          </div>
          <Skeleton className="h-40 w-40 rounded-2xl self-center" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-5 w-12 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg mb-2" />
            <Skeleton className="h-4 w-28 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Crop health */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <Skeleton className="w-1 h-6 rounded-full" />
          <Skeleton className="h-5 w-28 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>

      {/* Market intelligence */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <Skeleton className="w-1 h-6 rounded-full" />
          <Skeleton className="h-5 w-40 rounded-lg" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>

      {/* Tasks timeline */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <Skeleton className="w-1 h-6 rounded-full" />
          <Skeleton className="h-5 w-32 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-16 rounded-lg" />
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`flex items-start gap-4 px-5 py-4 ${
              i < 2 ? "border-b border-border/40" : ""
            }`}
          >
            <Skeleton className="w-3 h-3 rounded-full mt-1" />
            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-4 w-40 rounded-lg" />
              <Skeleton className="h-3 w-56 rounded-lg" />
            </div>
            <Skeleton className="w-4 h-4 rounded-full mt-1" />
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <Skeleton className="w-1 h-6 rounded-full" />
          <Skeleton className="h-5 w-32 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-16 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="w-9 h-9 rounded-xl" />
              <Skeleton className="h-3 w-28 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-full rounded-lg mb-2" />
            <Skeleton className="h-3 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
};

DashboardSkeleton.displayName = "DashboardSkeleton";
