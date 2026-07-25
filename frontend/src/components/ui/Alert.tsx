import React from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = "info",
  title,
  children,
  ...props
}) => {
  const variantStyles = {
    info: "bg-blue-500/10 text-blue-950 dark:text-blue-200 border-blue-500/30 border-l-blue-500",
    success:
      "bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 border-emerald-500/30 border-l-emerald-500",
    warning:
      "bg-amber-500/10 text-amber-950 dark:text-amber-200 border-amber-500/30 border-l-amber-500",
    error:
      "bg-red-500/10 text-red-950 dark:text-red-200 border-red-500/30 border-l-red-500",
  };

  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-xl border border-l-4 p-4 shadow-sm font-sans transition-all",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {title && (
        <h5 className="mb-1 font-medium leading-none tracking-tight">
          {title}
        </h5>
      )}
      <div className="text-sm opacity-90">{children}</div>
    </div>
  );
};
