"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { MAIN_NAV_ITEMS } from "@/constants/navigation";
import { NavLink } from "./NavLink";
import { Button } from "@/components/ui/Button";

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = React.memo(
  ({ isOpen, onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useFocusTrap(containerRef, isOpen);
    useKeyboardShortcut("Escape", onClose, isOpen);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />

        {/* Slide-out Menu Panel */}
        <aside
          ref={containerRef}
          aria-label="Mobile Navigation"
          aria-modal="true"
          role="dialog"
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-card shadow-2xl border-r border-border flex flex-col transition-transform duration-200 ease-in-out",
          )}
        >
          {/* Logo */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-base shadow-sm">
                🌾
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none tracking-tight text-foreground">
                  KisanGPT
                </span>
                <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground mt-0.5">
                  AI Farming
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="h-9 w-9 p-0 rounded-lg"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Button>
          </div>

          {/* Navigation */}
          <nav
            className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5"
            aria-label="Mobile Main Navigation"
          >
            {MAIN_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                href={item.href}
                icon={item.icon}
                onClick={onClose}
                className="w-full py-3"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-border shrink-0">
            <p className="text-xs text-muted-foreground text-center">
              KisanGPT v1.0
            </p>
          </div>
        </aside>
      </div>
    );
  },
);

MobileNav.displayName = "MobileNav";
