"use client";

import React, { useCallback } from "react";
import { useTheme } from "@/store/themeStore";
import { Button } from "./Button";

export const ThemeToggle: React.FC<{ className?: string }> = React.memo(
  ({ className }) => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = useCallback(() => {
      if (theme === "light") {
        setTheme("dark");
      } else if (theme === "dark") {
        setTheme("system");
      } else {
        setTheme("light");
      }
    }, [theme, setTheme]);

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className={className}
        aria-label={`Toggle theme (Current: ${theme})`}
        title={`Theme: ${theme}`}
      >
        <span className="capitalize text-xs font-semibold">Theme: {theme}</span>
      </Button>
    );
  },
);

ThemeToggle.displayName = "ThemeToggle";
