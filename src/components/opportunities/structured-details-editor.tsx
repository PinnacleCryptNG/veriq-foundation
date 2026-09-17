"use client";

import { useState, type ReactNode } from "react";
import { Field } from "@/components/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import {
  evidenceEntryReminder,
  structuredFieldGroups,
  type StructuredFieldGroupId,
} from "@/config/evidence-guidance";
import { parseMoney, parseQuantity } from "@/engine/money";
import {
  currencyLabels,
  securityInterestLabels,
  transferRestrictionLabels,
  valuationReferenceTypeLabels,
  valuationUnitLabels,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { EvidenceType } from "@/types/opportunity";
import { currencySchema, type CurrencyCode } from "@/types/primitives";
import {
  securityInterestSchema,
  transferRestrictionSchema,
  valuationReferenceTypeSchema,
  valuationUnitSchema,
  type StructuredEvidenceDetails,
} from "@/types/verification";

const securityTypes = securityInterestSchema.options;
const restrictions = transferRestrictionSchema.options;
const currencies = currencySchema.options;
const valuationUnits = valuationUnitSchema.options;
const valuationTypes = valuationReferenceTypeSchema.options;

type StructuredDetailsEditorProps = {
  evidenceId: string;
  evidenceType: EvidenceType;
  details?: StructuredEvidenceDetails;
  onSave: (details: StructuredEvidenceDetails) => void;
};

export function StructuredDetailsEditor({
  evidenceId,
  evidenceType,
  details,
  onSave,
}: StructuredDetailsEditorProps) {
  const [securityType, setSecurityType] = useState(details?.securityType ?? "");
  const [restriction, setRestriction] = useState(
    details?.transfer?.restriction ?? "",
  );
  const [valuationAmount, setValuationAmount] = useState(
    details?.valuation?.amount ?? "",
  );
  const [valuationCurrency, setValuationCurrency] = useState(
    details?.valuation?.currency ?? "USD",
  );
  const [valuationUnit, setValuationUnit] = useState(
    details?.valuation?.unit ?? "",
  );
  const [valuationType, setValuationType] = useState(
    details?.valuation?.referenceType ?? "",
  );
  const [valuationDate, setValuationDate] = useState(
    details?.valuation?.referenceDate ?? "",
  );
  const [valuationBasis, setValuationBasis] = useState(
    details?.valuation?.basis ?? "",
  );
  const [quantity, setQuantity] = useState(details?.transaction?.quantity ?? "");
  const [unitPrice, setUnitPrice] = useState(
    details?.transaction?.unitPrice ?? "",
  );
  const [transactionCurrency, setTransactionCurrency] = useState(
    details?.transaction?.currency ?? "USD",
  );
  const [fees, setFees] = useState(details?.transaction?.fees ?? "");
  const [statedTotal, setStatedTotal] = useState(
    details?.transaction?.statedTotal ?? "",
  );
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  function save() {
    setError(null);
    const nextErrors: Record<string, string> = {};
    const next: StructuredEvidenceDetails = {};

    if (securityType) {
      next.securityType = securityInterestSchema.parse(securityType);
    }
    if (restriction) {
      next.transfer = {
        restriction: transferRestrictionSchema.parse(restriction),
      };
    }

    const valuationStarted = Boolean(
      valuationAmount || valuationUnit || valuationType || valuationDate || valuationBasis,
    );
    if (valuationStarted) {
      if (!valuationAmount) {
        nextErrors.valuationAmount = "Enter the amount shown in the evidence, or clear the other valuation fields.";
      } else {
        const parsed = parseMoney(valuationAmount.trim());
        if (!parsed.ok) {
          nextErrors.valuationAmount = parsed.reason;
        }
      }
      if (!valuationUnit) {
        nextErrors.valuationUnit = "Select a unit. The engine will not infer it.";
      }
      if (!valuationType) {
        nextErrors.valuationType = "Select a reference type. Asking price is the only basis compared with the quoted price.";
      }
      if (Object.keys(nextErrors).length === 0) {
        next.valuation = {
          amount: valuationAmount.trim(),
          currency: currencySchema.parse(valuationCurrency),
          unit: valuationUnitSchema.parse(valuationUnit),
          referenceType: valuationReferenceTypeSchema.parse(valuationType),
          referenceDate: valuationDate.trim() || undefined,
          basis: valuationBasis.trim() || undefined,
        };
      }
    }

    const transactionStarted = Boolean(quantity || unitPrice || fees || statedTotal);
    if (transactionStarted) {
      if (!quantity) {
        nextErrors.quantity = "Enter quantity from the evidence, or clear the other transaction fields.";
      } else {
        const parsed = parseQuantity(quantity.trim());
        if (!parsed.ok) {
          nextErrors.quantity = parsed.reason;
        }
      }
      if (!unitPrice) {
        nextErrors.unitPrice = "Enter unit price from the evidence.";
      } else {
        const parsed = parseMoney(unitPrice.trim());
        if (!parsed.ok) {
          nextErrors.unitPrice = parsed.reason;
        }
      }
      if (fees.trim()) {
        const parsed = parseMoney(fees.trim());
        if (!parsed.ok) {
          nextErrors.fees = parsed.reason;
        }
      }
      if (statedTotal.trim()) {
        const parsed = parseMoney(statedTotal.trim());
        if (!parsed.ok) {
          nextErrors.statedTotal = parsed.reason;
        }
      }
      if (!nextErrors.quantity && !nextErrors.unitPrice && !nextErrors.fees && !nextErrors.statedTotal) {
        next.transaction = {
          quantity: quantity.trim(),
          unitPrice: unitPrice.trim(),
          currency: currencySchema.parse(transactionCurrency),
          fees: fees.trim() || undefined,
          statedTotal: statedTotal.trim() || undefined,
        };
      }
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setError("Fix the highlighted fields. Missing values are not filled in automatically.");
      return;
    }

    onSave(next);
    setSaved(true);
  }

  return (
    <div
      id={`structured-${evidenceId}`}
      className="scroll-mt-20 space-y-4 rounded-md border border-border bg-background/40 p-3"
    >
      <div className="space-y-1">
        <p className="text-xs font-medium text-foreground">
          User-entered structured values
        </p>
        <p className="text-xs text-muted-foreground">{evidenceEntryReminder}</p>
      </div>

      {structuredFieldGroups.map((group) => {
        const recommended = group.recommendedFor.includes(evidenceType);
        return (
          <FieldGroup
            key={group.id}
            evidenceId={evidenceId}
            groupId={group.id}
            ruleId={group.ruleId}
            title={group.title}
            required={group.required}
            why={group.why}
            recommended={recommended}
          >
            {group.id === "security" ? (
              <Field
                id={fieldId(evidenceId, "securityType")}
                label="Structured security type"
                error={fieldErrors.securityType}
              >
                <NativeSelect
                  id={fieldId(evidenceId, "securityType")}
                  value={securityType}
                  onChange={(event) => {
                    setSecurityType(event.target.value);
                    setSaved(false);
                  }}
                >
                  <option value="">Not provided</option>
                  {securityTypes.map((value) => (
                    <option key={value} value={value}>
                      {securityInterestLabels[value]}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
            ) : null}

            {group.id === "transfer" ? (
              <Field
                id={fieldId(evidenceId, "restriction")}
                label="Transfer terms"
                error={fieldErrors.restriction}
              >
                <NativeSelect
                  id={fieldId(evidenceId, "restriction")}
                  value={restriction}
                  onChange={(event) => {
                    setRestriction(event.target.value);
                    setSaved(false);
                  }}
                >
                  <option value="">Not provided</option>
                  {restrictions.map((value) => (
                    <option key={value} value={value}>
                      {transferRestrictionLabels[value]}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
            ) : null}

            {group.id === "valuation" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  id={fieldId(evidenceId, "valuationAmount")}
                  label="Valuation amount"
                  error={fieldErrors.valuationAmount}
                >
                  <Input
                    id={fieldId(evidenceId, "valuationAmount")}
                    value={valuationAmount}
                    onChange={(event) => {
                      setValuationAmount(event.target.value);
                      setSaved(false);
                    }}
                    placeholder="18.00"
                    aria-invalid={Boolean(fieldErrors.valuationAmount)}
                  />
                </Field>
                <Field
                  id={fieldId(evidenceId, "valuationCurrency")}
                  label="Valuation currency"
                >
                  <NativeSelect
                    id={fieldId(evidenceId, "valuationCurrency")}
                    value={valuationCurrency}
                    onChange={(event) => {
                      setValuationCurrency(event.target.value as CurrencyCode);
                      setSaved(false);
                    }}
                  >
                    {currencies.map((value) => (
                      <option key={value} value={value}>
                        {currencyLabels[value]}
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
                <Field
                  id={fieldId(evidenceId, "valuationUnit")}
                  label="Valuation unit"
                  error={fieldErrors.valuationUnit}
                >
                  <NativeSelect
                    id={fieldId(evidenceId, "valuationUnit")}
                    value={valuationUnit}
                    onChange={(event) => {
                      setValuationUnit(event.target.value);
                      setSaved(false);
                    }}
                  >
                    <option value="">Not provided</option>
                    {valuationUnits.map((value) => (
                      <option key={value} value={value}>
                        {valuationUnitLabels[value]}
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
                <Field
                  id={fieldId(evidenceId, "valuationType")}
                  label="Valuation reference type"
                  error={fieldErrors.valuationType}
                >
                  <NativeSelect
                    id={fieldId(evidenceId, "valuationType")}
                    value={valuationType}
                    onChange={(event) => {
                      setValuationType(event.target.value);
                      setSaved(false);
                    }}
                  >
                    <option value="">Not provided</option>
                    {valuationTypes.map((value) => (
                      <option key={value} value={value}>
                        {valuationReferenceTypeLabels[value]}
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
                <Field id={fieldId(evidenceId, "valuationDate")} label="Valuation date">
                  <Input
                    id={fieldId(evidenceId, "valuationDate")}
                    type="date"
                    value={valuationDate}
                    onChange={(event) => {
                      setValuationDate(event.target.value);
                      setSaved(false);
                    }}
                  />
                </Field>
                <Field
                  id={fieldId(evidenceId, "valuationBasis")}
                  label="Valuation basis / note"
                >
                  <Input
                    id={fieldId(evidenceId, "valuationBasis")}
                    value={valuationBasis}
                    onChange={(event) => {
                      setValuationBasis(event.target.value);
                      setSaved(false);
                    }}
                    placeholder="Optional basis from the evidence"
                  />
                </Field>
              </div>
            ) : null}

            {group.id === "transaction" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  id={fieldId(evidenceId, "quantity")}
                  label="Transaction quantity"
                  error={fieldErrors.quantity}
                >
                  <Input
                    id={fieldId(evidenceId, "quantity")}
                    value={quantity}
                    onChange={(event) => {
                      setQuantity(event.target.value);
                      setSaved(false);
                    }}
                    placeholder="400"
                    aria-invalid={Boolean(fieldErrors.quantity)}
                  />
                </Field>
                <Field
                  id={fieldId(evidenceId, "unitPrice")}
                  label="Transaction unit price"
                  error={fieldErrors.unitPrice}
                >
                  <Input
                    id={fieldId(evidenceId, "unitPrice")}
                    value={unitPrice}
                    onChange={(event) => {
                      setUnitPrice(event.target.value);
                      setSaved(false);
                    }}
                    placeholder="18.00"
                    aria-invalid={Boolean(fieldErrors.unitPrice)}
                  />
                </Field>
                <Field
                  id={fieldId(evidenceId, "txCurrency")}
                  label="Transaction currency"
                >
                  <NativeSelect
                    id={fieldId(evidenceId, "txCurrency")}
                    value={transactionCurrency}
                    onChange={(event) => {
                      setTransactionCurrency(event.target.value as CurrencyCode);
                      setSaved(false);
                    }}
                  >
                    {currencies.map((value) => (
                      <option key={value} value={value}>
                        {currencyLabels[value]}
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
                <Field
                  id={fieldId(evidenceId, "fees")}
                  label="Fees, if provided"
                  error={fieldErrors.fees}
                >
                  <Input
                    id={fieldId(evidenceId, "fees")}
                    value={fees}
                    onChange={(event) => {
                      setFees(event.target.value);
                      setSaved(false);
                    }}
                    placeholder="25.00"
                  />
                </Field>
                <Field
                  id={fieldId(evidenceId, "statedTotal")}
                  label="Stated payment amount"
                  error={fieldErrors.statedTotal}
                  hint="Required for R04. Leave blank if the evidence does not state a payment amount. The engine will not infer it."
                >
                  <Input
                    id={fieldId(evidenceId, "statedTotal")}
                    value={statedTotal}
                    onChange={(event) => {
                      setStatedTotal(event.target.value);
                      setSaved(false);
                    }}
                    placeholder="7225.00"
                    aria-invalid={Boolean(fieldErrors.statedTotal)}
                  />
                </Field>
              </div>
            ) : null}
          </FieldGroup>
        );
      })}

      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex items-center gap-2">
        <Button type="button" size="sm" onClick={save}>
          Save structured details
        </Button>
        {saved ? (
          <span className="text-xs text-muted-foreground">
            Saved locally. This is not a verification result.
          </span>
        ) : null}
      </div>
    </div>
  );
}

function FieldGroup({
  evidenceId,
  groupId,
  ruleId,
  title,
  required,
  why,
  recommended,
  children,
}: {
  evidenceId: string;
  groupId: StructuredFieldGroupId;
  ruleId: string;
  title: string;
  required: string[];
  why: string;
  recommended: boolean;
  children: ReactNode;
}) {
  const headingId = `structured-${evidenceId}-${groupId}-heading`;
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "space-y-3 rounded-md border p-3",
        recommended
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-transparent",
      )}
    >
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4
            id={headingId}
            className="text-xs font-medium tracking-wide text-foreground uppercase"
          >
            {ruleId} · {title}
          </h4>
          <span className="text-[11px] text-muted-foreground">
            {recommended
              ? "Recommended for this evidence type"
              : "Optional unless this material states these facts"}
          </span>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">{why}</p>
        <p className="text-[11px] text-muted-foreground">
          Required for this check: {required.join("; ")}.
        </p>
      </div>
      {children}
    </section>
  );
}

function fieldId(evidenceId: string, name: string) {
  return `structured-${evidenceId}-${name}`;
}
