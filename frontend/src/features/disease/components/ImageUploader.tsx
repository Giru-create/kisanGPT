// ─────────────────────────────────────────────────────────────────────────────
// ImageUploader.tsx
// KisanGPT — Camera + gallery upload component
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, { useRef, useCallback } from "react";
import { Camera, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ImageUploaderProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileSelected,
  disabled = false,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelected(file);
        e.target.value = "";
      }
    },
    [onFileSelected],
  );

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
        aria-label="Upload image from gallery"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={handleChange}
        className="hidden"
        aria-label="Capture image with camera"
      />

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Button
          variant="outline"
          onClick={() => cameraInputRef.current?.click()}
          disabled={disabled}
          className="flex-1 flex items-center justify-center gap-2 h-12"
          aria-label="Take a photo with camera"
        >
          <Camera size={18} aria-hidden="true" />
          <span>Camera</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex-1 flex items-center justify-center gap-2 h-12"
          aria-label="Choose image from gallery"
        >
          <Upload size={18} aria-hidden="true" />
          <span>Gallery</span>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        JPEG, PNG, or WebP — max 10 MB
      </p>
    </div>
  );
};

ImageUploader.displayName = "ImageUploader";
