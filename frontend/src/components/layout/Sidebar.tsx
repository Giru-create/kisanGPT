"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { MAIN_NAV_ITEMS } from "@/constants/navigation";
import { NavLink } from "@/components/navigation/NavLink";
import { Badge } from "@/components/ui/Badge";

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
        "hidden lg:flex flex-col border-r border-border bg-card/50 transition-all duration-200 shrink-0",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div className="flex flex-col flex-1 p-4 space-y-6">
        <div>
          {!isCollapsed && (
            <h2 className="px-3 ds-label-sm uppercase tracking-wider mb-3 select-none">
              Foundation Navigation
            </h2>
          )}
          <nav className="space-y-1" aria-label="Sidebar Section Links">
            {MAIN_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                href={item.href}
                className={cn(
                  "w-full justify-start py-2.5",
                  isCollapsed && "px-2 justify-center",
                )}
              >
                <span className={cn(isCollapsed && "sr-only")}>
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        {!isCollapsed && (
          <div className="mt-auto p-4 rounded-lg bg-accent/40 border border-border/60">
            <div className="flex items-center justify-between mb-2">
              <span className="ds-label-sm text-foreground">Status</span>
              <Badge variant="success">Phase 1</Badge>
            </div>
            <p className="ds-caption leading-relaxed">
              Frontend Foundation ready. Modular design system active.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
