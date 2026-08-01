import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

export interface SuccessMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  className,
  title = "Success",
  message,
  action,
  icon,
  ...props
}) => (
  <div className={cn("ds-success-state", className)} role="status" {...props}>
    <div className="rounded-full bg-emerald-500/10 p-4 mb-4">
      {icon ?? (
        <CheckCircle2
          size={32}
          className="text-emerald-600 dark:text-emerald-400"
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

SuccessMessage.displayName = "SuccessMessage";
