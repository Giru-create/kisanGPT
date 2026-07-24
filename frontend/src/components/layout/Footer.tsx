import React from "react";
import { cn } from "@/lib/utils";

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        "border-t border-border bg-card/30 text-muted-foreground py-8 px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-foreground">KisanGPT</span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center space-x-6">
          <span className="text-muted-foreground">WCAG 2.1 AA Compliant</span>
          <span className="text-muted-foreground">Design System v0.1.0</span>
        </div>
      </div>
    </footer>
  );
};
