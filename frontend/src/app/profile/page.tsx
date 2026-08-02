import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/Spinner";

const ProfilePage = dynamic(
  () => import("@/features/profile").then((m) => m.ProfilePage),
  {
    loading: () => (
      <div className="ds-page flex items-center justify-center">
        <Spinner size="md" />
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Farmer Profile | KisanGPT",
  description:
    "View and manage your farmer profile, farm details, AI personalization, achievements, and privacy settings.",
};

export default function ProfileRoute() {
  return <ProfilePage />;
}
