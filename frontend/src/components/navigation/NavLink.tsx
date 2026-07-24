"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  activeClassName?: string;
  exact?: boolean;
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  className,
  activeClassName = "bg-accent text-accent-foreground font-semibold border-l-4 border-primary pl-3",
  exact = true,
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
        "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent/50 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none",
        isActive ? activeClassName : "text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};
