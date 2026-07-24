export type ComponentSize = "sm" | "md" | "lg";

export type VariantColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "ghost" | "outline";

export interface BaseComponentProps {
  id?: string;
  className?: string;
  children?: React.ReactNode;
}
