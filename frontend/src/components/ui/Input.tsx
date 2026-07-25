import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      errorMessage,
      leftIcon,
      rightIcon,
      id: customId,
      type = "text",
      disabled,
      required,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = customId || `input-${autoId}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const isInvalid = Boolean(errorMessage);

    const ariaDescribedBy = [
      errorMessage ? errorId : null,
      helperText ? helperId : null,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground select-none"
          >
            {label}
            {required && (
              <span className="ml-1 text-destructive" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-muted-foreground pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            required={required}
            aria-invalid={isInvalid}
            aria-describedby={ariaDescribedBy || undefined}
            className={cn(
              "flex h-12 min-h-[48px] w-full rounded-xl border border-input bg-background px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
              leftIcon ? "pl-11" : undefined,
              rightIcon ? "pr-11" : undefined,
              isInvalid
                ? "border-destructive focus-visible:ring-destructive"
                : undefined,
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 text-muted-foreground pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {errorMessage && (
          <p id={errorId} className="text-xs font-medium text-destructive">
            {errorMessage}
          </p>
        )}

        {!errorMessage && helperText && (
          <p id={helperId} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
