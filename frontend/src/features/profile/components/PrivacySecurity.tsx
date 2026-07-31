"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Smartphone,
  Monitor,
  LogOut,
  Download,
  Trash2,
  Bell,
  MapPin,
  BarChart3,
  Share2,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type {
  PrivacySettings,
  ConnectedDevice,
  LoginSession,
} from "../types/profile.types";

interface PrivacySecurityProps {
  privacySettings: PrivacySettings;
  connectedDevices: ConnectedDevice[];
  loginSessions: LoginSession[];
  onToggleSetting?: (key: keyof PrivacySettings) => void;
  onExportData?: () => void;
  onDeleteAccount?: () => void;
  onLogoutDevice?: (id: string) => void;
}

export const PrivacySecurity: React.FC<PrivacySecurityProps> = ({
  privacySettings,
  connectedDevices,
  loginSessions,
  onToggleSetting,
  onExportData,
  onDeleteAccount,
  onLogoutDevice,
}) => {
  const settingsItems: Array<{
    key: keyof PrivacySettings;
    label: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      key: "dataSharing",
      label: "Data Sharing",
      description: "Share anonymized data to improve KisanGPT",
      icon: <Share2 size={14} className="text-blue-600" />,
    },
    {
      key: "aiMemory",
      label: "AI Memory",
      description: "Allow KisanGPT to remember your preferences",
      icon: <Brain size={14} className="text-primary" />,
    },
    {
      key: "locationTracking",
      label: "Location Tracking",
      description: "Use location for weather and market data",
      icon: <MapPin size={14} className="text-emerald-600" />,
    },
    {
      key: "analytics",
      label: "Analytics",
      description: "Help improve app performance",
      icon: <BarChart3 size={14} className="text-violet-600" />,
    },
    {
      key: "marketing",
      label: "Marketing Communications",
      description: "Receive tips and promotional content",
      icon: <Bell size={14} className="text-amber-600" />,
    },
  ];

  return (
    <motion.section
      role="region"
      aria-label="Privacy & Security"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <Shield size={16} className="text-emerald-600" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Privacy & Security
          </h2>
          <p className="text-[10px] text-muted-foreground">
            Manage your data and security
          </p>
        </div>
      </div>

      {/* Privacy toggles */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Data Preferences
        </p>
        {settingsItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50"
          >
            <div className="flex items-center gap-2.5">
              {item.icon}
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {item.label}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => onToggleSetting?.(item.key)}
              className={cn(
                "relative w-10 h-6 rounded-full transition-colors shrink-0",
                privacySettings[item.key]
                  ? "bg-primary"
                  : "bg-muted border border-border",
              )}
              role="switch"
              aria-checked={privacySettings[item.key]}
              aria-label={`Toggle ${item.label}`}
            >
              <span
                className={cn(
                  "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform",
                  privacySettings[item.key] ? "left-5" : "left-1",
                )}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Connected Devices */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Connected Devices
        </p>
        <div className="space-y-2">
          {connectedDevices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50"
            >
              <div className="flex items-center gap-2.5">
                {device.type === "Mobile" ? (
                  <Smartphone size={14} className="text-muted-foreground" />
                ) : (
                  <Monitor size={14} className="text-muted-foreground" />
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-foreground">
                      {device.name}
                    </p>
                    {device.isCurrent && (
                      <Badge variant="success" className="text-[9px]">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Last active{" "}
                    {new Date(device.lastActive).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              {!device.isCurrent && onLogoutDevice && (
                <button
                  onClick={() => onLogoutDevice(device.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600"
                  aria-label={`Log out ${device.name}`}
                >
                  <LogOut size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Login Sessions */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Recent Sessions
        </p>
        <div className="space-y-2">
          {loginSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full shrink-0",
                    session.isActive
                      ? "bg-emerald-500"
                      : "bg-muted-foreground/30",
                  )}
                />
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {session.device}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {session.location} · {session.ipAddress}
                  </p>
                </div>
              </div>
              <span className="text-[9px] text-muted-foreground">
                {new Date(session.loginTime).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2 border-t border-border/50">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Data Management
        </p>
        <button
          onClick={onExportData}
          className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/20 transition-all text-left"
        >
          <Download size={14} className="text-primary" />
          <div>
            <p className="text-xs font-semibold text-foreground">
              Export Personal Data
            </p>
            <p className="text-[10px] text-muted-foreground">
              Download all your data as JSON
            </p>
          </div>
        </button>
        <button
          onClick={onDeleteAccount}
          className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-red-500/5 border border-red-500/20 hover:border-red-500/40 transition-all text-left"
        >
          <Trash2 size={14} className="text-red-600" />
          <div>
            <p className="text-xs font-semibold text-red-600">
              Delete Account Data
            </p>
            <p className="text-[10px] text-muted-foreground">
              Permanently delete all your data
            </p>
          </div>
        </button>
      </div>
    </motion.section>
  );
};

PrivacySecurity.displayName = "PrivacySecurity";
