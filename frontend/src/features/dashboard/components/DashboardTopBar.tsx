"use client";

import React, { useState } from "react";
import { Search, Bell, History, Crop } from "lucide-react";

export const DashboardTopBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 border-b bg-card border-border shadow-sm"
    >
      <div className="flex items-center flex-1 gap-4">
        <div className="relative w-full max-w-md hidden sm:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fields, crops, or market data..."
            aria-label="Search dashboard"
            className="w-full rounded-full border border-border bg-muted/50 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
        >
          <Bell size={20} />
          <span
            aria-hidden="true"
            className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
          />
        </button>

        <button
          type="button"
          aria-label="History"
          className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
        >
          <History size={20} />
        </button>

        <div
          className="h-6 w-px bg-border mx-1 hidden sm:block"
          aria-hidden="true"
        />

        <button
          type="button"
          className="hidden lg:flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors active:scale-95"
        >
          <Crop size={16} aria-hidden="true" />
          Analyze Crop
        </button>

        <div
          className="w-9 h-9 rounded-full bg-primary/10 border border-border flex items-center justify-center text-sm font-bold text-primary overflow-hidden"
          aria-label="User avatar"
        >
          <span aria-hidden="true">K</span>
        </div>
      </div>
    </header>
  );
};

DashboardTopBar.displayName = "DashboardTopBar";
