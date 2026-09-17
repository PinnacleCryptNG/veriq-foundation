import type { EngineInput } from "@/types/verification";

export function serializeEngineInput(input?: EngineInput): string {
  return JSON.stringify(input ?? null);
}

export function engineInputsMatch(
  left?: EngineInput,
  right?: EngineInput,
): boolean {
  return serializeEngineInput(left) === serializeEngineInput(right);
}
