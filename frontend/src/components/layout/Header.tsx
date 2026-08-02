"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MAIN_NAV_ITEMS } from "@/constants/navigation";
import { NavLink } from "@/components/navigation/NavLink";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "@/components/navigation/MobileNav";

export interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu"
            className="lg:hidden h-9 w-9 p-0"
          >
            ☰
          </Button>

          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              aria-label="Toggle navigation sidebar"
              className="hidden lg:flex h-9 w-9 p-0"
            >
              ☰
            </Button>
          )}

          <Link
            href="/"
            className="flex items-center space-x-2.5 group ds-focus-ring rounded-md p-1"
          >
            <div className="ds-icon-container-sm bg-primary text-primary-foreground font-bold shadow-sm group-hover:scale-105 transition-transform">
              🌾
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight text-foreground">
                KisanGPT
              </span>
              <span className="ds-caption tracking-wider uppercase">
                AI Farming Assistant
              </span>
            </div>
          </Link>
        </div>

        <nav
          className="hidden lg:flex items-center space-x-1"
          aria-label="Main Navigation"
        >
          {MAIN_NAV_ITEMS.map((item) => (
            <NavLink key={item.id} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <ThemeToggle />
        </div>
      </div>

      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
};
