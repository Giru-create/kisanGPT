---
name: Agro-Precision Narrative
colors:
  surface: '#f7f9ff'
  surface-dim: '#cbdcef'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf4ff'
  surface-container: '#e3efff'
  surface-container-high: '#d9eafe'
  surface-container-highest: '#d3e4f8'
  on-surface: '#0c1d2b'
  on-surface-variant: '#3f4941'
  inverse-surface: '#223241'
  inverse-on-surface: '#e8f2ff'
  outline: '#6f7a70'
  outline-variant: '#bec9be'
  surface-tint: '#006d3e'
  primary: '#006036'
  on-primary: '#ffffff'
  primary-container: '#1b7a4a'
  on-primary-container: '#abffc6'
  inverse-primary: '#80d9a0'
  secondary: '#006d3d'
  on-secondary: '#ffffff'
  secondary-container: '#97f3b5'
  on-secondary-container: '#047240'
  tertiary: '#005f41'
  on-tertiary: '#ffffff'
  tertiary-container: '#007a55'
  on-tertiary-container: '#a3ffd2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9cf6ba'
  primary-fixed-dim: '#80d9a0'
  on-primary-fixed: '#00210f'
  on-primary-fixed-variant: '#00522e'
  secondary-fixed: '#9af6b8'
  secondary-fixed-dim: '#7ed99e'
  on-secondary-fixed: '#00210f'
  on-secondary-fixed-variant: '#00522d'
  tertiary-fixed: '#5ffdbd'
  tertiary-fixed-dim: '#3ae0a3'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f7f9ff'
  on-background: '#0c1d2b'
  surface-variant: '#d3e4f8'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  caption-xs:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered to bridge the gap between high-performance AI and the tactile reality of modern agriculture. It targets a demographic that ranges from tech-savvy agribusiness owners to progressive smallholder farmers, requiring a UI that feels both sophisticated and accessible.

The aesthetic follows a **Modern Corporate** direction, borrowing the precision and clarity of tools like Linear or Stripe. It avoids "folk" or "cartoonish" tropes often associated with rural tech, opting instead for a technical, data-driven language. The emotional response is one of **rigor, growth, and stability**. Every element is designed to feel intentional and reliable, using generous whitespace and a systematic approach to density to ensure clarity under varying field conditions.

## Colors

This design system utilizes a palette of deep, botanical greens paired with technical grays to signal "Growth + Intelligence." 

- **Primary & Secondary:** Deep Green (#1B7A4A) and Forest Green (#2E8B57) serve as the foundation for the brand identity, used for key actions and branding elements.
- **Accent:** Emerald (#00C98E) is reserved for "success" states, growth indicators, and highlighting AI-driven insights.
- **Support:** Earth Brown (#8B5A3C) provides a natural anchor, used sparingly for specific data categories or secondary highlights to keep the UI grounded.
- **Backgrounds:** The light mode uses a warm Off-White (#F5F3EF) to reduce eye strain in outdoor light, while Dark Mode utilizes a Premium Charcoal (#1C1F26) to maintain depth and high contrast for technical data analysis.

## Typography

The typography system is built on **Inter**, chosen for its mathematical precision and exceptional legibility on digital screens. For multi-language support (Hindi, Tamil, Telugu, etc.), the system seamlessly integrates **Noto Sans**, ensuring a consistent vertical rhythm and weight across different scripts.

Hierarchy is strictly enforced through weight and color (using Slate Gray for secondary text) rather than just size. Headlines use tighter letter spacing for a more "designed" editorial feel, while body text maintains standard spacing for high readability in dense data contexts. Labels and captions are set in medium weights to ensure they remain legible even at small sizes on mobile devices.

## Layout & Spacing

The design system employs a **Fluid-Fixed Hybrid Grid**. For desktop, it follows a 12-column grid with a maximum content width of 1440px. For mobile, it transitions to a 4-column fluid grid.

The spacing rhythm is based on a **4px base unit**. All padding and margins must be multiples of 4 (4, 8, 16, 24, 32, 48, 64). 
- **Generous Margins:** Content containers use 24px or 32px internal padding to maintain the "Premium" feel.
- **Sectioning:** Vertical rhythm is maintained by using 64px (3xl) spacing between major sections and 32px (xl) between related content groups.
- **Data Density:** In data-heavy tables or dashboards, spacing can be compressed to 8px (sm) to allow for more information visibility, provided high contrast is maintained.

## Elevation & Depth

To achieve the "Modern AI" aesthetic, depth is conveyed through **Tonal Layers** and **Ambient Shadows**.

- **Surfaces:** In light mode, the primary background is #F5F3EF. Secondary surfaces (cards, sidebars) use pure white (#FFFFFF) to pop forward.
- **Shadows:** Shadows are highly diffused and low-opacity. Use a "soft-depth" approach: `0 4px 20px rgba(27, 122, 74, 0.06)`. This subtle green tint in the shadow keeps the interface feeling organic rather than synthetic.
- **Dividers:** Use low-contrast 1px borders in #E5E7EB instead of heavy shadows for layout separation. This keeps the interface clean and "Linear-like."
- **Focus:** Active states use a 2px offset ring in Emerald (#00C98E) to provide clear interactive feedback.

## Shapes

The shape language is consistently **Rounded** (8px / 0.5rem) to strike a balance between professional geometry and approachable warmth. 

- **Standard Elements:** Buttons, input fields, and small cards use the base 8px (0.5rem) radius.
- **Large Containers:** Dashboard widgets and primary content sections use the `rounded-lg` (16px / 1rem) radius to define clear containment.
- **Interactive Indicators:** Small badges and tags use a fully rounded (pill) shape to distinguish them from actionable buttons.

## Components

### Buttons
- **Primary:** Solid Deep Green (#1B7A4A) with white text. 8px radius. Subtle scale-down effect on click.
- **Secondary:** Ghost style with Deep Green border and text. 
- **AI-Action:** Emerald (#00C98E) background with a subtle glow shadow to indicate an intelligent process.

### Cards
- White background, 16px radius, and a 1px border (#E5E7EB).
- Header sections within cards should have a subtle background tint of #F9FAFB.

### Inputs
- Bordered style with 8px radius. Label is always persistent in Slate Gray (#5D6D7E).
- Active state: Border transitions to Deep Green with a 2px soft Emerald outer glow.

### Chips & Badges
- Used for crop types (e.g., "Wheat", "Rice") or status.
- Soft background colors (10% opacity of the category color) with 100% opacity text.

### Data Tables
- Minimalist design. Header text in all-caps Caption-XS with increased letter spacing.
- Row hover states use a subtle #F9FAFB background change.

### Specialized Ag-Tech Components
- **Soil Health Gauge:** Uses the accent colors (Brown to Emerald) in a semi-circle track.
- **Weather Timeline:** A horizontal scrolling list with custom-drawn, minimal weather icons (no shadows, 2px stroke).
- **AI Chat Interface:** Minimalist bubble style with an "AI Pulse" indicator using the Emerald accent.