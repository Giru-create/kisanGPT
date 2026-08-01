import React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export interface SearchBarProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  size?: "sm" | "md" | "lg";
  onClear?: () => void;
}

const sizeStyles = {
  sm: "h-10 min-h-[40px] px-3 pl-9 text-sm rounded-xl",
  md: "h-12 min-h-[48px] px-4 pl-11 text-base rounded-xl",
  lg: "h-14 min-h-[56px] px-5 pl-12 text-lg rounded-2xl",
};

const iconSizes = {
  sm: 14,
  md: 16,
  lg: 18,
};

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, size = "md", onClear, value, ...props }, ref) => (
    <div className="relative w-full">
      <Search
        size={iconSizes[size]}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={ref}
        type="search"
        value={value}
        className={cn(
          "w-full bg-card border border-border text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
          "transition-colors",
          sizeStyles[size],
          className,
        )}
        {...props}
      />
      {onClear && value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  ),
);

SearchBar.displayName = "SearchBar";
