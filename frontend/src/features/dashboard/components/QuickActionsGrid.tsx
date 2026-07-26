"use client";

// ─────────────────────────────────────────────────────────────────────────────
// QuickActionsGrid.tsx
// KisanGPT — Section 7: Quick Actions 2×2 Grid
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Link from "next/link";
import { Camera, TrendingUp, Landmark, Droplet } from "lucide-react";

export const QuickActionsGrid: React.FC = () => {
  const actions = [
    {
      id: "crop-doctor",
      title: "Crop Doctor",
      subtitle: "Scan leaf for disease",
      href: "/disease",
      icon: Camera,
      bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20",
      textColor: "text-emerald-800 dark:text-emerald-300",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      borderColor: "border-emerald-500/25",
    },
    {
      id: "mandi-rates",
      title: "Mandi Rates",
      subtitle: "Live APMC prices",
      href: "/market",
      icon: TrendingUp,
      bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
      textColor: "text-amber-900 dark:text-amber-300",
      iconColor: "text-amber-600 dark:text-amber-400",
      borderColor: "border-amber-500/25",
    },
    {
      id: "govt-schemes",
      title: "Govt Schemes",
      subtitle: "Subsidies & DBT aid",
      href: "/schemes",
      icon: Landmark,
      bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
      textColor: "text-blue-900 dark:text-blue-300",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-500/25",
    },
    {
      id: "weather-irrigation",
      title: "Irrigation Advisor",
      subtitle: "Watering schedule",
      href: "/weather",
      icon: Droplet,
      bgColor: "bg-teal-500/10 dark:bg-teal-500/20",
      textColor: "text-teal-900 dark:text-teal-300",
      iconColor: "text-teal-600 dark:text-teal-400",
      borderColor: "border-teal-500/25",
    },
  ];

  return (
    <section role="region" aria-label="Quick Farming Tool Actions">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.id}
              href={action.href}
              aria-label={`${action.title}: ${action.subtitle}`}
              className={`flex items-center gap-3.5 rounded-2xl border ${action.borderColor} ${action.bgColor} p-4 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px]`}
            >
              <div
                className="p-3 rounded-xl bg-card shadow-sm shrink-0"
                aria-hidden="true"
              >
                <Icon className={`h-6 w-6 ${action.iconColor}`} />
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-extrabold text-sm sm:text-base leading-tight ${action.textColor}`}
                >
                  {action.title}
                </span>
                <span className="text-[11px] sm:text-xs text-muted-foreground font-semibold line-clamp-1 mt-0.5">
                  {action.subtitle}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

QuickActionsGrid.displayName = "QuickActionsGrid";
