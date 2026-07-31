"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ResponseCard.tsx
// KisanGPT — Rich response card component for AI Advisor
// Renders weather, market, disease, government scheme, checklist, action plan,
// warning, and next steps cards
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CloudSun,
  Droplets,
  Wind,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  Bug,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ExternalLink,
  ChevronDown,
  FileText,
  ArrowRight,
  Info,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { ResponseCardData } from "../types/advisor.types";

interface ResponseCardProps {
  data: ResponseCardData;
}

export const ResponseCard: React.FC<ResponseCardProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
    >
      {data.type === "weather" && <WeatherCard data={data} />}
      {data.type === "market" && <MarketCard data={data} />}
      {data.type === "disease" && <DiseaseCard data={data} />}
      {data.type === "government_scheme" && (
        <GovernmentSchemeCard data={data} />
      )}
      {data.type === "checklist" && <ChecklistCard data={data} />}
      {data.type === "action_plan" && <ActionPlanCard data={data} />}
      {data.type === "warning" && <WarningCard data={data} />}
      {data.type === "next_steps" && <NextStepsCard data={data} />}
    </motion.div>
  );
};

ResponseCard.displayName = "ResponseCard";

// ---------------------------------------------------------------------------
// Weather Card
// ---------------------------------------------------------------------------

function WeatherCard({
  data,
}: {
  data: ResponseCardData & { type: "weather" };
}) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-900/40">
          <CloudSun size={16} className="text-sky-600 dark:text-sky-400" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">
          Weather Update
        </h4>
        <Badge
          variant={data.safeToSpray ? "success" : "warning"}
          className="ml-auto text-[10px]"
        >
          {data.safeToSpray ? "Safe to Spray" : "Caution"}
        </Badge>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-foreground">
            {data.temperature}°C
          </span>
          <span className="text-sm text-muted-foreground ml-2">
            {data.condition}
          </span>
        </div>
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Droplets size={12} className="text-blue-500" /> {data.humidity}%
          </span>
          <span className="flex items-center gap-1">
            <Wind size={12} className="text-teal-500" /> {data.windSpeed} km/h
          </span>
        </div>
      </div>

      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
        <ShieldCheck size={14} className="text-emerald-500 shrink-0 mt-0.5" />
        <p>{data.advisory}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Market Card
// ---------------------------------------------------------------------------

function MarketCard({ data }: { data: ResponseCardData & { type: "market" } }) {
  const TrendIcon =
    data.trend === "up"
      ? TrendingUp
      : data.trend === "down"
        ? TrendingDown
        : Minus;
  const trendColor =
    data.trend === "up"
      ? "text-emerald-600 dark:text-emerald-400"
      : data.trend === "down"
        ? "text-red-600 dark:text-red-400"
        : "text-muted-foreground";

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40">
            <TrendingUp
              size={16}
              className="text-amber-600 dark:text-amber-400"
            />
          </div>
          <h4 className="text-sm font-semibold text-foreground">
            {data.commodity} Price
          </h4>
        </div>
        <Badge variant="info" className="text-[10px]">
          {data.market}
        </Badge>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <span className="text-2xl font-bold text-foreground">
          ₹{data.price.toLocaleString("en-IN")}
        </span>
        <span className="text-sm text-muted-foreground">{data.unit}</span>
      </div>

      <div
        className={cn(
          "flex items-center gap-1 text-sm font-medium",
          trendColor,
        )}
      >
        <TrendIcon size={14} />
        <span>
          {data.change > 0 ? "+" : ""}
          {data.change}%
        </span>
        <span className="text-muted-foreground text-xs ml-1">today</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Disease Card
// ---------------------------------------------------------------------------

function DiseaseCard({
  data,
}: {
  data: ResponseCardData & { type: "disease" };
}) {
  const [showTreatments, setShowTreatments] = useState(false);

  const severityVariant =
    data.severity === "high"
      ? "error"
      : data.severity === "medium"
        ? "warning"
        : "success";

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/40">
            <Bug size={16} className="text-rose-600 dark:text-rose-400" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">
            {data.diseaseName}
          </h4>
        </div>
        <Badge variant={severityVariant} className="text-[10px]">
          {data.severity} risk
        </Badge>
      </div>

      {/* Confidence Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Confidence</span>
          <span className="font-semibold text-foreground">
            {data.confidence}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.confidence}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              data.confidence >= 80
                ? "bg-emerald-500"
                : data.confidence >= 60
                  ? "bg-amber-500"
                  : "bg-red-500",
            )}
          />
        </div>
      </div>

      {/* Symptoms */}
      <div className="mb-3">
        <p className="text-xs font-medium text-muted-foreground mb-1.5">
          Symptoms:
        </p>
        <ul className="space-y-1">
          {data.symptoms.map((symptom, i) => (
            <li
              key={i}
              className="flex items-start gap-1.5 text-xs text-foreground"
            >
              <AlertCircle
                size={12}
                className="text-rose-500 shrink-0 mt-0.5"
              />
              {symptom}
            </li>
          ))}
        </ul>
      </div>

      {/* Treatments Toggle */}
      <button
        type="button"
        onClick={() => setShowTreatments(!showTreatments)}
        className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
      >
        {showTreatments ? "Hide" : "Show"} Treatments
        <ChevronDown
          size={12}
          className={cn("transition-transform", showTreatments && "rotate-180")}
        />
      </button>

      {showTreatments && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="mt-2 space-y-1.5"
        >
          {data.treatments.map((treatment, i) => (
            <div
              key={i}
              className="flex items-start gap-1.5 text-xs text-foreground p-2 rounded-lg bg-muted/50"
            >
              <CheckCircle2
                size={12}
                className="text-emerald-500 shrink-0 mt-0.5"
              />
              {treatment}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Government Scheme Card
// ---------------------------------------------------------------------------

function GovernmentSchemeCard({
  data,
}: {
  data: ResponseCardData & { type: "government_scheme" };
}) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/40">
          <FileText
            size={16}
            className="text-violet-600 dark:text-violet-400"
          />
        </div>
        <h4 className="text-sm font-semibold text-foreground">
          {data.schemeName}
        </h4>
      </div>

      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
        {data.description}
      </p>

      <div className="space-y-2 mb-3">
        <div className="flex items-start gap-2 text-xs">
          <span className="font-medium text-muted-foreground min-w-[70px]">
            Eligibility:
          </span>
          <span className="text-foreground">{data.eligibility}</span>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <span className="font-medium text-muted-foreground min-w-[70px]">
            Deadline:
          </span>
          <span className="text-foreground">{data.deadline}</span>
        </div>
      </div>

      <a
        href={data.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
      >
        Learn More
        <ExternalLink size={12} />
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Checklist Card
// ---------------------------------------------------------------------------

function ChecklistCard({
  data,
}: {
  data: ResponseCardData & { type: "checklist" };
}) {
  const completedCount = data.items.filter((item) => item.checked).length;
  const progress = (completedCount / data.items.length) * 100;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-foreground">{data.title}</h4>
        <span className="text-xs text-muted-foreground">
          {completedCount}/{data.items.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full bg-primary"
        />
      </div>

      <ul className="space-y-2">
        {data.items.map((item) => (
          <li key={item.id} className="flex items-center gap-2.5 text-xs">
            {item.checked ? (
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            ) : (
              <Circle size={14} className="text-muted-foreground shrink-0" />
            )}
            <span
              className={cn(
                item.checked
                  ? "text-muted-foreground line-through"
                  : "text-foreground",
              )}
            >
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Action Plan Card
// ---------------------------------------------------------------------------

function ActionPlanCard({
  data,
}: {
  data: ResponseCardData & { type: "action_plan" };
}) {
  const priorityColors = {
    high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    medium:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <ArrowRight size={16} className="text-primary" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">{data.title}</h4>
      </div>

      <ol className="space-y-2.5">
        {data.steps.map((step, index) => (
          <li key={step.id} className="flex items-start gap-3 text-xs">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground font-semibold shrink-0">
              {index + 1}
            </span>
            <div className="flex-1">
              <p className="text-foreground leading-relaxed">{step.text}</p>
              <span
                className={cn(
                  "inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold",
                  priorityColors[step.priority],
                )}
              >
                {step.priority}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Warning Card
// ---------------------------------------------------------------------------

function WarningCard({
  data,
}: {
  data: ResponseCardData & { type: "warning" };
}) {
  const severityConfig = {
    info: {
      bg: "bg-blue-500/10 border-blue-500/30",
      icon: <Info size={16} className="text-blue-600 dark:text-blue-400" />,
      text: "text-blue-900 dark:text-blue-100",
    },
    warning: {
      bg: "bg-amber-500/10 border-amber-500/30",
      icon: (
        <AlertTriangle
          size={16}
          className="text-amber-600 dark:text-amber-400"
        />
      ),
      text: "text-amber-900 dark:text-amber-100",
    },
    critical: {
      bg: "bg-red-500/10 border-red-500/30",
      icon: (
        <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
      ),
      text: "text-red-900 dark:text-red-100",
    },
  };

  const config = severityConfig[data.severity];

  return (
    <div className={cn("p-4 border-l-4 rounded-r-xl", config.bg)}>
      <div className="flex items-start gap-2.5">
        <div className="shrink-0 mt-0.5">{config.icon}</div>
        <p className={cn("text-xs leading-relaxed", config.text)}>
          {data.message}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Next Steps Card
// ---------------------------------------------------------------------------

function NextStepsCard({
  data,
}: {
  data: ResponseCardData & { type: "next_steps" };
}) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <ArrowRight size={16} className="text-primary" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">Next Steps</h4>
      </div>

      <ol className="space-y-2">
        {data.steps.map((step, index) => (
          <li key={index} className="flex items-start gap-2.5 text-xs">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary font-semibold shrink-0">
              {index + 1}
            </span>
            <span className="text-foreground leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
