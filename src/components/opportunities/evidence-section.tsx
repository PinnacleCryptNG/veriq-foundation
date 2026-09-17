"use client";

import { useState, type FormEvent } from "react";
import { flattenError } from "zod";
import { Field } from "@/components/field";
import { EmptyState } from "@/components/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { MAX_PERSISTED_FILE_BYTES } from "@/config/storage";
import {
  evidenceTypeLabels,
  formatDate,
  formatFileSize,
} from "@/lib/format";
import {
  evidenceIntakeSchema,
  evidenceTypeSchema,
  type Evidence,
} from "@/types/opportunity";
import type { StructuredEvidenceDetails } from "@/types/verification";
import { StructuredDetailsEditor } from "@/components/opportunities/structured-details-editor";

type EvidenceSectionProps = {
  opportunityId: string;
  evidence: Evidence[];
  onAdd: (
    opportunityId: string,
    input: { type: Evidence["type"]; displayName: string; description?: string },
    file?: File | null,
  ) => Promise<unknown>;
  onRemove: (opportunityId: string, evidenceId: string) => void;
  onUpdateDetails: (
    opportunityId: string,
    evidenceId: string,
    details: StructuredEvidenceDetails,
  ) => void;
};

const evidenceTypes = evidenceTypeSchema.options;

export function EvidenceSection({
  opportunityId,
  evidence,
  onAdd,
  onRemove,
  onUpdateDetails,
}: EvidenceSectionProps) {
  const [type, setType] = useState<(typeof evidenceTypes)[number]>(
    "ownership_document",
  );
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ displayName?: string; type?: string }>(
    {},
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    const form = event.currentTarget;

    const parsed = evidenceIntakeSchema.safeParse({
      type,
      displayName: displayName.trim() || file?.name || "",
      description,
    });

    if (!parsed.success) {
      const fieldErrors = flattenError(parsed.error).fieldErrors;
      setErrors({
        type: fieldErrors.type?.[0],
        displayName: fieldErrors.displayName?.[0],
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(opportunityId, parsed.data, file);
      setDisplayName("");
      setDescription("");
      setFile(null);
      setErrors({});
      form.reset();
      setType("ownership_document");
    } catch {
      setSubmitError("The evidence record could not be saved.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section aria-labelledby="evidence-heading" className="space-y-4">
      <div className="space-y-1">
        <h2
          id="evidence-heading"
          className="text-sm font-medium tracking-wide text-foreground uppercase"
        >
          Evidence
        </h2>
        <p className="text-sm text-muted-foreground">
          These are local submitted-material records. Uploading a file does not
          authenticate it, prove ownership, or start verification. Attachments
          over {formatFileSize(MAX_PERSISTED_FILE_BYTES)} keep metadata only.
        </p>
      </div>

      {evidence.length === 0 ? (
        <EmptyState
          title="No evidence records yet"
          description="Add a record to capture what was submitted. An empty evidence list is not a finding."
        />
      ) : (
        <ul className="space-y-3">
          {evidence.map((item) => (
            <li
              key={item.id}
              id={`evidence-${item.id}`}
              className="scroll-mt-20 rounded-lg border border-border bg-card p-3"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    {item.displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {evidenceTypeLabels[item.type]} · Added{" "}
                    {formatDate(item.createdAt)}
                  </p>
                  {item.description ? (
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}
                  {item.file ? (
                    <p className="text-xs text-muted-foreground">
                      {item.file.fileName} · {formatFileSize(item.file.fileSize)}
                      {item.file.bytesPersisted ? " · preview stored locally" : " · metadata only"}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Metadata only. No file attached.
                    </p>
                  )}
                  {item.storageNote ? (
                    <p className="text-xs leading-4 text-muted-foreground">
                      {item.storageNote}
                    </p>
                  ) : null}
                  {item.file?.dataUrl ? (
                    <a
                      href={item.file.dataUrl}
                      download={item.file.fileName}
                      className="inline-flex text-xs text-primary hover:underline"
                    >
                      Download local copy
                    </a>
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemove(opportunityId, item.id)}
                >
                  Remove
                </Button>
              </div>
              <div className="mt-3">
                <StructuredDetailsEditor
                  evidenceId={item.id}
                  details={item.structuredDetails}
                  onSave={(details) =>
                    onUpdateDetails(opportunityId, item.id, details)
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={onSubmit}
        noValidate
        className="space-y-4 rounded-lg border border-border bg-card p-4"
      >
        <h3 className="text-sm font-medium text-foreground">
          Add evidence record
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="evidenceType" label="Evidence type" error={errors.type}>
            <NativeSelect
              id="evidenceType"
              value={type}
              onChange={(event) =>
                setType(event.target.value as (typeof evidenceTypes)[number])
              }
            >
              {evidenceTypes.map((value) => (
                <option key={value} value={value}>
                  {evidenceTypeLabels[value]}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field
            id="evidenceName"
            label="Display name"
            error={errors.displayName}
          >
            <Input
              id="evidenceName"
              value={displayName}
              onChange={(event) => {
                setDisplayName(event.target.value);
                setErrors((current) => ({ ...current, displayName: undefined }));
              }}
              placeholder="Cap table excerpt"
              aria-invalid={Boolean(errors.displayName)}
              aria-describedby={
                errors.displayName ? "evidenceName-error" : undefined
              }
            />
          </Field>
        </div>
        <Field id="evidenceDescription" label="Description">
          <Textarea
            id="evidenceDescription"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional note about what this material is claimed to be"
          />
        </Field>
        <Field
          id="evidenceFile"
          label="File attachment"
          hint="Optional. Large files store metadata only. A hash or file presence does not prove ownership."
        >
          <Input
            id="evidenceFile"
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </Field>
        {submitError ? (
          <p className="text-sm text-destructive" role="alert">
            {submitError}
          </p>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding…" : "Add evidence record"}
        </Button>
      </form>
    </section>
  );
}
