/**
 * KisanGPT Design System - Icon Constants
 * Standardized icon sizes and container configurations.
 */

export const iconSizes = {
  /** 12px - Inline badges, micro labels */
  xs: 12,
  /** 14px - Small action icons, card links */
  sm: 14,
  /** 16px - Default icons, button icons, card icons */
  md: 16,
  /** 18px - Section icons, navigation */
  lg: 18,
  /** 20px - Hero icons, featured cards */
  xl: 20,
  /** 24px - Large feature icons */
  "2xl": 24,
  /** 32px - Error states, large displays */
  "3xl": 32,
} as const;

export const iconContainers = {
  /** w-8 h-8 rounded-lg - Inline with text, small cards */
  sm: "w-8 h-8 rounded-lg",
  /** w-10 h-10 rounded-xl - Card headers, feature icons */
  md: "w-10 h-10 rounded-xl",
  /** w-12 h-12 rounded-2xl - Hero sections, large feature displays */
  lg: "w-12 h-12 rounded-2xl",
} as const;

export const iconContainerColors = {
  primary: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  error: "bg-red-500/10 text-red-600 dark:text-red-400",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  muted: "bg-muted/50 text-muted-foreground",
} as const;

export type IconSize = keyof typeof iconSizes;
export type IconContainerSize = keyof typeof iconContainers;
export type IconContainerColor = keyof typeof iconContainerColors;
