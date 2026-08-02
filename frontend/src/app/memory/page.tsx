import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/Spinner";

const MemoryPage = dynamic(
  () => import("@/features/memory").then((m) => m.MemoryPage),
  {
    loading: () => (
      <div className="ds-page flex items-center justify-center">
        <Spinner size="md" />
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Farm Memory | KisanGPT",
  description:
    "Record and manage your farm data — soil tests, crop observations, and AI-generated insights.",
};

export default function MemoryRoute() {
  return <MemoryPage />;
}
