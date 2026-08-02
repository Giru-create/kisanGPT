import { NavItem, NavSection } from "@/types/navigation";
import {
  LayoutDashboard,
  Brain,
  CloudSun,
  TrendingUp,
  Leaf,
  Shield,
  Mic,
  BookHeart,
  User,
  Settings,
} from "lucide-react";

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "advisor",
    label: "AI Advisor",
    href: "/advisor",
    icon: Brain,
  },
  {
    id: "weather",
    label: "Weather Intelligence",
    href: "/weather",
    icon: CloudSun,
  },
  {
    id: "market",
    label: "Market Intelligence",
    href: "/market",
    icon: TrendingUp,
  },
  {
    id: "disease",
    label: "Disease Detection",
    href: "/disease",
    icon: Leaf,
  },
  {
    id: "schemes",
    label: "Government Schemes",
    href: "/schemes",
    icon: Shield,
  },
  {
    id: "voice",
    label: "Voice Assistant",
    href: "/voice",
    icon: Mic,
  },
  {
    id: "memory",
    label: "Farm Memory",
    href: "/memory",
    icon: BookHeart,
  },
  {
    id: "profile",
    label: "Farmer Profile",
    href: "/profile",
    icon: User,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Navigation",
    items: MAIN_NAV_ITEMS,
  },
];
