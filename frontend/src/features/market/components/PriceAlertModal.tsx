// ─────────────────────────────────────────────────────────────────────────────
// PriceAlertModal.tsx
// KisanGPT — Price alert setup dialog (WCAG 2.2 AA compliant)
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, { useState, useId } from "react";
import { Bell, MessageSquare, Smartphone } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type {
  AlertCondition,
  AlertChannel,
  PriceAlertDraft,
} from "../types/market.types";
import { COMMODITIES } from "../constants/market.constants";

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCommodity: string;
  currentPrice?: number;
  onSubmit: (draft: PriceAlertDraft) => void;
}

const CHANNEL_CONFIG: {
  id: AlertChannel;
  label: string;
  description: string;
  Icon: React.FC<{ size?: number; className?: string }>;
}[] = [
  {
    id: "sms",
    label: "SMS",
    description: "Works without internet",
    Icon: Smartphone,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Rich message with details",
    Icon: MessageSquare,
  },
  {
    id: "push",
    label: "App Notification",
    description: "Instant push alert",
    Icon: Bell,
  },
];

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  defaultCommodity,
  currentPrice,
  onSubmit,
}) => {
  const conditionGroupId = useId();

  const [commodity, setCommodity] = useState(defaultCommodity);
  const [condition, setCondition] = useState<AlertCondition>("above");
  const [targetPrice, setTargetPrice] = useState<string>(
    currentPrice ? String(currentPrice) : "",
  );
  const [channels, setChannels] = useState<AlertChannel[]>(["sms"]);
  const [priceError, setPriceError] = useState<string>("");
  const [channelError, setChannelError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync commodity when dialog opens with new default
  React.useEffect(() => {
    if (isOpen) {
      setCommodity(defaultCommodity);
      setTargetPrice(currentPrice ? String(currentPrice) : "");
      setPriceError("");
      setChannelError("");
    }
  }, [isOpen, defaultCommodity, currentPrice]);

  const toggleChannel = (ch: AlertChannel) => {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch],
    );
    setChannelError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    const parsed = Number(targetPrice);
    if (!targetPrice || isNaN(parsed) || parsed <= 0) {
      setPriceError("Please enter a valid price greater than ₹0.");
      valid = false;
    } else {
      setPriceError("");
    }

    if (channels.length === 0) {
      setChannelError("Please select at least one notification channel.");
      valid = false;
    } else {
      setChannelError("");
    }

    if (!valid) return;

    setIsSubmitting(true);
    // Simulate brief API call
    await new Promise((r) => setTimeout(r, 600));
    onSubmit({ commodity, target_price: parsed, condition, channels });
    setIsSubmitting(false);
    // Reset form
    setTargetPrice("");
    setChannels(["sms"]);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Set Price Alert"
      description={`Get notified when ${commodity} prices hit your target.`}
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="price-alert-form"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<Bell size={15} aria-hidden="true" />}
          >
            Create Alert
          </Button>
        </>
      }
    >
      <form id="price-alert-form" onSubmit={handleSubmit} noValidate>
        <div className="space-y-5">
          {/* Commodity selector */}
          <div className="space-y-1.5">
            <label
              htmlFor="alert-commodity"
              className="block text-sm font-medium text-foreground"
            >
              Commodity
            </label>
            <select
              id="alert-commodity"
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {COMMODITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <fieldset>
            <legend
              id={conditionGroupId}
              className="block text-sm font-medium text-foreground mb-2"
            >
              Trigger when price is…
            </legend>
            <div
              role="group"
              aria-labelledby={conditionGroupId}
              className="flex gap-2"
            >
              {(["above", "below"] as AlertCondition[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCondition(c)}
                  aria-pressed={condition === c}
                  className={`flex-1 py-2.5 min-h-[44px] rounded-xl border text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring capitalize ${
                    condition === c
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {c === "above" ? "⬆ Above" : "⬇ Below"}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Target price */}
          <div>
            <Input
              type="number"
              label="Target Price (₹/qtl)"
              id="alert-target-price"
              placeholder={currentPrice ? `e.g. ${currentPrice}` : "e.g. 2500"}
              value={targetPrice}
              onChange={(e) => {
                setTargetPrice(e.target.value);
                setPriceError("");
              }}
              errorMessage={priceError}
              helperText={
                currentPrice
                  ? `Current price: ₹${currentPrice.toLocaleString("en-IN")}/qtl`
                  : undefined
              }
              required
              min={1}
            />
          </div>

          {/* Notification channels */}
          <fieldset>
            <legend className="block text-sm font-medium text-foreground mb-2">
              Notify me via
            </legend>
            <div className="space-y-2">
              {CHANNEL_CONFIG.map(({ id, label, description, Icon }) => {
                const checked = channels.includes(id);
                return (
                  <label
                    key={id}
                    htmlFor={`channel-${id}`}
                    className={`flex items-center gap-3 p-3 min-h-[52px] rounded-xl border cursor-pointer transition-all ${
                      checked
                        ? "border-primary bg-accent/50"
                        : "border-border bg-background hover:bg-muted/30"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`channel-${id}`}
                      checked={checked}
                      onChange={() => toggleChannel(id)}
                      className="h-4 w-4 rounded border-border accent-primary focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <Icon
                      size={16}
                      className={
                        checked ? "text-primary" : "text-muted-foreground"
                      }
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground block">
                        {label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {description}
                      </span>
                    </div>
                    {id === "sms" && (
                      <span className="text-[10px] font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5 shrink-0">
                        Recommended
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
            {channelError && (
              <p
                role="alert"
                className="text-xs font-medium text-destructive mt-2"
              >
                {channelError}
              </p>
            )}
          </fieldset>
        </div>
      </form>
    </Dialog>
  );
};

PriceAlertModal.displayName = "PriceAlertModal";
