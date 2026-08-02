"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface ImageCaptureProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  className?: string;
}

export const ImageCapture: React.FC<ImageCaptureProps> = ({
  onFileSelected,
  disabled = false,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (disabled) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      onFileSelected(file);
    },
    [disabled, onFileSelected],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleFile(file);
      }
    },
    [disabled, handleFile],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const clearPreview = useCallback(() => {
    setPreview(null);
    setZoom(1);
  }, []);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Hidden inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
        aria-label="Take photo with camera"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
        aria-label="Choose image from gallery"
      />

      <AnimatePresence mode="wait">
        {preview ? (
          /* Preview mode */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            <div className="relative aspect-[4/3] bg-muted overflow-hidden">
              <Image
                src={preview}
                alt="Selected plant image"
                width={640}
                height={480}
                className="w-full h-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoom})` }}
                unoptimized
              />
              {/* Zoom controls */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  className="text-white/80 hover:text-white"
                  aria-label="Zoom out"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-white/80 text-xs min-w-[3ch] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  className="text-white/80 hover:text-white"
                  aria-label="Zoom in"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearPreview}
                leftIcon={<RotateCcw size={14} />}
                className="flex-1 text-xs"
              >
                Retake
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearPreview}
                leftIcon={<X size={14} />}
                className="text-xs text-destructive"
              >
                Remove
              </Button>
            </div>
          </motion.div>
        ) : (
          /* Upload mode */
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Drag & Drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30",
                disabled && "opacity-50 pointer-events-none",
              )}
            >
              <div className="flex flex-col items-center">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <ImageIcon
                    size={24}
                    className="text-primary"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  Drop a plant image here
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  or take a photo / choose from gallery
                </p>

                {/* Camera + Gallery buttons */}
                <div className="flex gap-2 w-full max-w-xs">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cameraInputRef.current?.click()}
                    leftIcon={<Camera size={14} />}
                    className="flex-1 text-xs"
                    disabled={disabled}
                  >
                    Camera
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => galleryInputRef.current?.click()}
                    leftIcon={<Upload size={14} />}
                    className="flex-1 text-xs"
                    disabled={disabled}
                  >
                    Gallery
                  </Button>
                </div>

                <p className="text-[10px] text-muted-foreground mt-3">
                  JPEG, PNG, or WebP — max 10 MB
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ImageCapture.displayName = "ImageCapture";
