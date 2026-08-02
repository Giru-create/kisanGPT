import React from "react";
import { cn } from "@/lib/utils";

export interface PageContainerProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  description,
  action,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8",
        className,
      )}
    >
      {(title || description || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 ds-divider">
          <div className="space-y-1">
            {title && <h1 className="ds-heading-xl">{title}</h1>}
            {description && (
              <p className="ds-body-lg text-muted-foreground max-w-3xl">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
};
