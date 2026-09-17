import { demoOpportunities } from "@/data/demo-opportunities";
import { userRecordLimitation } from "@/config/storage";
import {
  MAX_PERSISTED_FILE_BYTES,
  STORAGE_KEY,
  STORAGE_VERSION,
} from "@/config/storage";
import { createId, nowIso } from "@/lib/ids";
import { deriveIntakeStatus } from "@/lib/opportunity-status";
import { formatFileSize } from "@/lib/format";
import { extractStoredList } from "@/lib/storage/recover-stored-list";
import {
  evidenceIntakeSchema,
  opportunityIntakeSchema,
  opportunitySchema,
  type Evidence,
  type EvidenceIntake,
  type Opportunity,
  type OpportunityIntake,
} from "@/types/opportunity";
import {
  structuredEvidenceDetailsSchema,
  type StructuredEvidenceDetails,
} from "@/types/verification";

export type LoadResult = {
  opportunities: Opportunity[];
  warning: string | null;
  persistError: string | null;
};

type MutateResult = LoadResult & {
  opportunity: Opportunity;
};

export const emptyOpportunitiesResult: LoadResult = {
  opportunities: [],
  warning: null,
  persistError: null,
};

export const OPPORTUNITIES_CHANGED_EVENT = "veriq:opportunities-changed";

let memoryState: string | null = null;
let snapshotCache: { key: string; result: LoadResult } | null = null;
let lastPersistError: string | null = null;

function cacheKey(): string {
  return `${readRaw() ?? ""}::${memoryState ?? ""}`;
}

function invalidateSnapshot() {
  snapshotCache = null;
}

function notifyOpportunitiesChanged() {
  invalidateSnapshot();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(OPPORTUNITIES_CHANGED_EVENT));
  }
}

export function subscribeToOpportunities(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      invalidateSnapshot();
      onStoreChange();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(OPPORTUNITIES_CHANGED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(OPPORTUNITIES_CHANGED_EVENT, onStoreChange);
  };
}

export function getOpportunitiesSnapshot(): LoadResult {
  const key = cacheKey();
  if (snapshotCache?.key === key) {
    return snapshotCache.result;
  }

  const result = loadOpportunities();
  snapshotCache = { key, result };
  return result;
}

export function getServerOpportunitiesSnapshot(): LoadResult {
  return serverOpportunitiesSnapshot;
}

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readRaw(): string | null {
  if (!canUseLocalStorage()) {
    return memoryState;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ?? memoryState;
  } catch {
    return memoryState;
  }
}

function writeRaw(value: string): string | null {
  memoryState = value;

  if (!canUseLocalStorage()) {
    return "Browser storage is not available. Changes are kept in memory for this session only.";
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, value);
    return null;
  } catch {
    return "Could not write to localStorage. Changes are kept in memory for this session only and are not secure production storage.";
  }
}

export function parseStoredOpportunities(raw: string | null): {
  records: Opportunity[];
  warning: string | null;
} {
  if (raw === null || raw.trim().length === 0) {
    return { records: [], warning: null };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      records: [],
      warning:
        "Saved workspace data was unreadable and was ignored. Seeded demo records are still available. Other readable browser data was not changed.",
    };
  }

  const extracted = extractStoredList(parsed, "opportunities");
  if (extracted.items.length === 0 && extracted.warning === null && parsed && typeof parsed === "object" && !("opportunities" in parsed) && !Array.isArray(parsed)) {
    return {
      records: [],
      warning:
        "Saved workspace data was malformed and was ignored. Seeded demo records are still available. Other readable browser data was not changed.",
    };
  }

  const records: Opportunity[] = [];
  let skipped = 0;

  for (const item of extracted.items) {
    const result = opportunitySchema.safeParse(item);
    if (result.success) {
      records.push(result.data);
    } else {
      skipped += 1;
    }
  }

  const warnings = [
    extracted.warning,
    skipped > 0
      ? `${skipped} stored ${skipped === 1 ? "record" : "records"} could not be read and ${skipped === 1 ? "was" : "were"} skipped.`
      : null,
  ].filter(Boolean);

  return {
    records,
    warning: warnings.length > 0 ? warnings.join(" ") : null,
  };
}

export function mergeWithDemoSeeds(stored: Opportunity[]): Opportunity[] {
  const storedIds = new Set(stored.map((record) => record.id));
  const missingSeeds = demoOpportunities.filter(
    (opportunity) => !storedIds.has(opportunity.id),
  );

  return [...stored, ...missingSeeds];
}

function sortOpportunities(opportunities: Opportunity[]): Opportunity[] {
  return [...opportunities].sort((left, right) => {
    const updated = right.updatedAt.localeCompare(left.updatedAt);
    if (updated !== 0) {
      return updated;
    }

    return left.companyName.localeCompare(right.companyName);
  });
}

const serverOpportunitiesSnapshot: LoadResult = {
  opportunities: sortOpportunities(mergeWithDemoSeeds([])),
  warning: null,
  persistError: null,
};

export function loadOpportunities(): LoadResult {
  const parsed = parseStoredOpportunities(readRaw());
  return {
    opportunities: sortOpportunities(mergeWithDemoSeeds(parsed.records)),
    warning: parsed.warning,
    persistError: lastPersistError,
  };
}

function persist(opportunities: Opportunity[]): LoadResult {
  const payload = JSON.stringify({
    version: STORAGE_VERSION,
    opportunities,
  });
  const persistError = writeRaw(payload);
  lastPersistError = persistError;
  notifyOpportunitiesChanged();

  return {
    opportunities: sortOpportunities(opportunities),
    warning: null,
    persistError,
  };
}

export function createOpportunity(input: OpportunityIntake): MutateResult {
  const intake = opportunityIntakeSchema.parse(input);
  const timestamp = nowIso();

  const opportunity: Opportunity = {
    id: createId("opp"),
    companyName: intake.companyName,
    instrument: intake.instrument,
    shareClass: intake.shareClass,
    sellerOrIntermediary: intake.sellerOrIntermediary,
    quantityOffered: intake.quantityOffered,
    quotedPrice: intake.quotedPrice,
    currency: intake.currency,
    claimedSummary: intake.claimedSummary,
    source: "Direct intake",
    status: "evidence_pending",
    missingMaterials: [],
    limitationNote: userRecordLimitation,
    evidence: [],
    createdAt: timestamp,
    updatedAt: timestamp,
    isDemo: false,
  };

  const current = loadOpportunities();
  const saved = persist([...current.opportunities, opportunity]);

  return {
    ...saved,
    warning: current.warning,
    opportunity,
  };
}

function replaceOpportunity(
  opportunities: Opportunity[],
  next: Opportunity,
): Opportunity[] {
  return opportunities.map((opportunity) =>
    opportunity.id === next.id ? next : opportunity,
  );
}

export async function addEvidenceRecord(
  opportunityId: string,
  input: EvidenceIntake,
  file?: File | null,
): Promise<MutateResult> {
  const intake = evidenceIntakeSchema.parse(input);
  const current = loadOpportunities();
  const existing = current.opportunities.find(
    (opportunity) => opportunity.id === opportunityId,
  );

  if (!existing) {
    throw new Error("Opportunity not found.");
  }

  const evidence = await buildEvidence(intake, file);
  const next: Opportunity = {
    ...existing,
    evidence: [...existing.evidence, evidence],
    status: deriveIntakeStatus(existing.evidence.length + 1),
    updatedAt: nowIso(),
  };

  const saved = persist(replaceOpportunity(current.opportunities, next));

  return {
    ...saved,
    warning: current.warning,
    opportunity: next,
  };
}

export function removeEvidenceRecord(
  opportunityId: string,
  evidenceId: string,
): MutateResult {
  const current = loadOpportunities();
  const existing = current.opportunities.find(
    (opportunity) => opportunity.id === opportunityId,
  );

  if (!existing) {
    throw new Error("Opportunity not found.");
  }

  const evidence = existing.evidence.filter((item) => item.id !== evidenceId);
  const next: Opportunity = {
    ...existing,
    evidence,
    status: deriveIntakeStatus(evidence.length),
    updatedAt: nowIso(),
  };

  const saved = persist(replaceOpportunity(current.opportunities, next));

  return {
    ...saved,
    warning: current.warning,
    opportunity: next,
  };
}

export function updateEvidenceStructuredDetails(
  opportunityId: string,
  evidenceId: string,
  details: StructuredEvidenceDetails,
): MutateResult {
  const parsedDetails = structuredEvidenceDetailsSchema.parse(details);
  const current = loadOpportunities();
  const existing = current.opportunities.find(
    (opportunity) => opportunity.id === opportunityId,
  );

  if (!existing) {
    throw new Error("Opportunity not found.");
  }

  const target = existing.evidence.find((item) => item.id === evidenceId);
  if (!target) {
    throw new Error("Evidence record not found.");
  }

  const next: Opportunity = {
    ...existing,
    evidence: existing.evidence.map((item) =>
      item.id === evidenceId
        ? { ...item, structuredDetails: parsedDetails }
        : item,
    ),
    updatedAt: nowIso(),
  };

  const saved = persist(replaceOpportunity(current.opportunities, next));
  return {
    ...saved,
    warning: current.warning,
    opportunity: next,
  };
}

async function buildEvidence(
  intake: EvidenceIntake,
  file?: File | null,
): Promise<Evidence> {
  const timestamp = nowIso();
  const base: Evidence = {
    id: createId("evd"),
    type: intake.type,
    displayName: intake.displayName,
    description: intake.description,
    createdAt: timestamp,
  };

  if (!file) {
    return {
      ...base,
      storageNote:
        "No file was attached. This record is metadata only and is not proof of authenticity or ownership.",
    };
  }

  const fileMeta = {
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || "application/octet-stream",
    bytesPersisted: false,
  };

  if (file.size > MAX_PERSISTED_FILE_BYTES) {
    return {
      ...base,
      file: fileMeta,
      storageNote: `“${file.name}” is ${formatFileSize(file.size)}. This demo stores metadata only for attachments larger than ${formatFileSize(MAX_PERSISTED_FILE_BYTES)}. File presence does not prove authenticity or ownership.`,
    };
  }

  try {
    const dataUrl = await readFileAsDataUrl(file);
    return {
      ...base,
      file: {
        ...fileMeta,
        bytesPersisted: true,
        dataUrl,
      },
      storageNote:
        "The file bytes are stored in this browser for demo preview only. Storage here does not authenticate the document or establish ownership.",
    };
  } catch {
    return {
      ...base,
      file: fileMeta,
      storageNote:
        "The file could not be read. Metadata was saved without file bytes. This is not proof of authenticity or ownership.",
    };
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => {
      reject(new Error("File read failed."));
    };
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("File read failed."));
    };
    reader.readAsDataURL(file);
  });
}
