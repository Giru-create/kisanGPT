// ─────────────────────────────────────────────────────────────────────────────
// ImagePreview.tsx
// KisanGPT — Selected image thumbnail preview
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ImagePreviewProps {
  src: string;
  fileName?: string;
  onRemove?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  fileName,
  onRemove,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative inline-flex flex-col items-center gap-2",
        className,
      )}
    >
      <div className="relative rounded-xl overflow-hidden border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={fileName ?? "Selected plant image"}
          className="w-48 h-48 object-cover sm:w-56 sm:h-56"
        />

        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-background/80 hover:bg-background"
            aria-label="Remove selected image"
          >
            <X size={14} aria-hidden="true" />
          </Button>
        )}
      </div>

      {fileName && (
        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
          {fileName}
        </p>
      )}
    </div>
  );
};

ImagePreview.displayName = "ImagePreview";
