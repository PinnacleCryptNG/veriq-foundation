export const MONEY_SCALE = 2;
export const QUANTITY_SCALE = 6;
export const MONEY_TOLERANCE_MINOR = BigInt(1);

export type DecimalParseResult =
  | { ok: true; minor: bigint }
  | { ok: false; reason: string };

export function parseDecimal(
  value: string,
  fractionDigits: number,
): DecimalParseResult {
  const normalized = value.trim().replace(/,/g, "");
  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return {
      ok: false,
      reason: `"${value}" is not a non-negative decimal.`,
    };
  }

  const [whole, fraction = ""] = normalized.split(".");
  if (fraction.length > fractionDigits) {
    return {
      ok: false,
      reason: `"${value}" has more than ${fractionDigits} decimal places.`,
    };
  }

  const padded = fraction.padEnd(fractionDigits, "0");
  const scale = BigInt(10) ** BigInt(fractionDigits);
  const minor = BigInt(whole) * scale + BigInt(padded || "0");
  return { ok: true, minor };
}

export function parseMoney(value: string): DecimalParseResult {
  return parseDecimal(value, MONEY_SCALE);
}

export function parseQuantity(value: string): DecimalParseResult {
  return parseDecimal(value, QUANTITY_SCALE);
}

export function formatMinor(minor: bigint, fractionDigits: number): string {
  const scale = BigInt(10) ** BigInt(fractionDigits);
  const negative = minor < BigInt(0);
  const absolute = negative ? -minor : minor;
  const whole = absolute / scale;
  const fraction = (absolute % scale).toString().padStart(fractionDigits, "0");
  return `${negative ? "-" : ""}${whole.toString()}.${fraction}`;
}

export function formatMoneyMinor(minor: bigint): string {
  return formatMinor(minor, MONEY_SCALE);
}

export function multiplyQuantityByUnitPrice(
  quantityMinor: bigint,
  unitPriceMinor: bigint,
): bigint {
  const scale = BigInt(10) ** BigInt(QUANTITY_SCALE);
  const half = scale / BigInt(2);
  return (quantityMinor * unitPriceMinor + half) / scale;
}

export function exceedsTolerance(
  left: bigint,
  right: bigint,
  tolerance: bigint = MONEY_TOLERANCE_MINOR,
): boolean {
  const delta = left > right ? left - right : right - left;
  return delta > tolerance;
}

export const ARITHMETIC_POLICY =
  "Money uses integer minor units with 2 decimal places (cents). Quantities use 6 decimal places. Quantity × unit price is rounded half-up to cents. Amounts match when they differ by at most 1 cent. Floating-point equality is not used.";
