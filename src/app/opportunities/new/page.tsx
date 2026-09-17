import type { Metadata } from "next";
import { LinkButton } from "@/components/link-button";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LimitationNotice } from "@/components/limitation-notice";

export const metadata: Metadata = {
  title: "New opportunity",
};

const plannedFields = [
  {
    id: "company",
    label: "Issuer / company name",
    placeholder: "Legal name of the private company",
  },
  {
    id: "instrument",
    label: "Instrument",
    placeholder: "Common stock, preferred, SAFE, or employee tender",
  },
  {
    id: "claim",
    label: "Claimed terms",
    placeholder: "What the opportunity claims, in the submitter’s words",
  },
  {
    id: "counterparty",
    label: "Counterparty",
    placeholder: "Seller, buyer, or transferring holder",
  },
] as const;

export default function NewOpportunityPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="New opportunity"
        description="Intake will collect identity, claimed terms, and evidence for later review. Submission is not enabled in this foundation build."
        actions={
          <LinkButton href="/opportunities" variant="outline">
            Back to opportunities
          </LinkButton>
        }
      />

      <LimitationNotice />

      <div
        role="note"
        className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground"
      >
        <p>
          <span className="font-medium text-foreground">Placeholder.</span>{" "}
          These fields show what creation will ask for. Nothing is saved, and
          no review is started from this page.
        </p>
      </div>

      <div
        aria-label="Planned opportunity intake"
        className="space-y-5 rounded-lg border border-border bg-card p-4 sm:p-5"
      >
        {plannedFields.map((field) => (
          <div key={field.id} className="space-y-1.5">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              name={field.id}
              placeholder={field.placeholder}
              disabled
            />
          </div>
        ))}
        <div className="space-y-1.5">
          <Label htmlFor="evidence">Evidence</Label>
          <Input id="evidence" name="evidence" type="file" disabled />
          <p className="text-xs text-muted-foreground">
            Uploads will be treated as submitted materials, not as proof of
            authenticity, ownership, or issuer approval.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <LinkButton href="/opportunities">View demo opportunities</LinkButton>
        <LinkButton href="/" variant="outline">
          Back to overview
        </LinkButton>
      </div>
    </div>
  );
}
