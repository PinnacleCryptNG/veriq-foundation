export function extractStoredList(
  parsed: unknown,
  key: "opportunities" | "runs",
): { items: unknown[]; warning: string | null } {
  if (Array.isArray(parsed)) {
    return {
      items: parsed,
      warning: `Saved ${key} used an older shape. Readable records were kept.`,
    };
  }

  if (!parsed || typeof parsed !== "object") {
    return { items: [], warning: null };
  }

  const record = parsed as Record<string, unknown>;
  const items = record[key];
  if (!Array.isArray(items)) {
    return { items: [], warning: null };
  }

  if (record.version !== 1) {
    return {
      items,
      warning: `Saved ${key} used an unexpected storage version. Readable records were kept.`,
    };
  }

  return { items, warning: null };
}
