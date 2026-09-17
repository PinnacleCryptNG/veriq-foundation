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
  updateEvidenceStructuredDetails,
} from "@/lib/storage/opportunities-repository";
import type {
  EvidenceIntake,
  Opportunity,
  OpportunityIntake,
} from "@/types/opportunity";
import type { StructuredEvidenceDetails } from "@/types/verification";

export function useOpportunities() {
  const result = useSyncExternalStore(
    subscribeToOpportunities,
    getOpportunitiesSnapshot,
    getServerOpportunitiesSnapshot,
  );
  // Empty sentinel means "not yet a real snapshot". The server snapshot is the
  // seeded demo list, so SSR HTML is the queue rather than a stuck loading label.
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

  const updateEvidenceDetails = useCallback(
    (
      opportunityId: string,
      evidenceId: string,
      details: StructuredEvidenceDetails,
    ) => {
      return updateEvidenceStructuredDetails(
        opportunityId,
        evidenceId,
        details,
      );
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
    updateEvidenceDetails,
    getById,
  };
}
