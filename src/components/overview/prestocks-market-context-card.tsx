import { Coins, ArrowRight, ExternalLink } from "lucide-react";
import { LinkButton } from "@/components/link-button";
import { PRESTOCKS_PRODUCTS_URL } from "@/config/prestocks";

export function PreStocksMarketContextCard() {
  return (
    <section
      aria-labelledby="market-context-heading"
      className="rounded-xl border border-border/70 bg-gradient-to-r from-card/60 via-card/40 to-background/50 p-4 sm:p-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-secondary p-2 text-muted-foreground mt-0.5">
            <Coins className="size-5 text-primary" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2
                id="market-context-heading"
                className="text-sm font-semibold text-foreground"
              >
                PreStocks catalog
              </h2>
              <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                Market reference — not submitted evidence
              </span>
            </div>
            <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
              Compare private asking prices against tokenized pre-IPO benchmarks from
              the official PreStocks catalog. Token exposure tracks underlying SPVs and
              serves as secondary market context — it does not alter verification rules.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:self-center shrink-0">
          <LinkButton href="/prestocks" variant="outline" size="sm">
            Browse catalog
            <ArrowRight className="size-3.5" />
          </LinkButton>
          <a
            href={PRESTOCKS_PRODUCTS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
          >
            <span>Official product list</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </section>
  );
}
