"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Wheat,
  MapPin,
  Droplets,
  Sprout,
  Tractor,
  Fence,
  Beef,
  Layers,
  Edit3,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type {
  FarmOverview,
  Field,
  Equipment,
  LivestockEntry,
} from "../types/profile.types";

interface FarmOverviewProps {
  farm: FarmOverview;
  fields: Field[];
  equipment: Equipment[];
  livestock: LivestockEntry[];
  onEdit?: () => void;
}

const SOIL_HEALTH_CONFIG: Record<
  string,
  { label: string; variant: "success" | "info" | "warning" | "error" }
> = {
  excellent: { label: "Excellent", variant: "success" },
  good: { label: "Good", variant: "info" },
  average: { label: "Average", variant: "warning" },
  poor: { label: "Poor", variant: "error" },
};

const EQUIPMENT_STATUS: Record<
  string,
  { label: string; variant: "success" | "warning" | "info" }
> = {
  active: { label: "Active", variant: "success" },
  maintenance: { label: "Maintenance", variant: "warning" },
  idle: { label: "Idle", variant: "info" },
};

export const FarmOverviewCard: React.FC<FarmOverviewProps> = ({
  farm,
  fields,
  equipment,
  livestock,
  onEdit,
}) => {
  return (
    <motion.section
      role="region"
      aria-label="Farm Overview"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Wheat size={16} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {farm.farmName}
            </h2>
            <p className="text-[10px] text-muted-foreground">Farm Overview</p>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Edit farm details"
          >
            <Edit3 size={14} />
          </button>
        )}
      </div>

      {/* Farm stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3 text-center">
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
            {farm.totalLandArea}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {farm.unit}
          </p>
        </div>
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-center">
          <p className="text-lg font-bold text-primary">
            {farm.numberOfFields}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Fields</p>
        </div>
        <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3 text-center">
          <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
            {livestock.reduce((sum, l) => sum + l.count, 0)}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Livestock</p>
        </div>
        <div className="rounded-xl bg-violet-500/5 border border-violet-500/20 p-3 text-center">
          <p className="text-lg font-bold text-violet-700 dark:text-violet-300">
            {equipment.length}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Equipment</p>
        </div>
      </div>

      {/* Farm details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50">
          <Sprout size={14} className="text-emerald-600 shrink-0" />
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
              Primary Crops
            </p>
            <p className="text-[11px] font-semibold text-foreground">
              {farm.primaryCrops.join(", ")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50">
          <Sprout size={14} className="text-primary shrink-0" />
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
              Current Stage
            </p>
            <p className="text-[11px] font-semibold text-foreground">
              {farm.currentCropStage}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50">
          <Layers size={14} className="text-amber-600 shrink-0" />
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
              Soil Type
            </p>
            <p className="text-[11px] font-semibold text-foreground">
              {farm.soilType}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50">
          <Droplets size={14} className="text-blue-600 shrink-0" />
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
              Water Source
            </p>
            <p className="text-[11px] font-semibold text-foreground">
              {farm.waterSource}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50">
          <Droplets size={14} className="text-sky-600 shrink-0" />
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
              Irrigation
            </p>
            <p className="text-[11px] font-semibold text-foreground">
              {farm.irrigationMethod}
            </p>
          </div>
        </div>
        {farm.coordinates && (
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50">
            <MapPin size={14} className="text-red-500 shrink-0" />
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                Coordinates
              </p>
              <p className="text-[11px] font-semibold text-foreground">
                {farm.coordinates.lat.toFixed(4)},{" "}
                {farm.coordinates.lng.toFixed(4)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Fields */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Fields
        </p>
        <div className="space-y-2">
          {fields.map((field) => {
            const healthCfg = SOIL_HEALTH_CONFIG[field.soilHealth];
            return (
              <div
                key={field.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border/50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Fence size={12} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-foreground">
                      {field.name}
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      {field.area} acres · {field.crop}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-muted-foreground">
                    {field.stage}
                  </span>
                  {healthCfg && (
                    <Badge variant={healthCfg.variant} className="text-[9px]">
                      {healthCfg.label}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Equipment & Livestock row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Equipment
          </p>
          <div className="space-y-1.5">
            {equipment.map((eq) => {
              const statusCfg = EQUIPMENT_STATUS[eq.status];
              return (
                <div
                  key={eq.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <Tractor size={12} className="text-muted-foreground" />
                    <span className="text-[11px] font-medium text-foreground">
                      {eq.name}
                    </span>
                  </div>
                  {statusCfg && (
                    <Badge variant={statusCfg.variant} className="text-[9px]">
                      {statusCfg.label}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Livestock
          </p>
          <div className="space-y-1.5">
            {livestock.map((ls) => (
              <div
                key={ls.id}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <Beef size={12} className="text-muted-foreground" />
                  <span className="text-[11px] font-medium text-foreground">
                    {ls.type}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {ls.count} {ls.breed ? `(${ls.breed})` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

FarmOverviewCard.displayName = "FarmOverviewCard";
