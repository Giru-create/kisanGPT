/**
 * KisanGPT Design System - Animation Presets
 * Standardized Framer Motion configurations for consistent motion across the app.
 */

export const motionPresets = {
  /** Fade in from below - used for page/section entrance */
  fadeInUp: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  /** Fade in from above */
  fadeInDown: {
    initial: { opacity: 0, y: -16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  /** Simple fade in - used for content appearing */
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },

  /** Fade in from left - used for settings category switches */
  fadeInLeft: {
    initial: { opacity: 0, x: -12 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 12 },
    transition: { duration: 0.3 },
  },

  /** Scale in - used for dialogs/modals */
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  },

  /** Card hover effect */
  cardHover: {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.01,
      y: -2,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  },

  /** Stagger children container */
  staggerContainer: {
    variants: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
      },
    },
    initial: "hidden",
    animate: "show",
  },

  /** Stagger children item (pairs with staggerContainer) */
  staggerItem: {
    variants: {
      hidden: { opacity: 0, y: 16 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
      },
    },
  },

  /** Loading skeleton fade */
  skeletonFade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },

  /** Error state entrance */
  errorEntrance: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25 },
  },
} as const;

export type MotionPreset = (typeof motionPresets)[keyof typeof motionPresets];
