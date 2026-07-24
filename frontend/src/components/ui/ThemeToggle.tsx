"use client";

import React from "react";
import { useTheme } from "@/store/themeStore";
import { Button } from "./Button";

export const ThemeToggle: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

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
};
