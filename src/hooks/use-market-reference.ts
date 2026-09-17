"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  clearMarketReference,
  emptyMarketReferenceResult,
  getMarketReferencesSnapshot,
  getServerMarketReferencesSnapshot,
  referenceForOpportunity,
  setMarketReference,
  subscribeToMarketReferences,
} from "@/lib/storage/market-reference-repository";

export function useMarketReference(opportunityId: string) {
  const result = useSyncExternalStore(
    subscribeToMarketReferences,
    getMarketReferencesSnapshot,
    getServerMarketReferencesSnapshot,
  );
  const isLoading = result === emptyMarketReferenceResult;
  const reference = referenceForOpportunity(result.references, opportunityId);

  const select = useCallback(
    (symbol: string) => setMarketReference(opportunityId, symbol),
    [opportunityId],
  );
  const clear = useCallback(
    () => clearMarketReference(opportunityId),
    [opportunityId],
  );

  return {
    reference,
    warning: result.warning,
    persistError: result.persistError,
    isLoading,
    select,
    clear,
  };
}
