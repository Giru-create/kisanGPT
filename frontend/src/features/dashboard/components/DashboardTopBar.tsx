"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Crop } from "lucide-react";

export const DashboardTopBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center flex-1 gap-4">
          <div className="relative w-full max-w-md hidden sm:block">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fields, crops, or market data..."
              aria-label="Search dashboard"
              className="w-full rounded-xl border border-border/60 bg-muted/30 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 placeholder:text-muted-foreground/60 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="relative p-2.5 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <Bell size={19} />
            <span
              aria-hidden="true"
              className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background"
            />
          </button>

          <div
            className="h-6 w-px bg-border/60 mx-1 hidden sm:block"
            aria-hidden="true"
          />

          <Link
            href="/disease"
            className="hidden lg:inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95 min-h-[40px]"
          >
            <Crop size={15} aria-hidden="true" />
            Analyze Crop
          </Link>

          <div
            className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary overflow-hidden"
            aria-label="User avatar"
          >
            <span aria-hidden="true">K</span>
          </div>
        </div>
      </div>
    </header>
  );
};

DashboardTopBar.displayName = "DashboardTopBar";
