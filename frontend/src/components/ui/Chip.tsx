import React from "react";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline";
  size?: "sm" | "md";
  removable?: boolean;
  onRemove?: () => void;
}

const variantStyles = {
  default: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  error: "bg-red-500/10 text-red-700 dark:text-red-300",
  info: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  outline: "bg-transparent border border-border text-foreground",
};

const sizeStyles = {
  sm: "h-6 px-2.5 text-[11px] gap-1",
  md: "h-7 px-3 text-xs gap-1.5",
};

export const Chip: React.FC<ChipProps> = ({
  className,
  variant = "default",
  size = "md",
  removable = false,
  onRemove,
  children,
  ...props
}) => (
  <span
    className={cn(
      "inline-flex items-center font-medium rounded-full transition-colors select-none",
      variantStyles[variant],
      sizeStyles[size],
      className,
    )}
    {...props}
  >
    {children}
    {removable && (
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        aria-label="Remove"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7.5 2.5L2.5 7.5M2.5 2.5l5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    )}
  </span>
);

Chip.displayName = "Chip";
