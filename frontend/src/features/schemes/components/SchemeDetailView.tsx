"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  X,
  ExternalLink,
  Calendar,
  CheckCircle2,
  FileText,
  Users,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  MOCK_ELIGIBILITY_CHECKLIST,
  MOCK_FAQS,
  SCHEME_CATEGORY_CONFIG,
} from "../constants/schemes.constants";
import type { Scheme } from "../types/schemes.types";

interface SchemeDetailViewProps {
  scheme: Scheme | null;
  isOpen: boolean;
  onClose: () => void;
  onApply?: (scheme: Scheme) => void;
  onSave?: (scheme: Scheme) => void;
}

export const SchemeDetailView: React.FC<SchemeDetailViewProps> = ({
  scheme,
  isOpen,
  onClose,
  onApply,
  onSave,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedFaq, setExpandedFaq] = React.useState<string | null>(null);

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
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, handleEscape]);

  if (!isOpen || !scheme) return null;

  const categoryCfg = SCHEME_CATEGORY_CONFIG[scheme.category];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`scheme-title-${scheme.id}`}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-card border-l border-border shadow-xl overflow-y-auto"
      >
        <div className="flex flex-col gap-5 p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  id={`scheme-title-${scheme.id}`}
                  className="text-lg font-extrabold text-foreground"
                >
                  {scheme.title}
                </h2>
                <Badge
                  variant={
                    scheme.statusBadge === "Eligible"
                      ? "success"
                      : scheme.statusBadge === "Action Needed"
                        ? "warning"
                        : scheme.statusBadge === "Approved"
                          ? "success"
                          : scheme.statusBadge === "Closed"
                            ? "error"
                            : "info"
                  }
                  className="text-xs font-bold"
                >
                  {scheme.statusBadge}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {categoryCfg && (
                  <Badge
                    className={cn(
                      "text-[10px]",
                      categoryCfg.color,
                      categoryCfg.bg,
                    )}
                  >
                    {categoryCfg.label}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {scheme.schemeType?.replace("_", " ")}
                </span>
              </div>
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
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <CheckCircle2
              size={18}
              className="text-emerald-600 shrink-0"
              aria-hidden="true"
            />
            <div>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                {scheme.benefitAmount}
              </span>
              <p className="text-[10px] text-muted-foreground">
                Estimated benefit
              </p>
            </div>
          </div>

          {/* AI Eligibility check */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                <CheckCircle2 size={12} className="text-primary" />
              </div>
              <span className="text-xs font-semibold text-foreground">
                AI Eligibility Check
              </span>
              <Badge variant="success" className="text-[9px] ml-auto">
                95% match
              </Badge>
            </div>
            <ul className="space-y-1.5">
              {MOCK_ELIGIBILITY_CHECKLIST.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2 text-xs"
                >
                  <CheckCircle2
                    size={12}
                    className={cn(
                      item.checked
                        ? "text-emerald-600"
                        : "text-muted-foreground",
                    )}
                  />
                  <span
                    className={
                      item.checked
                        ? "text-foreground"
                        : "text-muted-foreground line-through"
                    }
                  >
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
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
              <div className="pl-6 space-y-1.5">
                {scheme.requiredDocuments.map((doc) => (
                  <div key={doc} className="flex items-center gap-2 text-sm">
                    <CheckCircle2
                      size={10}
                      className="text-emerald-500 shrink-0"
                    />
                    <span className="text-muted-foreground">{doc}</span>
                  </div>
                ))}
              </div>
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

          {/* FAQs */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <HelpCircle
                size={16}
                className="text-muted-foreground shrink-0"
                aria-hidden="true"
              />
              <h3 className="text-sm font-extrabold text-foreground">
                Frequently Asked Questions
              </h3>
            </div>
            <div className="space-y-2 pl-6">
              {MOCK_FAQS.map((faq, i) => {
                const isExpanded = expandedFaq === `faq-${i}`;
                return (
                  <div key={i} className="rounded-xl border border-border">
                    <button
                      onClick={() =>
                        setExpandedFaq(isExpanded ? null : `faq-${i}`)
                      }
                      className="w-full flex items-center gap-2 p-2.5 text-left hover:bg-muted/50 transition-colors"
                      aria-expanded={isExpanded}
                    >
                      <span className="text-xs font-medium text-foreground flex-1">
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={12}
                        className={cn(
                          "text-muted-foreground transition-transform shrink-0",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>
                    {isExpanded && (
                      <div className="px-2.5 pb-2.5 pt-0">
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              onClick={() => onApply?.(scheme)}
              leftIcon={<ArrowRight size={14} />}
              className="flex-1 text-xs"
            >
              Apply Now
            </Button>
            <Button
              variant="outline"
              onClick={() => onSave?.(scheme)}
              leftIcon={<FileText size={14} />}
              className="text-xs"
            >
              Save
            </Button>
          </div>

          {/* Official Link */}
          {scheme.officialLink && (
            <a
              href={scheme.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-bold text-primary hover:underline min-h-[44px] rounded-xl border border-primary/20 bg-primary/5"
            >
              <Link2 size={14} aria-hidden="true" />
              Visit Official Website
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          )}
        </div>
      </motion.div>
    </>
  );
};

SchemeDetailView.displayName = "SchemeDetailView";
