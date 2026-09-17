import { ShieldAlert } from "lucide-react";
import { PRESTOCKS_PRODUCTS_URL } from "@/config/prestocks";
import { prestocksLimitation } from "@/config/prestocks";
import { cn } from "@/lib/utils";

export function PreStocksNotice({ className }: { className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "flex gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground",
        className,
      )}
    >
      <ShieldAlert
        className="mt-0.5 size-4 shrink-0 text-primary"
        aria-hidden="true"
      />
      <p>
        <span className="font-medium text-foreground">
          Market reference — not submitted evidence.{" "}
        </span>
        {prestocksLimitation}{" "}
        <a
          href={PRESTOCKS_PRODUCTS_URL}
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Official product list
        </a>
        .
      </p>
    </div>
  );
}
