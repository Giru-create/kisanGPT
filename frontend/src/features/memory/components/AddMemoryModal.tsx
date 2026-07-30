// ─────────────────────────────────────────────────────────────────────────────
// AddMemoryModal.tsx
// KisanGPT — Accessible Modal Form to Log New Farm Memory Record
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Plus, Save } from "lucide-react";
import { MEMORY_CATEGORIES } from "../constants/memory.constants";
import type { AddMemoryInput, MemoryCategory } from "../types/memory.types";

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddMemoryInput) => Promise<boolean>;
}

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [category, setCategory] =
    useState<Exclude<MemoryCategory, "all">>("soil");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cropName, setCropName] = useState("");
  const [season, setSeason] = useState("Kharif 2026");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    const success = await onSubmit({
      category,
      title: title.trim(),
      description: description.trim(),
      cropName: cropName.trim() || undefined,
      season,
    });
    setIsSubmitting(false);

    if (success) {
      setTitle("");
      setDescription("");
      setCropName("");
    }
  };

  const validCategories = MEMORY_CATEGORIES.filter((c) => c.id !== "all");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-memory-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-3xl bg-card border border-border/80 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Plus size={18} />
            </div>
            <h2
              id="add-memory-title"
              className="text-base font-bold text-foreground"
            >
              Add Farm Memory Record (नया रिकॉर्ड दर्ज करें)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">
              Category (श्रेणी)
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as Exclude<MemoryCategory, "all">)
              }
              className="w-full px-3.5 py-2.5 rounded-2xl bg-muted/50 border border-border/60 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
            >
              {validCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label} ({cat.labelHi})
                </option>
              ))}
            </select>
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">
              Title (शीर्षक) *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Soil NPK Test Result or Drip Irrigation Log"
              className="w-full px-4 py-2.5 rounded-2xl bg-muted/50 border border-border/60 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
            />
          </div>

          {/* Crop & Season Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">
                Crop (फसल)
              </label>
              <input
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="Wheat / Paddy / Mustard"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-muted/50 border border-border/60 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">
                Season (मौसम)
              </label>
              <input
                type="text"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                placeholder="Kharif 2026"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-muted/50 border border-border/60 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
              />
            </div>
          </div>

          {/* Description Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">
              Details & Notes (विवरण) *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter detailed observations, doses applied, yield harvested, or disease symptoms..."
              className="w-full px-4 py-2.5 rounded-2xl bg-muted/50 border border-border/60 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[44px]"
            >
              <Save size={16} />
              <span>{isSubmitting ? "Saving..." : "Save Memory"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddMemoryModal.displayName = "AddMemoryModal";
