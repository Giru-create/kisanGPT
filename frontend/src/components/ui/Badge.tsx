import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  children,
  ...props
}) => {
  const variantStyles = {
    default: "bg-primary/10 text-primary border-primary/20",
    success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    error: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
    info: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
    outline: "border-border text-foreground bg-transparent",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
