"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { StatusIndicator } from "@/components/ui";
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
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="py-5 px-5 sm:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col min-w-0">
          <h1 className="text-lg font-bold text-foreground truncate">
            {getGreeting()}, {profile.name}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            {profile.village && (
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
            )}
            {profile.village && <span className="text-border">·</span>}
            <StatusIndicator
              status={advisorySafe ? "success" : "warning"}
              size="sm"
              label={`${temperatureC}° ${WEATHER_LABELS[condition]}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

TopBar.displayName = "TopBar";
