import type { Metadata } from "next";
import { OpportunitiesWorkspace } from "@/components/opportunities/opportunities-workspace";

export const metadata: Metadata = {
  title: "Opportunities",
};

export default function OpportunitiesPage() {
  return <OpportunitiesWorkspace />;
}
