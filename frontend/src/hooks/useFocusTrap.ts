"use client";

import { useEffect, RefObject } from "react";
import { handleTabFocusTrap, getFocusableElements } from "@/utils/a11y";

export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  isActive: boolean,
): void {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const container = ref.current;
    const focusable = getFocusableElements(container);
    const previousActiveElement = document.activeElement as HTMLElement | null;

    if (focusable.length > 0) {
      focusable[0]?.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      handleTabFocusTrap(e, container);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [ref, isActive]);
}
