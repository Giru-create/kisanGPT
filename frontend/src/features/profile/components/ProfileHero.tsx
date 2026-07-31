"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Globe, Crown, Sparkles, Clock, Edit3 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MEMBERSHIP_CONFIG } from "../constants/profile.constants";
import type { FarmerProfile } from "../types/profile.types";

interface ProfileHeroProps {
  profile: FarmerProfile;
  onEdit?: () => void;
}

const LANGUAGE_LABELS: Record<string, string> = {
  hi: "Hindi",
  en: "English",
  pa: "Punjabi",
  gu: "Gujarati",
  mr: "Marathi",
  ta: "Tamil",
  te: "Telugu",
  kn: "Kannada",
  bn: "Bengali",
};

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  profile,
  onEdit,
}) => {
  const membershipCfg =
    MEMBERSHIP_CONFIG[profile.membershipTier] ?? MEMBERSHIP_CONFIG.free!;

  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
  });

  const lastSync = new Date(profile.lastSyncTime).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.section
      role="region"
      aria-label="Farmer Profile"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
    >
      {/* Accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-emerald-400 to-violet-400" />

      <div className="p-5">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <Avatar
              src={profile.avatarUrl}
              fallback={profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
              size="lg"
              className="h-20 w-20 text-xl"
            />
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">✓</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-lg font-bold text-foreground tracking-tight">
                  {profile.name}
                </h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={12} />
                    {profile.village}, {profile.district}, {profile.state}
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Globe size={12} />
                    {LANGUAGE_LABELS[profile.preferredLanguage] ??
                      profile.preferredLanguage}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit3 size={14} />}
                onClick={onEdit}
              >
                Edit Profile
              </Button>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-3 flex-wrap">
              <Badge
                className={`${membershipCfg.color} ${membershipCfg.bg} text-[10px]`}
              >
                <Crown size={10} className="mr-1" />
                {membershipCfg.label} Member
              </Badge>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Sparkles size={10} className="text-primary" />
                AI Score: {78}/100
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock size={10} />
                Last sync: {lastSync}
              </span>
            </div>

            {/* Member since */}
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span>Member since {memberSince}</span>
              <span>·</span>
              <span>{profile.farmingExperience} years experience</span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

ProfileHero.displayName = "ProfileHero";
