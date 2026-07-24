import React from "react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  isDisabled?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}
