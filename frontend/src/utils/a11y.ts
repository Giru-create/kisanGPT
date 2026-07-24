/**
 * Accessibility utility functions for keyboard navigation, focus management, and screen readers.
 */

export const FOCUSABLE_ELEMENTS_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Returns all focusable DOM elements within a container element.
 */
export function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR)
  ).filter((el) => el.offsetWidth > 0 && el.offsetHeight > 0 && getComputedStyle(el).visibility !== "hidden");
}

/**
 * Traps keyboard focus within a container element (useful for modal dialogs and mobile menus).
 */
export function handleTabFocusTrap(e: KeyboardEvent, container: HTMLElement | null): void {
  if (e.key !== "Tab" || !container) return;

  const focusables = getFocusableElements(container);
  if (focusables.length === 0) return;

  const firstEl = focusables[0];
  const lastEl = focusables[focusables.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstEl) {
      lastEl?.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastEl) {
      firstEl?.focus();
      e.preventDefault();
    }
  }
}

/**
 * Dynamically announces a message to screen readers via a live region.
 */
export function announceToScreenReader(message: string, politeness: "polite" | "assertive" = "polite"): void {
  if (typeof window === "undefined") return;

  let region = document.getElementById("a11y-live-region");
  if (!region) {
    region = document.createElement("div");
    region.id = "a11y-live-region";
    region.setAttribute("aria-live", politeness);
    region.setAttribute("aria-atomic", "true");
    region.className = "sr-only";
    document.body.appendChild(region);
  } else {
    region.setAttribute("aria-live", politeness);
  }

  region.textContent = "";
  setTimeout(() => {
    if (region) region.textContent = message;
  }, 100);
}
