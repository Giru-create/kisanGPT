"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellRing,
  Plus,
  Trash2,
  Pause,
  Play,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { PriceAlert } from "../types/market.types";

interface PriceAlertsProps {
  alerts: PriceAlert[];
  onCreateAlert?: (
    commodity: string,
    targetPrice: number,
    condition: "above" | "below",
  ) => void;
  onRemoveAlert?: (id: string) => void;
  onToggleAlert?: (id: string) => void;
}

export const PriceAlerts: React.FC<PriceAlertsProps> = ({
  alerts,
  onCreateAlert,
  onRemoveAlert,
  onToggleAlert,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newCommodity, setNewCommodity] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState<"above" | "below">("above");

  const handleSubmit = () => {
    if (!newCommodity || !targetPrice || !onCreateAlert) return;
    onCreateAlert(newCommodity, Number(targetPrice), condition);
    setNewCommodity("");
    setTargetPrice("");
    setIsCreating(false);
  };

  return (
    <motion.section
      role="region"
      aria-label="Price Alerts"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">
            Price Alerts
          </h2>
          {alerts.length > 0 && (
            <Badge variant="info" className="text-[10px]">
              {alerts.filter((a) => a.is_active).length} active
            </Badge>
          )}
        </div>
        {onCreateAlert && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(!isCreating)}
            leftIcon={<Plus size={14} />}
            className="text-xs h-7"
          >
            New Alert
          </Button>
        )}
      </div>

      {/* Create form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-4"
          >
            <div className="rounded-xl border border-border bg-muted/50 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                    Commodity
                  </label>
                  <input
                    type="text"
                    value={newCommodity}
                    onChange={(e) => setNewCommodity(e.target.value)}
                    placeholder="e.g. Wheat"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                    Target Price (₹/qtl)
                  </label>
                  <Input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="e.g. 2300"
                    className="text-xs h-9"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-medium text-muted-foreground mb-1.5 block">
                  Alert when price goes
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCondition("above")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors",
                      condition === "above"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-border bg-background text-muted-foreground",
                    )}
                  >
                    <TrendingUp size={12} /> Above Target
                  </button>
                  <button
                    onClick={() => setCondition("below")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors",
                      condition === "below"
                        ? "border-red-300 bg-red-50 text-red-600"
                        : "border-border bg-background text-muted-foreground",
                    )}
                  >
                    <TrendingDown size={12} /> Below Target
                  </button>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!newCommodity || !targetPrice}
                  className="flex-1 text-xs"
                >
                  Create Alert
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreating(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alert list */}
      {alerts.length === 0 ? (
        <div className="text-center py-6">
          <BellRing
            size={24}
            className="mx-auto mb-2 text-muted-foreground/50"
          />
          <p className="text-xs text-muted-foreground">
            No alerts set. Get notified when prices hit your target.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                alert.is_active
                  ? "border-border bg-background"
                  : "border-border/50 bg-muted/30 opacity-60",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  alert.condition === "above"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-red-100 text-red-500",
                )}
              >
                {alert.condition === "above" ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  {alert.commodity}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {alert.condition === "above" ? "Above" : "Below"} {"\u20B9"}
                  {alert.target_price.toLocaleString("en-IN")}/qtl
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {alert.triggered_at && (
                  <Badge variant="success" className="text-[9px]">
                    Triggered
                  </Badge>
                )}
                {onToggleAlert && (
                  <button
                    onClick={() => onToggleAlert(alert.id)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    aria-label={
                      alert.is_active
                        ? `Pause alert for ${alert.commodity}`
                        : `Resume alert for ${alert.commodity}`
                    }
                  >
                    {alert.is_active ? (
                      <Pause size={12} className="text-muted-foreground" />
                    ) : (
                      <Play size={12} className="text-muted-foreground" />
                    )}
                  </button>
                )}
                {onRemoveAlert && (
                  <button
                    onClick={() => onRemoveAlert(alert.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                    aria-label={`Remove alert for ${alert.commodity}`}
                  >
                    <Trash2 size={12} className="text-destructive" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
};

PriceAlerts.displayName = "PriceAlerts";
