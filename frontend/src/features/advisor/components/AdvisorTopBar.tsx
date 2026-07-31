"use client";

// ─────────────────────────────────────────────────────────────────────────────
// AdvisorTopBar.tsx
// KisanGPT — AI Advisor top navigation bar
// Matches Dashboard design language with conversation-specific features
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Plus,
  Mic,
  Settings,
  PanelRightOpen,
  PanelRightClose,
  Brain,
  Sprout,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdvisorStore } from "../store/advisorStore";

const STATUS_CONFIG = {
  idle: { label: "Ready", color: "bg-emerald-500" },
  loading: { label: "Thinking...", color: "bg-amber-500 animate-pulse" },
  streaming: { label: "Streaming...", color: "bg-emerald-500 animate-pulse" },
  error: { label: "Error", color: "bg-red-500" },
  success: { label: "Complete", color: "bg-emerald-500" },
} as const;

export const AdvisorTopBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    conversationTitle,
    status,
    showRightPanel,
    toggleRightPanel,
    startNewConversation,
  } = useAdvisorStore();

  const statusConfig = STATUS_CONFIG[status];

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 md:px-6 border-b bg-card border-border shadow-sm"
    >
      {/* Left: Logo + Title + Status */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 shrink-0"
          aria-label="Back to Dashboard"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sprout size={18} className="text-primary" />
          </div>
        </Link>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-foreground truncate max-w-[200px] md:max-w-none">
              {conversationTitle}
            </h1>
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={cn("w-2 h-2 rounded-full", statusConfig.color)}
                aria-hidden="true"
              />
              <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Search (hidden on mobile) */}
      <div className="hidden md:flex items-center flex-1 justify-center px-4">
        <div className="relative w-full max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            aria-label="Search conversations"
            className="w-full rounded-full border border-border bg-muted/50 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        {/* New Conversation */}
        <button
          type="button"
          onClick={startNewConversation}
          aria-label="New conversation"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors active:scale-95 min-h-[40px]"
        >
          <Plus size={16} aria-hidden="true" />
          <span className="hidden sm:inline">New</span>
        </button>

        {/* Voice Shortcut */}
        <button
          type="button"
          aria-label="Voice input"
          className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
        >
          <Mic size={18} />
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
        >
          <Bell size={18} />
          <span
            aria-hidden="true"
            className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
          />
        </button>

        {/* AI Status Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-primary/10 text-primary">
          <Brain size={14} aria-hidden="true" />
          <span className="text-xs font-semibold">AI</span>
        </div>

        {/* Settings */}
        <button
          type="button"
          aria-label="Settings"
          className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
        >
          <Settings size={18} />
        </button>

        {/* Toggle Right Panel */}
        <button
          type="button"
          onClick={toggleRightPanel}
          aria-label={
            showRightPanel ? "Close context panel" : "Open context panel"
          }
          className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center hidden xl:flex"
        >
          {showRightPanel ? (
            <PanelRightClose size={18} />
          ) : (
            <PanelRightOpen size={18} />
          )}
        </button>
      </div>
    </header>
  );
};

AdvisorTopBar.displayName = "AdvisorTopBar";
