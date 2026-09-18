export const reviewSurfaces = [
  {
    id: "R01",
    buyerQuestion: "Does the security match?",
    title: "Does the security match?",
    plainDescription:
      "Checks whether the offered shares (like common stock) match what the underlying paperwork actually describes (like an SPV interest).",
    description:
      "Compares the claimed instrument with structured security or interest types entered on evidence records. Matching labels are descriptions only.",
  },
  {
    id: "R02",
    buyerQuestion: "Can you actually transfer it?",
    title: "Can you actually transfer it?",
    plainDescription:
      "Checks whether the transfer requires company consent, board sign-off, or Right of First Refusal waivers before money changes hands.",
    description:
      "Reviews structured transfer terms. A reported restriction is Attention. “No restriction stated” is Not assessed — not confirmation that a transfer is free.",
  },
  {
    id: "R03",
    buyerQuestion: "Is the price consistent?",
    title: "Is the price consistent?",
    plainDescription:
      "Compares the quoted asking price against entered valuation term sheets, 409A references, or round benchmarks.",
    description:
      "Compares the quoted price with a comparable asking-price valuation in the same currency and a compatible unit. Matching numbers are not an appraisal.",
  },
  {
    id: "R04",
    buyerQuestion: "Do the numbers add up?",
    title: "Do the numbers add up?",
    plainDescription:
      "Multiplies quantity by price and adds stated fees to make sure the expected wire total matches exact deal math.",
    description:
      "Checks quantity × unit price, plus fees if entered, against stated payment. Integer minor units; amounts match within 1 cent. Matching arithmetic does not mean funds moved.",
  },
  {
    id: "R05",
    buyerQuestion: "Is enough evidence present?",
    title: "Is enough evidence present?",
    plainDescription:
      "Confirms whether all necessary structured details have been provided to evaluate the deal without guessing.",
    description:
      "Rolls up whether the other checks had the structured fields they need. Completeness of entered fields is not authenticity or a verification verdict.",
  },
] as const;
