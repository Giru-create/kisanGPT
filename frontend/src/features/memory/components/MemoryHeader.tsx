// ─────────────────────────────────────────────────────────────────────────────
// MemoryHeader.tsx
// KisanGPT — Farm Memory Page Header Component
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import {
  BookOpen,
  Plus,
  ArrowLeft,
  Database,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface MemoryHeaderProps {
  totalCount: number;
  verifiedCount: number;
  onAddClick: () => void;
}

export const MemoryHeader: React.FC<MemoryHeaderProps> = ({
  totalCount,
  verifiedCount,
  onAddClick,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/60 px-4 py-3 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="Back to Dashboard"
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight leading-none">
                Farm Memory (फॉर्म मेमोरी)
              </h1>
              <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Database size={11} /> {totalCount} Records
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={11} /> {verifiedCount} Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all min-h-[40px]"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Record</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  );
};

MemoryHeader.displayName = "MemoryHeader";
