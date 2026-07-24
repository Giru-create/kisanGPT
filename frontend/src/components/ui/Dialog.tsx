"use client";

import React, { useRef, useId } from "react";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { Button } from "./Button";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useFocusTrap(dialogRef, isOpen);
  useKeyboardShortcut("Escape", onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Dialog Container */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "relative z-50 w-full max-w-lg rounded-lg border border-border bg-card p-6 text-card-foreground shadow-lg transition-all animate-in fade-in zoom-in-95",
        )}
      >
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between">
            <h2
              id={titleId}
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              {title}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close dialog"
              className="h-8 w-8 p-0 rounded-full"
            >
              ✕
            </Button>
          </div>
          {description && (
            <p id={descriptionId} className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="py-4">{children}</div>

        {footer && (
          <div className="flex items-center justify-end space-x-2 pt-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
