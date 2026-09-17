export const reviewSurfaces = [
  {
    id: "conflicts",
    title: "Conflicting claims",
    description:
      "Statements in the opportunity that disagree with each other or with submitted materials.",
  },
  {
    id: "missing",
    title: "Missing evidence",
    description:
      "Claimed facts that do not yet have supporting documents in the workspace.",
  },
  {
    id: "questions",
    title: "Unresolved questions",
    description:
      "Items a reviewer still needs answered before a finding can be recorded.",
  },
  {
    id: "findings",
    title: "Evidence-supported findings",
    description:
      "Observations that can be tied to submitted materials, without treating those materials as proof of ownership or authenticity.",
  },
  {
    id: "limits",
    title: "Verification limitations",
    description:
      "What this review cannot conclude, including legal title, issuer approval, authenticity, and investment safety.",
  },
] as const;
