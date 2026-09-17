import type { Metadata } from "next";
import { LimitationNotice } from "@/components/limitation-notice";
import { LinkButton } from "@/components/link-button";
import { OpportunityIntakeForm } from "@/components/opportunities/opportunity-intake-form";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { PersistenceNotice } from "@/components/persistence-notice";
import { VerificationNotice } from "@/components/verification-notice";

export const metadata: Metadata = {
  title: "New opportunity",
};

export default function NewOpportunityPage() {
  return (
    <PageContainer width="3xl">
      <PageHeader
        title="New opportunity"
        description="Capture claimed terms for a private-market opportunity. Saving stores a local demo record. It does not start verification."
        actions={
          <LinkButton href="/opportunities" variant="outline">
            Back to opportunities
          </LinkButton>
        }
      />

      <LimitationNotice />
      <VerificationNotice />
      <PersistenceNotice />

      <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <OpportunityIntakeForm />
      </div>
    </PageContainer>
  );
}
