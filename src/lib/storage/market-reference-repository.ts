import {
  MARKET_REFERENCE_STORAGE_KEY,
  MARKET_REFERENCE_STORAGE_VERSION,
} from "@/config/prestocks";
import { nowIso } from "@/lib/ids";
import { z } from "zod";

export const marketReferenceSchema = z.object({
  opportunityId: z.string().min(1),
  symbol: z.string().min(1),
  selectedAt: z.iso.datetime(),
});

export type MarketReference = z.infer<typeof marketReferenceSchema>;

export type MarketReferenceLoadResult = {
  references: MarketReference[];
  warning: string | null;
  persistError: string | null;
};

export const emptyMarketReferenceResult: MarketReferenceLoadResult = {
  references: [],
  warning: null,
  persistError: null,
};

export const MARKET_REFERENCE_CHANGED_EVENT = "veriq:prestocks-references-changed";

let memoryState: string | null = null;
let snapshotCache: { key: string; result: MarketReferenceLoadResult } | null =
  null;
let lastPersistError: string | null = null;

function cacheKey(): string {
  return `${readRaw() ?? ""}::${memoryState ?? ""}`;
}

function invalidateSnapshot() {
  snapshotCache = null;
}

function notifyChanged() {
  invalidateSnapshot();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(MARKET_REFERENCE_CHANGED_EVENT));
  }
}

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readRaw(): string | null {
  if (!canUseLocalStorage()) {
    return memoryState;
  }
  try {
    return window.localStorage.getItem(MARKET_REFERENCE_STORAGE_KEY) ?? memoryState;
  } catch {
    return memoryState;
  }
}

function writeRaw(value: string): string | null {
  memoryState = value;
  if (!canUseLocalStorage()) {
    return "Browser storage is not available. The PreStocks reference is kept in memory for this session only.";
  }
  try {
    window.localStorage.setItem(MARKET_REFERENCE_STORAGE_KEY, value);
    return null;
  } catch {
    return "Could not write PreStocks references to localStorage. The selection is kept in memory for this session only.";
  }
}

export function parseStoredMarketReferences(raw: string | null): {
  references: MarketReference[];
  warning: string | null;
} {
  if (raw === null || raw.trim().length === 0) {
    return { references: [], warning: null };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      references: [],
      warning:
        "Saved PreStocks references were unreadable and were ignored. Opportunity records were not changed.",
    };
  }

  if (Array.isArray(parsed)) {
    const references: MarketReference[] = [];
    for (const item of parsed) {
      const result = marketReferenceSchema.safeParse(item);
      if (result.success) references.push(result.data);
    }
    return {
      references,
      warning:
        "Saved PreStocks references used an older shape. Readable selections were kept. Opportunity records were not changed.",
    };
  }

  if (!parsed || typeof parsed !== "object" || !("references" in parsed)) {
    return {
      references: [],
      warning:
        "Saved PreStocks references were malformed and were ignored. Opportunity records were not changed.",
    };
  }

  const record = parsed as { version?: unknown; references?: unknown };
  if (!Array.isArray(record.references)) {
    return {
      references: [],
      warning:
        "Saved PreStocks references were malformed and were ignored. Opportunity records were not changed.",
    };
  }

  const references: MarketReference[] = [];
  let skipped = 0;
  for (const item of record.references) {
    const result = marketReferenceSchema.safeParse(item);
    if (result.success) {
      references.push(result.data);
    } else {
      skipped += 1;
    }
  }

  const versionWarning =
    record.version !== MARKET_REFERENCE_STORAGE_VERSION
      ? "Saved PreStocks references used an unexpected storage version. Readable selections were kept."
      : null;
  const skipWarning =
    skipped > 0
      ? `${skipped} stored PreStocks ${skipped === 1 ? "reference" : "references"} could not be read and ${skipped === 1 ? "was" : "were"} skipped.`
      : null;
  const warnings = [versionWarning, skipWarning].filter(Boolean);

  return {
    references,
    warning: warnings.length > 0 ? warnings.join(" ") : null,
  };
}

function loadAll(): MarketReferenceLoadResult {
  const parsed = parseStoredMarketReferences(readRaw());
  return {
    references: parsed.references,
    warning: parsed.warning,
    persistError: lastPersistError,
  };
}

export function subscribeToMarketReferences(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === MARKET_REFERENCE_STORAGE_KEY || event.key === null) {
      invalidateSnapshot();
      onStoreChange();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(MARKET_REFERENCE_CHANGED_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(MARKET_REFERENCE_CHANGED_EVENT, onStoreChange);
  };
}

export function getMarketReferencesSnapshot(): MarketReferenceLoadResult {
  const key = cacheKey();
  if (snapshotCache?.key === key) {
    return snapshotCache.result;
  }
  const result = loadAll();
  snapshotCache = { key, result };
  return result;
}

export function getServerMarketReferencesSnapshot(): MarketReferenceLoadResult {
  return emptyMarketReferenceResult;
}

function persist(references: MarketReference[]): MarketReferenceLoadResult {
  const payload = JSON.stringify({
    version: MARKET_REFERENCE_STORAGE_VERSION,
    references,
  });
  lastPersistError = writeRaw(payload);
  notifyChanged();
  return {
    references,
    warning: null,
    persistError: lastPersistError,
  };
}

export function setMarketReference(
  opportunityId: string,
  symbol: string,
): MarketReferenceLoadResult & { reference: MarketReference } {
  const reference = marketReferenceSchema.parse({
    opportunityId,
    symbol: symbol.trim().toUpperCase(),
    selectedAt: nowIso(),
  });
  const current = loadAll();
  const next = [
    reference,
    ...current.references.filter((item) => item.opportunityId !== opportunityId),
  ];
  const saved = persist(next);
  return { ...saved, warning: current.warning, reference };
}

export function clearMarketReference(
  opportunityId: string,
): MarketReferenceLoadResult {
  const current = loadAll();
  return persist(
    current.references.filter((item) => item.opportunityId !== opportunityId),
  );
}

export function referenceForOpportunity(
  references: MarketReference[],
  opportunityId: string,
): MarketReference | undefined {
  return references.find((item) => item.opportunityId === opportunityId);
}
