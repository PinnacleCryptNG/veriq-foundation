"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  addEvidenceRecord,
  createOpportunity,
  emptyOpportunitiesResult,
  getOpportunitiesSnapshot,
  getServerOpportunitiesSnapshot,
  removeEvidenceRecord,
  subscribeToOpportunities,
} from "@/lib/storage/opportunities-repository";
import type {
  EvidenceIntake,
  Opportunity,
  OpportunityIntake,
} from "@/types/opportunity";

export function useOpportunities() {
  const result = useSyncExternalStore(
    subscribeToOpportunities,
    getOpportunitiesSnapshot,
    getServerOpportunitiesSnapshot,
  );
  const isLoading = result === emptyOpportunitiesResult;

  const create = useCallback((input: OpportunityIntake) => {
    return createOpportunity(input);
  }, []);

  const addEvidence = useCallback(
    async (
      opportunityId: string,
      input: EvidenceIntake,
      file?: File | null,
    ) => {
      return addEvidenceRecord(opportunityId, input, file);
    },
    [],
  );

  const removeEvidence = useCallback(
    (opportunityId: string, evidenceId: string) => {
      return removeEvidenceRecord(opportunityId, evidenceId);
    },
    [],
  );

  const getById = useCallback(
    (id: string): Opportunity | undefined =>
      result.opportunities.find((opportunity) => opportunity.id === id),
    [result.opportunities],
  );

  return {
    opportunities: result.opportunities,
    warning: result.warning,
    persistError: result.persistError,
    isLoading,
    create,
    addEvidence,
    removeEvidence,
    getById,
  };
}
