import { NavItem, NavSection } from "@/types/navigation";

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    id: "home",
    label: "Foundation Overview",
    href: "/",
  },
  {
    id: "components",
    label: "UI Components",
    href: "#components-section",
  },
  {
    id: "design-system",
    label: "Design System",
    href: "#design-tokens-section",
  },
  {
    id: "accessibility",
    label: "Accessibility",
    href: "#accessibility-section",
  },
  {
    id: "weather",
    label: "Weather Intelligence",
    href: "/weather",
  },
  {
    id: "disease",
    label: "Disease Detection",
    href: "/disease",
  },
  {
    id: "market",
    label: "Market Intelligence",
    href: "/market",
  },
  {
    id: "voice",
    label: "Voice Assistant",
    href: "/voice",
  },
];

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Foundation Modules",
    items: MAIN_NAV_ITEMS,
  },
];
