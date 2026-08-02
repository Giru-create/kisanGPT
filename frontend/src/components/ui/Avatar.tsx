import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: 32, md: 40, lg: 48 };

export const Avatar: React.FC<AvatarProps> = React.memo(
  ({
    src,
    alt = "User Avatar",
    fallback,
    size = "md",
    className,
    ...props
  }) => {
    const sizeClasses = {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
    };
    const px = sizeMap[size];

    return (
      <div
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full bg-muted select-none items-center justify-center font-medium text-muted-foreground",
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={px}
            height={px}
            className="aspect-square h-full w-full object-cover"
            unoptimized
          />
        ) : (
          <span aria-label={alt}>{fallback.toUpperCase().slice(0, 2)}</span>
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";
