"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export const Tooltip: React.FC<TooltipProps> = React.memo(
  ({ content, children, position = "top" }) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleMouseEnter = useCallback(() => setIsVisible(true), []);
    const handleMouseLeave = useCallback(() => setIsVisible(false), []);
    const handleFocus = useCallback(() => setIsVisible(true), []);
    const handleBlur = useCallback(() => setIsVisible(false), []);

    const positionStyles = {
      top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
      bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
      left: "right-full mr-2 top-1/2 -translate-y-1/2",
      right: "left-full ml-2 top-1/2 -translate-y-1/2",
    };

    return (
      <div
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {children}
        {isVisible && (
          <div
            role="tooltip"
            className={cn(
              "absolute z-50 whitespace-nowrap rounded bg-slate-900 px-2.5 py-1 text-xs text-white shadow-md dark:bg-slate-100 dark:text-slate-900 pointer-events-none transition-all animate-in fade-in duration-150 select-none",
              positionStyles[position],
            )}
          >
            {content}
          </div>
        )}
      </div>
    );
  },
);

Tooltip.displayName = "Tooltip";
