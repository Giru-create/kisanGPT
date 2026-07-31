"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FolderOpen,
  Upload,
  CheckCircle2,
  Trash2,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DOCUMENT_TYPE_CONFIG } from "../constants/profile.constants";
import type { FarmDocument } from "../types/profile.types";

interface DocumentsProps {
  documents: FarmDocument[];
  onUpload?: () => void;
  onDelete?: (id: string) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const Documents: React.FC<DocumentsProps> = ({
  documents,
  onUpload,
  onDelete,
}) => {
  return (
    <motion.section
      role="region"
      aria-label="Farm Documents"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <FolderOpen size={16} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Documents</h2>
            <p className="text-[10px] text-muted-foreground">
              {documents.length} files
            </p>
          </div>
        </div>
        {onUpload && (
          <button
            onClick={onUpload}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors min-h-[36px]"
          >
            <Upload size={14} />
            Upload
          </button>
        )}
      </div>

      {/* Document list */}
      <div className="space-y-2">
        {documents.map((doc, idx) => {
          const typeCfg = DOCUMENT_TYPE_CONFIG[doc.type];
          const expiry = doc.expiryDate
            ? new Date(doc.expiryDate).toLocaleDateString("en-IN", {
                month: "short",
                year: "numeric",
              })
            : null;

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.03 }}
              className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/20 transition-all group"
            >
              <div
                className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 text-sm",
                  typeCfg?.bg ?? "bg-muted",
                )}
              >
                {typeCfg?.icon ?? "📄"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {doc.name}
                  </p>
                  {doc.isVerified && (
                    <CheckCircle2
                      size={12}
                      className="text-emerald-500 shrink-0"
                    />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-muted-foreground">
                    {formatFileSize(doc.fileSize)}
                  </span>
                  <span className="text-[9px] text-muted-foreground">
                    Uploaded{" "}
                    {new Date(doc.uploadedAt).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {expiry && (
                    <span className="text-[9px] text-amber-600">
                      Expires {expiry}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  aria-label={`Download ${doc.name}`}
                >
                  <Download size={13} />
                </button>
                {onDelete && (
                  <button
                    onClick={() => onDelete(doc.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600"
                    aria-label={`Delete ${doc.name}`}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

Documents.displayName = "Documents";
