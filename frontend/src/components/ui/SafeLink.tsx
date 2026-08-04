"use client";

import React from "react";

interface SafeLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  /** Open in new tab with security noopener/noreferrer. Defaults to true for external links. */
  external?: boolean;
}

const EXTERNAL_PATTERN = /^https?:\/\//;

export function SafeLink({ href, children, external, ...rest }: SafeLinkProps) {
  const isExternal = external ?? EXTERNAL_PATTERN.test(href);

  const secureProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a href={href} {...secureProps} {...rest}>
      {children}
    </a>
  );
}
