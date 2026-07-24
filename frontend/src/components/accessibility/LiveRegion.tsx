import React from "react";
import { cn } from "@/lib/utils";

export interface LiveRegionProps extends React.HTMLAttributes<HTMLDivElement> {
  politeness?: "polite" | "assertive" | "off";
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  politeness = "polite",
  className,
  ...props
}) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className={cn("sr-only", className)}
      {...props}
    >
      {children}
    </div>
  );
};
