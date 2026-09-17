import { z } from "zod";

export const opportunityInstrumentSchema = z.enum([
  "common_stock",
  "preferred_stock",
  "safe",
  "employee_tender",
]);

export const currencySchema = z.enum(["USD", "EUR", "GBP"]);

export type OpportunityInstrument = z.infer<typeof opportunityInstrumentSchema>;
export type CurrencyCode = z.infer<typeof currencySchema>;
