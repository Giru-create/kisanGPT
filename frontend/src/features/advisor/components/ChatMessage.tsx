"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ChatMessage.tsx
// KisanGPT — Chat message bubble component (user & assistant)
// Supports markdown, tables, lists, response cards, citations, confidence
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  ChevronDown,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ResponseCard } from "./ResponseCard";
import type { ChatMessage as ChatMessageType } from "../types/advisor.types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isThinkingOpen, setIsThinkingOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  if (message.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-end gap-1.5"
      >
        {message.imagePreview && (
          <div className="rounded-2xl rounded-tr-none overflow-hidden border border-border max-w-[280px]">
            <img
              src={message.imagePreview}
              alt="Uploaded image"
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        <div className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground px-2">
          {message.timestamp}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-4 group"
    >
      {/* AI Avatar */}
      <div
        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 shadow-md"
        aria-hidden="true"
      >
        <Brain size={20} className="text-primary" />
      </div>

      <div className="flex-1 space-y-3 min-w-0">
        {/* Thinking Block */}
        {message.thinkingSteps && message.thinkingSteps.length > 0 && (
          <details
            className="border border-border rounded-xl overflow-hidden bg-muted/30"
            open={isThinkingOpen}
            onToggle={(e) =>
              setIsThinkingOpen((e.target as HTMLDetailsElement).open)
            }
          >
            <summary className="flex items-center justify-between px-4 py-2.5 cursor-pointer list-none hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Brain size={16} className="text-primary animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">
                  Reasoning with KisanGPT AI...
                </span>
              </div>
              <ChevronDown
                size={16}
                className={cn(
                  "text-muted-foreground transition-transform",
                  isThinkingOpen && "rotate-180",
                )}
              />
            </summary>
            <div className="px-4 py-3 text-xs text-muted-foreground border-t border-border space-y-1.5 bg-background">
              {message.thinkingSteps.map((step) => (
                <p key={step.id}>{step.text}</p>
              ))}
            </div>
          </details>
        )}

        {/* Confidence Badge */}
        {message.confidence !== undefined && message.confidence > 0 && (
          <div className="flex items-center gap-2">
            <Badge
              variant={
                message.confidence >= 80
                  ? "success"
                  : message.confidence >= 60
                    ? "warning"
                    : "error"
              }
              className="text-[10px]"
            >
              {message.confidence}% confidence
            </Badge>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-3 text-foreground leading-relaxed text-sm">
          {message.content.split("\n\n").map((paragraph, i) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            // Detect markdown table
            if (trimmed.includes("|") && trimmed.startsWith("|")) {
              return <MarkdownTable key={i} content={trimmed} />;
            }

            // Detect markdown list
            if (
              trimmed.startsWith("- ") ||
              trimmed.startsWith("* ") ||
              /^\d+\.\s/.test(trimmed)
            ) {
              return <MarkdownList key={i} content={trimmed} />;
            }

            return (
              <p
                key={i}
                dangerouslySetInnerHTML={{ __html: formatContent(trimmed) }}
              />
            );
          })}
        </div>

        {/* Response Cards */}
        {message.responseCards && message.responseCards.length > 0 && (
          <div className="space-y-3">
            {message.responseCards.map((card, i) => (
              <ResponseCard key={i} data={card} />
            ))}
          </div>
        )}

        {/* Recommended Actions */}
        {message.recommendedActions &&
          message.recommendedActions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {message.recommendedActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                >
                  <CheckCircle2 size={12} />
                  {action.label}
                </button>
              ))}
            </div>
          )}

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {message.sources.map((source) => (
              <div key={source.id} className="group/tip relative">
                <span className="bg-muted px-2.5 py-1 rounded text-xs font-bold text-primary cursor-help border border-border">
                  Source: {source.title}
                </span>
                <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-foreground text-background text-xs rounded shadow-xl opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-50">
                  {source.tooltip}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "p-1.5 rounded-md min-h-[32px] min-w-[32px] flex items-center justify-center transition-colors",
              isCopied
                ? "text-emerald-500"
                : "text-muted-foreground hover:text-primary",
            )}
            aria-label={isCopied ? "Copied" : "Copy message"}
          >
            {isCopied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={cn(
              "p-1.5 rounded-md min-h-[32px] min-w-[32px] flex items-center justify-center transition-colors",
              isSaved
                ? "text-primary"
                : "text-muted-foreground hover:text-primary",
            )}
            aria-label={isSaved ? "Saved" : "Save response"}
          >
            <Bookmark size={16} />
          </button>
          <button
            type="button"
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md min-h-[32px] min-w-[32px] flex items-center justify-center"
            aria-label="Mark as helpful"
            disabled
            title="Feedback coming soon"
          >
            <ThumbsUp size={16} />
          </button>
          <button
            type="button"
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md min-h-[32px] min-w-[32px] flex items-center justify-center"
            aria-label="Mark as not helpful"
            disabled
            title="Feedback coming soon"
          >
            <ThumbsDown size={16} />
          </button>
          <button
            type="button"
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md min-h-[32px] min-w-[32px] flex items-center justify-center"
            aria-label="Share response"
            disabled
            title="Share coming soon"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Markdown Helpers
// ---------------------------------------------------------------------------

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatContent(text: string): string {
  let formatted = escapeHtml(text);

  // Bold: **text**
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Inline code: `text`
  formatted = formatted.replace(
    /`(.*?)`/g,
    '<code class="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">$1</code>',
  );

  // Line breaks
  formatted = formatted.replace(/\n/g, "<br/>");

  return formatted;
}

function MarkdownTable({ content }: { content: string }) {
  const lines = content.split("\n").filter((l) => l.trim());
  if (lines.length < 2) {
    return <p className="text-sm">{content}</p>;
  }

  const parseRow = (row: string) =>
    row
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell !== "");

  const headers = parseRow(lines[0]!);
  const dataLines = lines.slice(2); // skip separator

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-muted/50">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-3 py-2 text-left font-semibold text-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataLines.map((line, i) => {
            const cells = parseRow(line);
            return (
              <tr key={i} className="border-t border-border">
                {cells.map((cell, j) => (
                  <td key={j} className="px-3 py-2 text-muted-foreground">
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MarkdownList({ content }: { content: string }) {
  const lines = content.split("\n");
  const isOrdered = /^\d+\.\s/.test(lines[0] ?? "");
  const Tag = isOrdered ? "ol" : "ul";

  return (
    <Tag
      className={cn(
        "space-y-1 text-sm",
        isOrdered ? "list-decimal list-inside" : "list-disc list-inside",
      )}
    >
      {lines.map((line, i) => {
        const text = line.replace(/^[-*]\s|^\d+\.\s/, "");
        return (
          <li key={i} className="text-foreground">
            <span dangerouslySetInnerHTML={{ __html: formatContent(text) }} />
          </li>
        );
      })}
    </Tag>
  );
}

ChatMessage.displayName = "ChatMessage";
