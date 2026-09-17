export const reviewSurfaces = [
  {
    id: "R01",
    title: "R01 Security representation",
    description:
      "Compares the claimed instrument with structured security or interest types entered on evidence records. Matching labels are descriptions only.",
  },
  {
    id: "R02",
    title: "R02 Transferability",
    description:
      "Reviews structured transfer terms. A reported restriction is Attention. “No restriction stated” is Not assessed — not confirmation that a transfer is free.",
  },
  {
    id: "R03",
    title: "R03 Valuation reference",
    description:
      "Compares the quoted price with a comparable asking-price valuation in the same currency and a compatible unit. Matching numbers are not an appraisal.",
  },
  {
    id: "R04",
    title: "R04 Transaction arithmetic",
    description:
      "Checks quantity × unit price, plus fees if entered, against stated payment. Integer minor units; amounts match within 1 cent. Matching arithmetic does not mean funds moved.",
  },
  {
    id: "R05",
    title: "R05 Evidence completeness",
    description:
      "Rolls up whether the other checks had the structured fields they need. Completeness of entered fields is not authenticity or a verification verdict.",
  },
] as const;
