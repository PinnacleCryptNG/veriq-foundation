import type { Metadata } from "next";
import { OpportunityDetailPage } from "@/components/opportunities/opportunity-detail-page";

export const metadata: Metadata = {
  title: "Opportunity",
};

export default async function Page({
  params,
}: PageProps<"/opportunities/[id]">) {
  const { id } = await params;
  return <OpportunityDetailPage opportunityId={id} />;
}
