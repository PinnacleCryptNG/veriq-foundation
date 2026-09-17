import {
  MAX_RUNS_PER_OPPORTUNITY,
  VERIFICATION_STORAGE_KEY,
  VERIFICATION_STORAGE_VERSION,
} from "@/config/storage";
import {
  storedVerificationStateSchema,
  verificationRunSchema,
  type VerificationRun,
} from "@/types/verification";

export type VerificationLoadResult = {
  runs: VerificationRun[];
  warning: string | null;
  persistError: string | null;
};

export const emptyVerificationResult: VerificationLoadResult = {
  runs: [],
  warning: null,
  persistError: null,
};

export const VERIFICATION_CHANGED_EVENT = "veriq:verification-runs-changed";

let memoryState: string | null = null;
let snapshotCache: { key: string; result: VerificationLoadResult } | null = null;
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
    window.dispatchEvent(new Event(VERIFICATION_CHANGED_EVENT));
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
    return window.localStorage.getItem(VERIFICATION_STORAGE_KEY) ?? memoryState;
  } catch {
    return memoryState;
  }
}

function writeRaw(value: string): string | null {
  memoryState = value;
  if (!canUseLocalStorage()) {
    return "Browser storage is not available. The review run is kept in memory for this session only and was not saved.";
  }
  try {
    window.localStorage.setItem(VERIFICATION_STORAGE_KEY, value);
    return null;
  } catch {
    return "Could not write verification runs to localStorage. The run is kept in memory for this session only and is not saved as durable storage.";
  }
}

export function parseStoredVerificationRuns(raw: string | null): {
  runs: VerificationRun[];
  warning: string | null;
} {
  if (raw === null || raw.trim().length === 0) {
    return { runs: [], warning: null };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      runs: [],
      warning:
        "Saved review runs were unreadable and were ignored. Opportunity records were not changed.",
    };
  }

  const stored = storedVerificationStateSchema.safeParse(parsed);
  if (!stored.success) {
    return {
      runs: [],
      warning:
        "Saved review runs were malformed and were ignored. Opportunity records were not changed.",
    };
  }

  const runs: VerificationRun[] = [];
  let skipped = 0;
  for (const item of stored.data.runs) {
    const result = verificationRunSchema.safeParse(item);
    if (result.success) {
      runs.push(result.data);
    } else {
      skipped += 1;
    }
  }

  return {
    runs,
    warning:
      skipped > 0
        ? `${skipped} stored review ${skipped === 1 ? "run" : "runs"} could not be read and ${skipped === 1 ? "was" : "were"} skipped.`
        : null,
  };
}

function loadAll(): VerificationLoadResult {
  const parsed = parseStoredVerificationRuns(readRaw());
  return {
    runs: parsed.runs,
    warning: parsed.warning,
    persistError: lastPersistError,
  };
}

export function subscribeToVerificationRuns(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === VERIFICATION_STORAGE_KEY || event.key === null) {
      invalidateSnapshot();
      onStoreChange();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(VERIFICATION_CHANGED_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(VERIFICATION_CHANGED_EVENT, onStoreChange);
  };
}

export function getVerificationRunsSnapshot(): VerificationLoadResult {
  const key = cacheKey();
  if (snapshotCache?.key === key) {
    return snapshotCache.result;
  }
  const result = loadAll();
  snapshotCache = { key, result };
  return result;
}

export function getServerVerificationRunsSnapshot(): VerificationLoadResult {
  return emptyVerificationResult;
}

function persist(runs: VerificationRun[]): VerificationLoadResult {
  const payload = JSON.stringify({
    version: VERIFICATION_STORAGE_VERSION,
    runs,
  });
  lastPersistError = writeRaw(payload);
  notifyChanged();
  return {
    runs,
    warning: null,
    persistError: lastPersistError,
  };
}

export function saveVerificationRun(run: VerificationRun): VerificationLoadResult & {
  saved: boolean;
  run: VerificationRun;
} {
  const parsed = verificationRunSchema.parse(run);
  const current = loadAll();
  const others = current.runs.filter(
    (item) =>
      !(item.opportunityId === parsed.opportunityId && item.id === parsed.id),
  );
  const forOpportunity = others.filter(
    (item) => item.opportunityId === parsed.opportunityId,
  );
  const remaining = others.filter(
    (item) => item.opportunityId !== parsed.opportunityId,
  );
  const nextForOpportunity = [parsed, ...forOpportunity].slice(
    0,
    MAX_RUNS_PER_OPPORTUNITY,
  );
  const saved = persist([...nextForOpportunity, ...remaining]);
  return {
    ...saved,
    warning: current.warning,
    saved: saved.persistError === null,
    run: parsed,
  };
}

export function runsForOpportunity(
  runs: VerificationRun[],
  opportunityId: string,
): VerificationRun[] {
  return runs
    .filter((run) => run.opportunityId === opportunityId)
    .sort((left, right) => right.timestamp.localeCompare(left.timestamp));
}
