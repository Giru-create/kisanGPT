import React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none rounded-xl";

    const variantStyles = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      danger:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
    };

    const sizeStyles = {
      sm: "h-10 min-h-[44px] px-4 text-sm gap-2 rounded-lg",
      md: "h-12 min-h-[48px] px-5 text-base gap-2.5 rounded-xl font-medium",
      lg: "h-14 min-h-[56px] px-6 text-lg gap-3 rounded-xl font-semibold",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="mr-1" />}
        {!isLoading && leftIcon && (
          <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
