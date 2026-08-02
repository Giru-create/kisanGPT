import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/Spinner";

const SettingsPage = dynamic(
  () => import("@/features/settings").then((m) => m.SettingsPage),
  {
    loading: () => (
      <div className="ds-page flex items-center justify-center">
        <Spinner size="md" />
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Settings | KisanGPT",
  description: "Personalize your KisanGPT farming assistant experience",
};

export default function SettingsRoute() {
  return <SettingsPage />;
}
