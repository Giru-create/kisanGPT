"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading farmer dashboard"
      className="max-w-7xl mx-auto w-full flex flex-col gap-8"
    >
      <span className="sr-only">Loading farmer dashboard data...</span>

      <div className="flex justify-between items-end py-2">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-72 rounded-xl" />
          <Skeleton className="h-4 w-48 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <Skeleton className="w-1 h-6 rounded-full" />
          <Skeleton className="h-5 w-32 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <Skeleton className="w-1 h-6 rounded-full" />
          <Skeleton className="h-5 w-40 rounded-lg" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>

      <Skeleton className="h-20 rounded-2xl" />
    </div>
  );
};

DashboardSkeleton.displayName = "DashboardSkeleton";
