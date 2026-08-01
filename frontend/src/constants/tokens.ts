/**
 * KisanGPT Design System Tokens
 *
 * Single source of truth for all design decisions.
 * Components should consume these via Tailwind utilities or CSS variables.
 *
 * Usage:
 *   import { spacing, radii, typography, animation, iconSizes } from "@/constants/tokens";
 */

// ---------------------------------------------------------------------------
// Spacing (8px grid)
// ---------------------------------------------------------------------------

export const spacing = {
  0: "0px",
  0.5: "2px",
  1: "4px",
  1.5: "6px",
  2: "8px",
  2.5: "10px",
  3: "12px",
  3.5: "14px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px",
} as const;

// ---------------------------------------------------------------------------
// Border Radius
// ---------------------------------------------------------------------------

export const radii = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "20px",
  "3xl": "24px",
  full: "9999px",
} as const;

// Standard radius per component
export const componentRadii = {
  button: radii.lg,
  input: radii.lg,
  card: radii["2xl"],
  badge: radii.full,
  chip: radii.full,
  avatar: radii.full,
  dialog: radii.lg,
  skeleton: radii.md,
  iconContainer: {
    sm: radii.lg,
    md: radii.xl,
    lg: radii["2xl"],
  },
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const typography = {
  fontFamily: {
    sans: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    mono: "var(--font-sans, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace)",
  },
  fontSize: {
    "2xs": ["0.625rem", { lineHeight: "0.875rem" }], // 10px
    xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
    sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
    base: ["1rem", { lineHeight: "1.5rem" }], // 16px
    lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
    xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
    "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

// Standard typography per context
export const typographyScale = {
  // Page titles
  pageTitle: { size: "xl" as const, weight: "bold" as const },
  // Page subtitles
  pageSubtitle: { size: "xs" as const, weight: "normal" as const },
  // Section headings
  sectionHeading: { size: "lg" as const, weight: "semibold" as const },
  // Card titles
  cardTitle: { size: "base" as const, weight: "semibold" as const },
  // Card descriptions
  cardDescription: { size: "sm" as const, weight: "normal" as const },
  // Stat values (big numbers)
  statValue: { size: "3xl" as const, weight: "bold" as const },
  // Stat labels
  statLabel: { size: "xs" as const, weight: "medium" as const },
  // Micro labels (inside badges, pills)
  microLabel: { size: "2xs" as const, weight: "semibold" as const },
  // Button text
  buttonText: {
    sm: { size: "sm" as const, weight: "medium" as const },
    md: { size: "base" as const, weight: "medium" as const },
    lg: { size: "lg" as const, weight: "semibold" as const },
  },
} as const;

// ---------------------------------------------------------------------------
// Shadows
// ---------------------------------------------------------------------------

export const shadows = {
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
} as const;

// Standard shadow per component
export const componentShadows = {
  card: shadows.sm,
  cardHover: shadows.md,
  button: shadows.sm,
  dropdown: shadows.lg,
  dialog: shadows.lg,
  skeleton: "none",
} as const;

// ---------------------------------------------------------------------------
// Z-Index
// ---------------------------------------------------------------------------

export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  header: 1200,
  overlay: 1300,
  modal: 1400,
  tooltip: 1500,
} as const;

// ---------------------------------------------------------------------------
// Animation (Framer Motion durations in seconds)
// ---------------------------------------------------------------------------

export const animation = {
  duration: {
    instant: 0.1,
    fast: 0.15,
    normal: 0.2,
    medium: 0.3,
    slow: 0.4,
    slower: 0.5,
  },
  easing: {
    easeOut: "easeOut",
    easeInOut: "easeInOut",
    easeIn: "easeIn",
    spring: [0.22, 1, 0.36, 1],
  },
  stagger: {
    children: 0.06,
    fast: 0.04,
    normal: 0.06,
    slow: 0.08,
  },
  entrance: {
    y: 16,
    x: 12,
    scale: 0.95,
  },
} as const;

// ---------------------------------------------------------------------------
// Icon Sizes (for lucide-react size prop)
// ---------------------------------------------------------------------------

export const iconSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
} as const;

// Standard icon size per context
export const iconSizeByContext = {
  badge: iconSizes.xs,
  inlineAction: iconSizes.sm,
  buttonLeft: iconSizes.md,
  buttonRight: iconSizes.md,
  cardIcon: iconSizes.xl,
  heroIcon: iconSizes.xl,
  errorState: iconSizes["3xl"],
  sectionIcon: iconSizes.lg,
} as const;

// ---------------------------------------------------------------------------
// Touch Targets (WCAG 2.1 AA)
// ---------------------------------------------------------------------------

export const touchTargets = {
  sm: "36px",
  md: "40px",
  lg: "44px",
} as const;

// ---------------------------------------------------------------------------
// Content Widths
// ---------------------------------------------------------------------------

export const contentWidths = {
  /** Standard pages (weather, market, schemes, etc.) */
  page: "max-w-2xl",
  /** Dashboard with grid layout */
  dashboard: "max-w-7xl",
  /** Dialogs and modals */
  dialog: "max-w-md",
  /** Full width */
  full: "max-w-full",
} as const;

// ---------------------------------------------------------------------------
// Section Spacing
// ---------------------------------------------------------------------------

export const sectionSpacing = {
  /** Gap between page sections */
  page: "gap-5",
  /** Gap between dashboard sections */
  dashboard: "gap-8",
  /** Margin below section headers */
  headerMargin: "mb-5",
  /** Gap between items in a list/grid */
  grid: "gap-4",
} as const;
