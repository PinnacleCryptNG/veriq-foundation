"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  emptyVerificationResult,
  getServerVerificationRunsSnapshot,
  getVerificationRunsSnapshot,
  runsForOpportunity,
  saveVerificationRun,
  subscribeToVerificationRuns,
} from "@/lib/storage/verification-repository";
import type { VerificationRun } from "@/types/verification";

export function useVerificationRuns(opportunityId: string) {
  const result = useSyncExternalStore(
    subscribeToVerificationRuns,
    getVerificationRunsSnapshot,
    getServerVerificationRunsSnapshot,
  );
  const isLoading = result === emptyVerificationResult;
  const runs = runsForOpportunity(result.runs, opportunityId);

  const saveRun = useCallback((run: VerificationRun) => {
    return saveVerificationRun(run);
  }, []);

  return {
    runs,
    latest: runs[0],
    warning: result.warning,
    persistError: result.persistError,
    isLoading,
    saveRun,
  };
}
