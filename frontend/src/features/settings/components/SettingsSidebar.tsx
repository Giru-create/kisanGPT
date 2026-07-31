// ─────────────────────────────────────────────────────────────────────────────
// SettingsSidebar.tsx
// KisanGPT — Settings category navigation sidebar
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Mic,
  Bell,
  Palette,
  Tractor,
  Shield,
  Lock,
  Puzzle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SettingsCategory } from "../types/settings.types";
import { SETTINGS_CATEGORIES } from "../constants/settings.constants";

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  brain: Brain,
  mic: Mic,
  bell: Bell,
  palette: Palette,
  tractor: Tractor,
  shield: Shield,
  lock: Lock,
  puzzle: Puzzle,
  info: Info,
};

interface SettingsSidebarProps {
  activeCategory: SettingsCategory;
  onNavigate: (category: SettingsCategory) => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeCategory,
  onNavigate,
}) => {
  return (
    <nav className="space-y-1" aria-label="Settings categories">
      {SETTINGS_CATEGORIES.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.icon];
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onNavigate(cat.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200",
              "min-h-[44px] relative",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {isActive && (
              <motion.div
                layoutId="settings-sidebar-indicator"
                className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <div className="relative z-10 flex items-center gap-3 w-full">
              {Icon && (
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium block truncate">
                  {cat.label}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </nav>
  );
};

SettingsSidebar.displayName = "SettingsSidebar";
