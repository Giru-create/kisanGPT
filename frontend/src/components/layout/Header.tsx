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
        {/* Left Side: Brand Logo & Mobile Trigger */}
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

          <Link href="/" className="flex items-center space-x-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
              🌾
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight text-foreground">
                KisanGPT
              </span>
              <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">
                AI Farming Assistant
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
          {MAIN_NAV_ITEMS.map((item) => (
            <NavLink key={item.id} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Side: Theme Toggle & Actions */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
};
