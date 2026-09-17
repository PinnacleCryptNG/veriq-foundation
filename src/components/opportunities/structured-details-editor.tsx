"use client";

import { useState } from "react";
import { Field } from "@/components/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import {
  currencyLabels,
  securityInterestLabels,
  transferRestrictionLabels,
  valuationReferenceTypeLabels,
  valuationUnitLabels,
} from "@/lib/format";
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
  details?: StructuredEvidenceDetails;
  onSave: (details: StructuredEvidenceDetails) => void;
};

export function StructuredDetailsEditor({
  evidenceId,
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
  const [saved, setSaved] = useState(false);

  function save() {
    setError(null);
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
      if (!valuationAmount || !valuationUnit || !valuationType) {
        setError(
          "To save valuation details, enter amount, unit, and reference type. The engine will not infer them.",
        );
        return;
      }
      next.valuation = {
        amount: valuationAmount.trim(),
        currency: currencySchema.parse(valuationCurrency),
        unit: valuationUnitSchema.parse(valuationUnit),
        referenceType: valuationReferenceTypeSchema.parse(valuationType),
        referenceDate: valuationDate.trim() || undefined,
        basis: valuationBasis.trim() || undefined,
      };
    }

    const transactionStarted = Boolean(quantity || unitPrice || fees || statedTotal);
    if (transactionStarted) {
      if (!quantity || !unitPrice) {
        setError(
          "To save transaction details, enter quantity and unit price. Stated total is required for arithmetic.",
        );
        return;
      }
      next.transaction = {
        quantity: quantity.trim(),
        unitPrice: unitPrice.trim(),
        currency: currencySchema.parse(transactionCurrency),
        fees: fees.trim() || undefined,
        statedTotal: statedTotal.trim() || undefined,
      };
    }

    onSave(next);
    setSaved(true);
  }

  return (
    <div className="space-y-4 rounded-md border border-border bg-background/40 p-3">
      <p className="text-xs text-muted-foreground">
        Structured values are entered by a person. They are not extracted from
        the file, filename, or description.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field id={fieldId(evidenceId, "securityType")} label="Structured security type">
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
        <Field id={fieldId(evidenceId, "restriction")} label="Transfer terms">
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
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field id={fieldId(evidenceId, "valuationAmount")} label="Valuation amount">
          <Input
            id={fieldId(evidenceId, "valuationAmount")}
            value={valuationAmount}
            onChange={(event) => {
              setValuationAmount(event.target.value);
              setSaved(false);
            }}
            placeholder="2.50"
          />
        </Field>
        <Field id={fieldId(evidenceId, "valuationCurrency")} label="Valuation currency">
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
        <Field id={fieldId(evidenceId, "valuationUnit")} label="Valuation unit">
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
        <Field id={fieldId(evidenceId, "valuationType")} label="Valuation reference type">
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
        <Field id={fieldId(evidenceId, "valuationBasis")} label="Valuation basis / note">
          <Input
            id={fieldId(evidenceId, "valuationBasis")}
            value={valuationBasis}
            onChange={(event) => {
              setValuationBasis(event.target.value);
              setSaved(false);
            }}
            placeholder="Optional basis"
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field id={fieldId(evidenceId, "quantity")} label="Transaction quantity">
          <Input
            id={fieldId(evidenceId, "quantity")}
            value={quantity}
            onChange={(event) => {
              setQuantity(event.target.value);
              setSaved(false);
            }}
            placeholder="100"
          />
        </Field>
        <Field id={fieldId(evidenceId, "unitPrice")} label="Transaction unit price">
          <Input
            id={fieldId(evidenceId, "unitPrice")}
            value={unitPrice}
            onChange={(event) => {
              setUnitPrice(event.target.value);
              setSaved(false);
            }}
            placeholder="2.50"
          />
        </Field>
        <Field id={fieldId(evidenceId, "txCurrency")} label="Transaction currency">
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
        <Field id={fieldId(evidenceId, "fees")} label="Fees, if provided">
          <Input
            id={fieldId(evidenceId, "fees")}
            value={fees}
            onChange={(event) => {
              setFees(event.target.value);
              setSaved(false);
            }}
            placeholder="10.00"
          />
        </Field>
        <Field id={fieldId(evidenceId, "statedTotal")} label="Stated payment amount">
          <Input
            id={fieldId(evidenceId, "statedTotal")}
            value={statedTotal}
            onChange={(event) => {
              setStatedTotal(event.target.value);
              setSaved(false);
            }}
            placeholder="260.00"
          />
        </Field>
      </div>

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

function fieldId(evidenceId: string, name: string) {
  return `structured-${evidenceId}-${name}`;
}
