"use client";

import React, { useRef } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  active = true,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(containerRef, active);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};
