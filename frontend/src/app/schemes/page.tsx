import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/Spinner";

const SchemesPage = dynamic(
  () => import("@/features/schemes").then((m) => m.SchemesPage),
  {
    loading: () => (
      <div className="ds-page flex items-center justify-center">
        <Spinner size="md" />
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Government Schemes | KisanGPT",
  description:
    "Discover and apply for government agricultural schemes tailored to your farm and eligibility.",
};

export default function SchemesRoute() {
  return <SchemesPage />;
}
