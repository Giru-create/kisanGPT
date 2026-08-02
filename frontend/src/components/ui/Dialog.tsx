"use client";

import React, { useRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Dialog Container */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative z-50 w-full max-w-lg rounded-lg border border-border bg-card p-6 text-card-foreground shadow-lg",
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
                  className="min-h-[44px] min-w-[44px] p-0 rounded-full flex items-center justify-center"
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
