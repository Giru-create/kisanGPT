import { NavItem, NavSection } from "@/types/navigation";

export const MAIN_NAV_ITEMS: NavItem[] = [
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
];

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Foundation Modules",
    items: MAIN_NAV_ITEMS,
  },
];
