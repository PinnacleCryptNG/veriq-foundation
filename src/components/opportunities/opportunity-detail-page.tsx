"use client";

import { DemoNotice } from "@/components/demo-notice";
import { EmptyState, LoadingState, Banner } from "@/components/feedback";
import { DemoBadge } from "@/components/opportunities/demo-badge";
import { EvidenceSection } from "@/components/opportunities/evidence-section";
import { StatusBadge } from "@/components/opportunities/status-badge";
import { LimitationNotice } from "@/components/limitation-notice";
import { LinkButton } from "@/components/link-button";
import { PageHeader } from "@/components/page-header";
import { PersistenceNotice } from "@/components/persistence-notice";
import { VerificationNotice } from "@/components/verification-notice";
import { useOpportunities } from "@/hooks/use-opportunities";
import {
  formatClaimedPrice,
  formatDate,
  formatQuantity,
  instrumentLabels,
  statusLabels,
} from "@/lib/format";

export function OpportunityDetailPage({
  opportunityId,
}: {
  opportunityId: string;
}) {
  const {
    getById,
    isLoading,
    warning,
    persistError,
    addEvidence,
    removeEvidence,
    updateEvidenceDetails,
  } = useOpportunities();
  const opportunity = getById(opportunityId);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <LoadingState label="Loading opportunity…" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Opportunity not found"
          description="This record is not in the local workspace. It may have been cleared from this browser."
          actions={
            <LinkButton href="/opportunities" variant="outline">
              Back to opportunities
            </LinkButton>
          }
        />
        <EmptyState
          title="No matching record"
          description="Seeded demo opportunities and records created in this browser appear in the opportunities list."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title={opportunity.companyName}
        description={opportunity.claimedSummary}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={opportunity.status} />
            {opportunity.isDemo ? <DemoBadge /> : null}
            <LinkButton href={`/opportunities/${opportunity.id}/review`}>
              Open review workspace
            </LinkButton>
            <LinkButton href="/opportunities" variant="outline">
              Back to opportunities
            </LinkButton>
          </div>
        }
      />

      <VerificationNotice />
      <LimitationNotice />
      <PersistenceNotice />
      {opportunity.isDemo ? <DemoNotice /> : null}
      {warning ? <Banner>{warning}</Banner> : null}
      {persistError ? <Banner tone="danger">{persistError}</Banner> : null}

      <section
        aria-labelledby="company-heading"
        className="grid gap-3 md:grid-cols-2"
      >
        <DetailCard
          id="company-heading"
          title="Company and opportunity"
          rows={[
            ["Company", opportunity.companyName],
            ["Security / interest", instrumentLabels[opportunity.instrument]],
            ["Share class", opportunity.shareClass ?? "Not provided"],
            ["Workspace source", opportunity.source],
            ["Created", formatDate(opportunity.createdAt)],
            ["Updated", formatDate(opportunity.updatedAt)],
          ]}
        />
        <DetailCard
          title="Seller / intermediary"
          columns={1}
          rows={[
            ["Name", opportunity.sellerOrIntermediary],
            [
              "Intake status",
              `${statusLabels[opportunity.status]} — not a verification result`,
            ],
          ]}
        />
      </section>

      <DetailCard
        title="Quoted deal terms"
        description="These figures are claimed intake values. They are not appraised, issuer-confirmed, or verified."
        rows={[
          ["Quantity offered", formatQuantity(opportunity)],
          ["Quoted price", formatClaimedPrice(opportunity)],
          ["Currency", opportunity.currency ?? "Not provided"],
        ]}
      />

      {opportunity.missingMaterials.length > 0 ? (
        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-medium text-foreground">
            Missing materials noted at intake
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {opportunity.missingMaterials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-sm text-muted-foreground">{opportunity.limitationNote}</p>

      <EvidenceSection
        opportunityId={opportunity.id}
        evidence={opportunity.evidence}
        onAdd={addEvidence}
        onRemove={removeEvidence}
        onUpdateDetails={updateEvidenceDetails}
      />
    </div>
  );
}

function DetailCard({
  id,
  title,
  description,
  rows,
  columns = 2,
}: {
  id?: string;
  title: string;
  description?: string;
  rows: Array<[string, string]>;
  columns?: 1 | 2;
}) {
  return (
    <section
      aria-labelledby={id}
      className="rounded-lg border border-border bg-card p-4"
    >
      <h2 id={id} className="text-sm font-medium text-foreground">
        {title}
      </h2>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
      <dl
        className={
          columns === 2
            ? "mt-3 grid gap-2 sm:grid-cols-2"
            : "mt-3 grid gap-2"
        }
      >
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">
              {label}
            </dt>
            <dd className="mt-0.5 text-sm text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
