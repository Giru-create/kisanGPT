import React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  className,
  icon,
  title,
  description,
  action,
  ...props
}) => (
  <div className={cn("ds-empty-state", className)} role="status" {...props}>
    {icon && (
      <div className="ds-icon-container-lg bg-muted/50 text-muted-foreground mb-4">
        {icon}
      </div>
    )}
    <h3 className="ds-heading-md text-foreground mb-1">{title}</h3>
    {description && (
      <p className="ds-body-sm text-muted-foreground max-w-xs leading-relaxed">
        {description}
      </p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

EmptyState.displayName = "EmptyState";
