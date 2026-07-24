import React from "react";
import { cn } from "@/lib/utils";

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: React.ElementType;
}

export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  as: Component = "span",
  className,
  children,
  ...props
}) => {
  return (
    <Component className={cn("sr-only", className)} {...props}>
      {children}
    </Component>
  );
};
