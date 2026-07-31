"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, MapPin, Bell, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { COMMODITY_EMOJI } from "../constants/market.constants";
import type { CommodityPrice } from "../types/market.types";

interface MandiPriceCardProps {
  price: CommodityPrice;
  onSetAlert?: (commodity: string) => void;
  onViewHistory?: (commodity: string, mandi: string) => void;
  index?: number;
}

export const MandiPriceCard: React.FC<MandiPriceCardProps> = ({
  price,
  onSetAlert,
  onViewHistory,
  index = 0,
}) => {
  const emoji = COMMODITY_EMOJI[price.commodity] ?? "\uD83C\uDF3E";
  const isAboveMSP = price.price_per_quintal >= price.msp;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Accent bar */}
      <div
        className={cn("h-1", price.is_rise ? "bg-emerald-500" : "bg-red-500")}
      />

      <div className="p-4">
        {/* Top row: commodity + alerts */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">
              {emoji}
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {price.commodity}
              </h3>
              <p className="text-[10px] text-muted-foreground">
                {price.variety}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onViewHistory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewHistory(price.commodity, price.mandi_name)}
                aria-label={`View price history for ${price.commodity}`}
                className="h-7 w-7 p-0"
              >
                <History size={14} className="text-muted-foreground" />
              </Button>
            )}
            {onSetAlert && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSetAlert(price.commodity)}
                aria-label={`Set price alert for ${price.commodity}`}
                className="h-7 w-7 p-0"
              >
                <Bell size={14} className="text-muted-foreground" />
              </Button>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end gap-2 mb-3">
          <span className="text-2xl font-bold text-foreground">
            {"\u20B9"}
            {price.price_per_quintal.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-muted-foreground">/qtl</span>
          <div
            className={cn(
              "flex items-center gap-1 ml-auto px-2 py-0.5 rounded-full text-xs font-medium",
              price.is_rise
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500",
            )}
          >
            {price.is_rise ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            {price.is_rise ? "+" : ""}
            {price.change_percent.toFixed(2)}%
          </div>
        </div>

        {/* MSP badge */}
        <div className="flex items-center gap-2 mb-3">
          <Badge
            variant={isAboveMSP ? "success" : "error"}
            className="text-[10px]"
          >
            {isAboveMSP ? "Above MSP" : "Below MSP"}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            MSP: {"\u20B9"}
            {price.msp.toLocaleString("en-IN")}/qtl
          </span>
        </div>

        {/* Location + yesterday */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <MapPin size={10} aria-hidden="true" />
            {price.mandi_name}, {price.state}
          </div>
          <span className="text-[10px] text-muted-foreground">
            Yesterday: {"\u20B9"}
            {(price.price_per_quintal - price.change_amount).toLocaleString(
              "en-IN",
            )}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

MandiPriceCard.displayName = "MandiPriceCard";
