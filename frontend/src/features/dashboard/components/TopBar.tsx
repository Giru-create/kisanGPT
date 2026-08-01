"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Bell, Crop, MapPin, CloudSun } from "lucide-react";
import type { FarmerProfile } from "../types/dashboard.types";
import type { WeatherCondition } from "@/features/weather/types/weather.types";
import { WEATHER_LABELS } from "@/features/weather/constants/weather.constants";

interface TopBarProps {
  profile: FarmerProfile;
  temperatureC: number;
  condition: WeatherCondition;
  advisorySafe: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  profile,
  temperatureC,
  condition,
  advisorySafe,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/40"
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[72px] px-5 sm:px-8">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex flex-col min-w-0">
            <motion.h1
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-bold text-foreground truncate"
            >
              {getGreeting()}, {profile.name}
            </motion.h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                <MapPin size={11} className="text-primary shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {profile.village}{profile.state ? `, ${profile.state}` : ""}
                </span>
              </span>
              <span className="text-border">·</span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold ${
                  advisorySafe
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                <CloudSun size={12} aria-hidden="true" />
                {temperatureC}° {WEATHER_LABELS[condition]}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs hidden md:block">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              aria-label="Search dashboard"
              className="w-full rounded-xl border border-border/50 bg-muted/30 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 placeholder:text-muted-foreground/50 transition-all"
            />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative p-2.5 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <Bell size={18} />
            <span
              aria-hidden="true"
              className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background"
            />
          </button>

          <Link
            href="/disease"
            className="hidden lg:inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] min-h-[40px]"
          >
            <Crop size={14} aria-hidden="true" />
            Analyze Crop
          </Link>

          <div
            className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary overflow-hidden"
            aria-label="User avatar"
          >
            <span aria-hidden="true">
              {profile.name?.charAt(0)?.toUpperCase() || "K"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

TopBar.displayName = "TopBar";
