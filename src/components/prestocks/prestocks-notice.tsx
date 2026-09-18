import { ShieldAlert } from "lucide-react";
import { PRESTOCKS_PRODUCTS_URL } from "@/config/prestocks";
import { cn } from "@/lib/utils";

export function PreStocksNotice({ className }: { className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground space-y-2",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <ShieldAlert className="size-4 shrink-0 text-primary" aria-hidden="true" />
        <span className="font-semibold text-foreground text-sm">
          Optional market price check — not part of the legal verification.
        </span>
      </div>

      <ul className="list-disc pl-5 space-y-1 text-muted-foreground leading-relaxed">
        <li>
          <span className="text-foreground font-medium">Secondary benchmark context only:</span> PreStocks prices track tokenized secondary markets for comparison, not official issuer valuations.
        </li>
        <li>
          <span className="text-foreground font-medium">SPV exposure, not direct cap table equity:</span> Tokens are backed by SPVs tracking private companies. Holding or referencing a token does not confer direct issuer share ownership, voting rights, or company registry entry.
        </li>
        <li>
          <span className="text-foreground font-medium">Independent of verification findings:</span> PreStocks pricing does not alter VERIQ’s deterministic ruleset or make an unverified deal consistent, approved, or safe.
        </li>
      </ul>

      <div className="pt-1">
        <a
          href={PRESTOCKS_PRODUCTS_URL}
          className="text-xs font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
          target="_blank"
          rel="noopener noreferrer"
        >
          Official product list
        </a>
      </div>
    </div>
  );
}
