"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { flattenError } from "zod";
import { Field } from "@/components/field";
import { LinkButton } from "@/components/link-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { useOpportunities } from "@/hooks/use-opportunities";
import { currencyLabels, instrumentLabels } from "@/lib/format";
import {
  currencySchema,
  opportunityInstrumentSchema,
  opportunityIntakeSchema,
} from "@/types/opportunity";

type FieldErrors = Partial<Record<keyof typeof defaultValues, string>>;

const defaultValues = {
  companyName: "",
  instrument: "",
  shareClass: "",
  sellerOrIntermediary: "",
  quantityOffered: "",
  quotedPrice: "",
  currency: "USD",
  claimedSummary: "",
};

const instruments = opportunityInstrumentSchema.options;
const currencies = currencySchema.options;

export function OpportunityIntakeForm() {
  const router = useRouter();
  const { create, persistError } = useOpportunities();
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(name: keyof typeof defaultValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = opportunityIntakeSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors = flattenError(parsed.error).fieldErrors;
      setErrors({
        companyName: fieldErrors.companyName?.[0],
        instrument: fieldErrors.instrument?.[0],
        shareClass: fieldErrors.shareClass?.[0],
        sellerOrIntermediary: fieldErrors.sellerOrIntermediary?.[0],
        quantityOffered: fieldErrors.quantityOffered?.[0],
        quotedPrice: fieldErrors.quotedPrice?.[0],
        currency: fieldErrors.currency?.[0],
        claimedSummary: fieldErrors.claimedSummary?.[0],
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = create(parsed.data);
      router.push(`/opportunities/${result.opportunity.id}`);
    } catch {
      setIsSubmitting(false);
      setFormError("The opportunity could not be saved. Check the form and try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7">
      <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
        <Field
          id="companyName"
          label="Company name"
          error={errors.companyName}
        >
          <Input
            id="companyName"
            name="companyName"
            value={values.companyName}
            onChange={(event) => update("companyName", event.target.value)}
            placeholder="Legal name of the private company"
            autoComplete="organization"
            aria-invalid={Boolean(errors.companyName)}
            aria-describedby={errors.companyName ? "companyName-error" : undefined}
          />
        </Field>
        <Field
          id="instrument"
          label="Security or interest type"
          error={errors.instrument}
        >
          <NativeSelect
            id="instrument"
            name="instrument"
            value={values.instrument}
            onChange={(event) => update("instrument", event.target.value)}
            aria-invalid={Boolean(errors.instrument)}
            aria-describedby={errors.instrument ? "instrument-error" : undefined}
          >
            <option value="">Select type</option>
            {instruments.map((instrument) => (
              <option key={instrument} value={instrument}>
                {instrumentLabels[instrument]}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field
          id="shareClass"
          label="Share class, if known"
          hint="Optional. Example: Common, Series D Preferred."
          error={errors.shareClass}
        >
          <Input
            id="shareClass"
            name="shareClass"
            value={values.shareClass}
            onChange={(event) => update("shareClass", event.target.value)}
            placeholder="Share class or leave blank"
            aria-invalid={Boolean(errors.shareClass)}
            aria-describedby={
              errors.shareClass ? "shareClass-error" : "shareClass-hint"
            }
          />
        </Field>
        <Field
          id="sellerOrIntermediary"
          label="Seller or intermediary"
          error={errors.sellerOrIntermediary}
        >
          <Input
            id="sellerOrIntermediary"
            name="sellerOrIntermediary"
            value={values.sellerOrIntermediary}
            onChange={(event) =>
              update("sellerOrIntermediary", event.target.value)
            }
            placeholder="Name of the seller or introducing intermediary"
            aria-invalid={Boolean(errors.sellerOrIntermediary)}
            aria-describedby={
              errors.sellerOrIntermediary
                ? "sellerOrIntermediary-error"
                : undefined
            }
          />
        </Field>
        <Field
          id="quantityOffered"
          label="Quantity offered"
          error={errors.quantityOffered}
        >
          <Input
            id="quantityOffered"
            name="quantityOffered"
            inputMode="decimal"
            value={values.quantityOffered}
            onChange={(event) => update("quantityOffered", event.target.value)}
            placeholder="12400"
            aria-invalid={Boolean(errors.quantityOffered)}
            aria-describedby={
              errors.quantityOffered ? "quantityOffered-error" : undefined
            }
          />
        </Field>
        <div className="grid grid-cols-[minmax(0,1fr)_7rem] gap-3">
          <Field
            id="quotedPrice"
            label="Quoted price"
            hint="Claimed figure only. Not a valuation finding."
            error={errors.quotedPrice}
          >
            <Input
              id="quotedPrice"
              name="quotedPrice"
              inputMode="decimal"
              value={values.quotedPrice}
              onChange={(event) => update("quotedPrice", event.target.value)}
              placeholder="45.00"
              aria-invalid={Boolean(errors.quotedPrice)}
              aria-describedby={
                errors.quotedPrice ? "quotedPrice-error" : "quotedPrice-hint"
              }
            />
          </Field>
          <Field id="currency" label="Currency" error={errors.currency}>
            <NativeSelect
              id="currency"
              name="currency"
              value={values.currency}
              onChange={(event) => update("currency", event.target.value)}
              aria-invalid={Boolean(errors.currency)}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currencyLabels[currency]}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </div>
      </div>

      <Field
        id="claimedSummary"
        label="Short deal description"
        error={errors.claimedSummary}
      >
        <Textarea
          id="claimedSummary"
          name="claimedSummary"
          value={values.claimedSummary}
          onChange={(event) => update("claimedSummary", event.target.value)}
          placeholder="What the opportunity claims, in the submitter’s words"
          aria-invalid={Boolean(errors.claimedSummary)}
          aria-describedby={
            errors.claimedSummary ? "claimedSummary-error" : undefined
          }
        />
      </Field>

      {formError ? (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      ) : null}
      {persistError ? (
        <p className="text-sm text-destructive" role="alert">
          {persistError}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save and add evidence"}
        </Button>
        <LinkButton href="/opportunities" variant="outline">
          Cancel
        </LinkButton>
      </div>
    </form>
  );
}
