"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavLinkProps extends React.ComponentPropsWithoutRef<
  typeof Link
> {
  activeClassName?: string;
  exact?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  className,
  activeClassName = "bg-primary/10 text-primary font-semibold",
  exact = true,
  icon: Icon,
  children,
  ...props
}) => {
  const pathname = usePathname();
  const hrefString = typeof href === "string" ? href : href.pathname || "";

  const isActive = exact
    ? pathname === hrefString
    : pathname?.startsWith(hrefString);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
        "hover:bg-accent/60 hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "select-none min-h-[44px]",
        isActive
          ? activeClassName
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      {Icon && (
        <span className="flex shrink-0 items-center justify-center">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <span className="truncate">{children}</span>
    </Link>
  );
};
