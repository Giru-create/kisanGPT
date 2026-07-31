"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Globe,
  MapPin,
  Briefcase,
  Clock,
  Edit3,
} from "lucide-react";
import type { FarmerProfile } from "../types/profile.types";

interface PersonalInfoProps {
  profile: FarmerProfile;
  onEdit?: () => void;
}

const LANGUAGE_LABELS: Record<string, string> = {
  hi: "Hindi (हिन्दी)",
  en: "English",
  pa: "Punjabi (ਪੰਜਾਬੀ)",
  gu: "Gujarati (ગુજરાતી)",
  mr: "Marathi (मराठी)",
  ta: "Tamil (தமிழ்)",
  te: "Telugu (తెలుగు)",
  kn: "Kannada (ಕನ್ನಡ)",
  bn: "Bengali (বাংলা)",
};

export const PersonalInfo: React.FC<PersonalInfoProps> = ({
  profile,
  onEdit,
}) => {
  const dob = profile.dateOfBirth
    ? new Date(profile.dateOfBirth).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const infoItems = [
    { icon: <User size={14} />, label: "Full Name", value: profile.name },
    { icon: <Phone size={14} />, label: "Phone Number", value: profile.phone },
    {
      icon: <Mail size={14} />,
      label: "Email",
      value: profile.email || "Not provided",
    },
    {
      icon: <Calendar size={14} />,
      label: "Date of Birth",
      value: dob || "Not provided",
    },
    {
      icon: <Globe size={14} />,
      label: "Preferred Language",
      value:
        LANGUAGE_LABELS[profile.preferredLanguage] ?? profile.preferredLanguage,
    },
    {
      icon: <MapPin size={14} />,
      label: "State",
      value: profile.state,
    },
    {
      icon: <MapPin size={14} />,
      label: "District",
      value: profile.district,
    },
    {
      icon: <MapPin size={14} />,
      label: "Village",
      value: profile.village,
    },
    {
      icon: <Briefcase size={14} />,
      label: "Occupation",
      value: profile.occupation,
    },
    {
      icon: <Clock size={14} />,
      label: "Farming Experience",
      value: `${profile.farmingExperience} years`,
    },
  ];

  return (
    <motion.section
      role="region"
      aria-label="Personal Information"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <User size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Personal Information
            </h2>
            <p className="text-[10px] text-muted-foreground">
              Your personal details
            </p>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Edit personal information"
          >
            <Edit3 size={14} />
          </button>
        )}
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50"
          >
            <span className="text-muted-foreground shrink-0">{item.icon}</span>
            <div className="min-w-0">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                {item.label}
              </p>
              <p className="text-[11px] font-semibold text-foreground truncate">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

PersonalInfo.displayName = "PersonalInfo";
