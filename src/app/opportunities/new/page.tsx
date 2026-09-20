import type { Metadata } from "next";
import { LinkButton } from "@/components/link-button";
import { OpportunityIntakeForm } from "@/components/opportunities/opportunity-intake-form";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { LimitationNotice } from "@/components/limitation-notice";
import { DEMO_SCENARIO_ID } from "@/data/demo-opportunities";

export const metadata: Metadata = {
  title: "Start a new deal check",
};

export default function NewOpportunityPage() {
  return (
    <PageContainer width="3xl" className="space-y-8">
      <PageHeader
        title="Start a new deal check"
        description="Try the example first, or enter the seller's claimed terms manually. Supporting information can be entered next; document upload is optional."
        actions={
          <LinkButton href="/opportunities" variant="outline">
            Back to deals
          </LinkButton>
        }
      />

      <LimitationNotice />

      <section
        aria-labelledby="example-data-heading"
        className="rounded-xl border border-primary/40 bg-primary/10 p-5 sm:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              No private documents required
            </p>
            <h2 id="example-data-heading" className="text-lg font-semibold text-foreground">
              Test VERIQ with Example data
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Open the synthetic Lumen Harbor scenario to inspect supplied information, run the existing checks, and view the expected findings. You can start your own deal check afterward without uploading a document.
            </p>
          </div>
          <LinkButton
            href={`/opportunities/${DEMO_SCENARIO_ID}/review`}
            className="w-full shrink-0 sm:w-auto"
          >
            Use example data
          </LinkButton>
        </div>
      </section>

      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <OpportunityIntakeForm />
      </div>
    </PageContainer>
  );
}
