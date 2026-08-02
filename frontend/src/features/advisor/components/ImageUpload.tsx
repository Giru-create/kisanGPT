"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Camera,
  X,
  ImageIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface ImageUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (file: File) => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  isOpen,
  onClose,
  onImageSelect,
  isUploading = false,
  uploadProgress = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useFocusTrap(containerRef, isOpen);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, handleEscape]);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be less than 10MB");
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    },
    [onImageSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
      e.target.value = "";
    },
    [handleFile],
  );

  const handleClose = useCallback(() => {
    setPreview(null);
    setError(null);
    onClose();
  }, [onClose]);

  const handleRemovePreview = useCallback(() => {
    setPreview(null);
    setError(null);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Upload image"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-6 right-6 p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
            aria-label="Close image upload"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center gap-6 max-w-md w-full px-6">
            <h2 className="text-xl font-bold text-foreground">Upload Image</h2>

            {/* Preview */}
            {preview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full rounded-xl overflow-hidden border border-border"
              >
                <Image
                  src={preview}
                  alt="Upload preview"
                  width={640}
                  height={256}
                  className="w-full h-64 object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={handleRemovePreview}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-foreground transition-colors"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
                {isUploading && (
                  <div className="absolute inset-0 bg-background/60 flex flex-col items-center justify-center gap-3">
                    <Loader2 size={32} className="text-primary animate-spin" />
                    <div className="w-48 h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Uploading... {uploadProgress}%
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-sm"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {/* Drop Zone */}
            {!preview && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/30",
                )}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    fileInputRef.current?.click();
                  }
                }}
                aria-label="Drop image here or click to browse"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                  <Upload size={28} className="text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    Drop image here or{" "}
                    <span className="text-primary">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 w-full">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-hidden="true"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
                aria-hidden="true"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm font-medium text-foreground"
              >
                <ImageIcon size={18} />
                Browse
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm font-medium text-foreground"
              >
                <Camera size={18} />
                Camera
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ImageUpload.displayName = "ImageUpload";
