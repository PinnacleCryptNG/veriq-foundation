import type { Metadata } from "next";
import { LinkButton } from "@/components/link-button";
import { OpportunityIntakeForm } from "@/components/opportunities/opportunity-intake-form";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { LimitationNotice } from "@/components/limitation-notice";

export const metadata: Metadata = {
  title: "Start a new deal check",
};

export default function NewOpportunityPage() {
  return (
    <PageContainer width="3xl" className="space-y-6">
      <PageHeader
        title="Start a new deal check"
        description="Enter what the seller told you about the private-market opportunity. You will attach or enter supporting evidence next before running verification checks."
        actions={
          <LinkButton href="/opportunities" variant="outline">
            Back to deals
          </LinkButton>
        }
      />

      <LimitationNotice />

      <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <OpportunityIntakeForm />
      </div>
    </PageContainer>
  );
}
