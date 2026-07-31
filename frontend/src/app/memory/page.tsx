import type { Metadata } from "next";
import { MemoryPage } from "@/features/memory";

export const metadata: Metadata = {
  title: "Farm Memory | KisanGPT",
  description:
    "Record and manage your farm data — soil tests, crop observations, and AI-generated insights.",
};

export default function MemoryRoute() {
  return <MemoryPage />;
}
