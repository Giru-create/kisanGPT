"use client";

// ─────────────────────────────────────────────────────────────────────────────
// SchemeDetailPanel.tsx
// KisanGPT — Government Scheme detail panel component
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  X,
  ExternalLink,
  Calendar,
  CheckCircle2,
  FileText,
  Users,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Scheme } from "../types/schemes.types";

interface SchemeDetailPanelProps {
  scheme: Scheme | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SchemeDetailPanel: React.FC<SchemeDetailPanelProps> = ({
  scheme,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !scheme) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-label={`Scheme details: ${scheme.title}`}
        className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-card border-l border-border shadow-xl overflow-y-auto"
      >
        <div className="flex flex-col gap-5 p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-extrabold text-foreground">
                  {scheme.title}
                </h2>
                <Badge
                  variant={
                    scheme.statusBadge === "Eligible" ? "success" : "warning"
                  }
                  className="text-xs font-bold"
                >
                  {scheme.statusBadge}
                </Badge>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {scheme.category}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-accent min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close scheme details"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {/* Summary */}
          <p className="text-sm text-foreground leading-relaxed">
            {scheme.description}
          </p>

          {/* Benefit */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <CheckCircle2
              size={18}
              className="text-primary shrink-0"
              aria-hidden="true"
            />
            <span className="text-sm font-bold text-primary">
              {scheme.benefitAmount}
            </span>
          </div>

          {/* Eligibility */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Users
                size={16}
                className="text-muted-foreground shrink-0"
                aria-hidden="true"
              />
              <h3 className="text-sm font-extrabold text-foreground">
                Eligibility
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-6">
              {scheme.eligibility}
            </p>
          </div>

          {/* Benefits */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={16}
                className="text-muted-foreground shrink-0"
                aria-hidden="true"
              />
              <h3 className="text-sm font-extrabold text-foreground">
                Benefits
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-6">
              {scheme.benefits}
            </p>
          </div>

          {/* Required Documents */}
          {scheme.requiredDocuments.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <FileText
                  size={16}
                  className="text-muted-foreground shrink-0"
                  aria-hidden="true"
                />
                <h3 className="text-sm font-extrabold text-foreground">
                  Required Documents
                </h3>
              </div>
              <ul className="list-disc list-inside pl-6 text-sm text-muted-foreground space-y-1">
                {scheme.requiredDocuments.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Application Process */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ArrowRight
                size={16}
                className="text-muted-foreground shrink-0"
                aria-hidden="true"
              />
              <h3 className="text-sm font-extrabold text-foreground">
                How to Apply
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-6">
              {scheme.applicationProcess}
            </p>
          </div>

          {/* Deadline */}
          {scheme.deadline && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <Calendar
                size={16}
                className="text-amber-600 shrink-0"
                aria-hidden="true"
              />
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-500">
                Deadline: {scheme.deadline}
              </span>
            </div>
          )}

          {/* Official Link */}
          {scheme.officialLink && (
            <a
              href={scheme.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-bold text-primary hover:underline min-h-[44px]"
            >
              Visit Official Website{" "}
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </>
  );
};

SchemeDetailPanel.displayName = "SchemeDetailPanel";
