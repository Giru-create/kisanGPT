"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Crop, MapPin } from "lucide-react";
import { Button, SearchBar, StatusIndicator } from "@/components/ui";
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
      className="sticky top-0 z-header backdrop-blur-xl bg-background/80 border-b border-border/40"
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[72px] px-5 sm:px-8">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate animate-fade-in-left">
              {getGreeting()}, {profile.name}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                <MapPin
                  size={12}
                  className="text-primary shrink-0"
                  aria-hidden="true"
                />
                <span className="truncate">
                  {profile.village}
                  {profile.state ? `, ${profile.state}` : ""}
                </span>
              </span>
              <span className="text-border">·</span>
              <StatusIndicator
                status={advisorySafe ? "success" : "warning"}
                size="sm"
                label={`${temperatureC}° ${WEATHER_LABELS[condition]}`}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs hidden md:block">
            <SearchBar
              size="sm"
              placeholder="Search..."
              aria-label="Search dashboard"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              className="bg-muted/30"
            />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative p-2.5 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all ds-touch-target flex items-center justify-center"
          >
            <Bell size={18} />
            <span
              aria-hidden="true"
              className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background"
            />
          </button>

          <Link href="/disease" className="hidden lg:inline-flex">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Crop size={14} aria-hidden="true" />}
            >
              Analyze Crop
            </Button>
          </Link>

          <div
            className="ds-icon-container-md bg-primary/10 text-sm font-bold text-primary overflow-hidden"
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
