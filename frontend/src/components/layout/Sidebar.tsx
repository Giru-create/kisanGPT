"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MAIN_NAV_ITEMS } from "@/constants/navigation";
import { NavLink } from "@/components/navigation/NavLink";
import { Sparkles } from "lucide-react";

export interface SidebarProps {
  isCollapsed?: boolean;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  className,
}) => {
  return (
    <aside
      aria-label="Sidebar Navigation"
      className={cn(
        "hidden lg:flex flex-col border-r border-border bg-card/50 transition-all duration-200 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)]",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Logo Anchor */}
      <div
        className={cn(
          "flex items-center border-b border-border shrink-0",
          isCollapsed ? "justify-center px-2 py-4" : "gap-3 px-5 py-4",
        )}
      >
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2.5 group ds-focus-ring rounded-lg",
            isCollapsed && "justify-center",
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
            🌾
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight text-foreground">
                KisanGPT
              </span>
              <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground mt-0.5">
                AI Farming
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-col flex-1 min-h-0">
        <nav
          className="flex-1 space-y-0.5 px-3 py-3 overflow-y-auto"
          aria-label="Sidebar Section Links"
        >
          {MAIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              href={item.href}
              icon={item.icon}
              className={cn("w-full", isCollapsed && "px-2 justify-center")}
            >
              {!isCollapsed && item.label}
            </NavLink>
          ))}
        </nav>

        {/* AI Tip Footer */}
        {!isCollapsed && (
          <div className="mx-3 mb-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                AI Tip
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Rain is expected tomorrow. Delay irrigation for 24 hours to
              prevent root rot.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
