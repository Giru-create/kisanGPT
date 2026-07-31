import type { Metadata } from "next";
import { SchemesPage } from "@/features/schemes";

export const metadata: Metadata = {
  title: "Government Schemes | KisanGPT",
  description:
    "Discover and apply for government agricultural schemes tailored to your farm and eligibility.",
};

export default function SchemesRoute() {
  return <SchemesPage />;
}
