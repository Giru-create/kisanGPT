"use client";

// ─────────────────────────────────────────────────────────────────────────────
// AIAdvisor.tsx
// KisanGPT — Main AI Advisor feature assembly
// Premium AI conversation interface matching Dashboard design language
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { AdvisorTopBar } from "./AdvisorTopBar";
import { ChatWindow } from "./ChatWindow";
import { FarmContextSidebar } from "./FarmContextSidebar";

export const AIAdvisor: React.FC = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Top Navigation Bar */}
      <AdvisorTopBar />

      {/* Main Content Area with Right Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Area */}
        <section
          id="main-content"
          className="flex-1 flex flex-col min-w-0 overflow-hidden"
        >
          <ChatWindow />
        </section>

        {/* Right Sidebar - Farm Context */}
        <FarmContextSidebar />
      </div>
    </div>
  );
};

AIAdvisor.displayName = "AIAdvisor";
