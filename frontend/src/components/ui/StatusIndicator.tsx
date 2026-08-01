import React from "react";
import { cn } from "@/lib/utils";

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: "success" | "warning" | "error" | "info" | "neutral";
  size?: "sm" | "md" | "lg";
  label?: string;
  pulse?: boolean;
}

const statusStyles = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  neutral: "bg-muted-foreground/50",
};

const sizeStyles = {
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  className,
  status,
  size = "md",
  label,
  pulse = false,
  ...props
}) => (
  <span className={cn("inline-flex items-center gap-2", className)} {...props}>
    <span className="relative flex">
      <span
        className={cn(
          "rounded-full",
          statusStyles[status],
          sizeStyles[size],
          pulse &&
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
        )}
        aria-hidden="true"
      />
      <span
        className={cn("rounded-full", statusStyles[status], sizeStyles[size])}
      />
    </span>
    {label && (
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    )}
  </span>
);

StatusIndicator.displayName = "StatusIndicator";
