"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Crop } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "@/components/navigation/MobileNav";
import { NotificationDropdown } from "@/components/ui/NotificationDropdown";

export interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile menu + Logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu"
            className="lg:hidden h-9 w-9 p-0"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2.25 4.5h13.5M2.25 9h13.5M2.25 13.5h13.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </Button>

          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              aria-label="Toggle navigation sidebar"
              className="hidden lg:flex h-9 w-9 p-0"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2.25 4.5h13.5M2.25 9h13.5M2.25 13.5h13.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Button>
          )}

          <Link
            href="/dashboard"
            className="flex items-center gap-2 group ds-focus-ring rounded-lg p-1 -ml-1"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              🌾
            </div>
            <span className="font-bold text-base tracking-tight text-foreground hidden sm:block">
              KisanGPT
            </span>
          </Link>
        </div>

        {/* Right: Utility actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search..."
              aria-label="Search"
              className="h-9 w-48 lg:w-64 rounded-lg border border-border/60 bg-muted/30 pl-9 pr-3 text-sm focus-visible:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 placeholder:text-muted-foreground/60 transition-all"
            />
          </div>

          {/* Notifications */}
          <NotificationDropdown />

          <ThemeToggle className="h-9 px-3 text-xs" />

          {/* Analyze Crop */}
          <Link
            href="/disease"
            className="hidden md:inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all active:scale-[0.97] min-h-[40px]"
          >
            <Crop size={14} aria-hidden="true" />
            Analyze Crop
          </Link>

          {/* Avatar */}
          <div
            className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary overflow-hidden cursor-pointer hover:bg-primary/20 transition-colors"
            aria-label="User avatar"
          >
            <span aria-hidden="true">K</span>
          </div>
        </div>
      </div>

      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
};
