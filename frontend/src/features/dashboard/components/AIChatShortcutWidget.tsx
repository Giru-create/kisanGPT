"use client";

// ─────────────────────────────────────────────────────────────────────────────
// AIChatShortcutWidget.tsx
// KisanGPT — Section 3: AI Chat Search Shortcut & Prompt Chips
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bot, ArrowRight } from "lucide-react";
import { QUICK_PROMPTS } from "../constants/dashboard.constants";

export const AIChatShortcutWidget: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      router.push("/chat");
      return;
    }
    router.push(`/chat?q=${encodeURIComponent(query.trim())}`);
  };

  const handleChipClick = (prompt: string) => {
    router.push(`/chat?q=${encodeURIComponent(prompt.trim())}`);
  };

  return (
    <section
      role="region"
      aria-label="AI Farming Assistant Search"
      className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-primary shrink-0" aria-hidden="true" />
          <h2 className="font-extrabold text-sm sm:text-base text-foreground">
            Ask KisanGPT AI Assistant
          </h2>
        </div>
        <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
          24/7 Active
        </span>
      </div>

      {/* Input Bar Form */}
      <form onSubmit={handleSubmit} className="relative mb-3">
        <div className="relative flex items-center">
          <Search
            size={18}
            className="absolute left-3.5 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about crops, diseases, fertilizers, or mandi prices..."
            aria-label="Ask KisanGPT AI assistant a question"
            className="flex h-12 min-h-[48px] w-full rounded-xl border border-input bg-background pl-10 pr-14 text-sm sm:text-base font-normal text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
          />
          <button
            type="submit"
            aria-label="Send search query to KisanGPT Chat"
            className="absolute right-1.5 h-10 w-10 min-h-[48px] min-w-[48px] rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </form>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-muted-foreground shrink-0 font-semibold text-xs">
          Try asking:
        </span>
        <div
          role="group"
          aria-label="Suggested quick questions"
          className="flex items-center gap-2"
        >
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(prompt)}
              aria-label={`Ask AI: ${prompt}`}
              className="shrink-0 rounded-full border border-border bg-muted/50 px-3.5 py-2.5 font-semibold text-xs text-foreground hover:bg-accent hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[48px]"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

AIChatShortcutWidget.displayName = "AIChatShortcutWidget";
