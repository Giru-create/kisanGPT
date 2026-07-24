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

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
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
          "fixed inset-y-0 left-0 z-50 w-72 bg-card p-6 shadow-2xl border-r border-border flex flex-col justify-between transition-transform duration-200 ease-in-out"
        )}
      >
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                K
              </div>
              <span className="font-bold text-lg text-foreground">KisanGPT</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="h-8 w-8 p-0 rounded-full"
            >
              ✕
            </Button>
          </div>

          <nav className="mt-6 flex flex-col space-y-2" aria-label="Mobile Main Navigation">
            {MAIN_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="w-full text-base py-3 px-4 rounded-md"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-border text-xs text-muted-foreground text-center">
          KisanGPT Foundation v0.1.0
        </div>
      </aside>
    </div>
  );
};
