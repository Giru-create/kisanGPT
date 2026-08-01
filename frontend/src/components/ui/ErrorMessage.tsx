import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export interface ErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  className,
  title = "Something went wrong",
  message,
  action,
  icon,
  ...props
}) => (
  <div className={cn("ds-error-state", className)} role="alert" {...props}>
    <div className="rounded-full bg-destructive/10 p-4 mb-4">
      {icon ?? (
        <AlertTriangle
          size={32}
          className="text-destructive"
          aria-hidden="true"
        />
      )}
    </div>
    <h2 className="text-lg font-semibold text-foreground mb-1">{title}</h2>
    <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
      {message}
    </p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

ErrorMessage.displayName = "ErrorMessage";
