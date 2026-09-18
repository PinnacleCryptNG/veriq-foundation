import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DemoBadge } from "@/components/opportunities/demo-badge";
import { StatusBadge } from "@/components/opportunities/status-badge";
import { isDemoScenario } from "@/data/demo-opportunities";
import { formatDate, instrumentLabels } from "@/lib/format";
import type { Opportunity } from "@/types/opportunity";

export function OpportunityTable({
  opportunities,
}: {
  opportunities: Opportunity[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Company</TableHead>
          <TableHead>Instrument</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Evidence records</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {opportunities.map((opportunity) => (
          <TableRow key={opportunity.id} className="relative hover:bg-muted/30">
            <TableCell>
              <div className="flex flex-col gap-1">
                <span className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/opportunities/${opportunity.id}`}
                    className="font-medium text-foreground after:absolute after:inset-0 hover:underline"
                  >
                    {opportunity.companyName}
                  </Link>
                  {opportunity.isDemo ? (
                    <DemoBadge
                      label={
                        isDemoScenario(opportunity.id)
                          ? "Example deal · Guided demo"
                          : "Example deal"
                      }
                    />
                  ) : null}
                </span>
                {opportunity.claimedSummary ? (
                  <details className="relative z-10 group text-xs text-muted-foreground mt-0.5">
                    <summary className="cursor-pointer text-[11px] hover:text-foreground font-medium text-muted-foreground/90 list-none flex items-center gap-1">
                      <span className="group-open:hidden">View deal summary & details ↓</span>
                      <span className="hidden group-open:inline">Hide deal summary ↑</span>
                    </summary>
                    <p className="mt-1 p-2 rounded bg-muted/40 text-xs leading-relaxed max-w-sm">
                      {opportunity.claimedSummary}
                    </p>
                  </details>
                ) : null}
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {instrumentLabels[opportunity.instrument]}
            </TableCell>
            <TableCell>
              <StatusBadge status={opportunity.status} />
            </TableCell>
            <TableCell className="text-right tabular-nums text-muted-foreground">
              {opportunity.evidence.length}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {opportunity.source}
            </TableCell>
            <TableCell className="tabular-nums text-muted-foreground">
              {formatDate(opportunity.updatedAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function OpportunityCards({
  opportunities,
}: {
  opportunities: Opportunity[];
}) {
  return (
    <ul className="space-y-3">
      {opportunities.map((opportunity) => (
        <li key={opportunity.id}>
          <div className="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/30">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex flex-wrap items-center gap-2 font-medium text-foreground">
                  <Link
                    href={`/opportunities/${opportunity.id}`}
                    className="hover:underline font-semibold"
                  >
                    {opportunity.companyName}
                  </Link>
                  {opportunity.isDemo ? (
                    <DemoBadge
                      label={
                        isDemoScenario(opportunity.id)
                          ? "Example deal · Guided demo"
                          : "Example deal"
                      }
                    />
                  ) : null}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {instrumentLabels[opportunity.instrument]}
                </p>
              </div>
              <StatusBadge status={opportunity.status} />
            </div>

            {opportunity.claimedSummary ? (
              <details className="mt-2 text-xs text-muted-foreground">
                <summary className="cursor-pointer text-[11px] hover:text-foreground font-medium text-muted-foreground/90">
                  View deal summary ↓
                </summary>
                <p className="mt-1 text-xs leading-relaxed p-2 rounded bg-muted/30">
                  {opportunity.claimedSummary}
                </p>
              </details>
            ) : null}

            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
              <div>
                <dt className="text-[11px] tracking-wide uppercase">
                  Evidence records
                </dt>
                <dd className="mt-0.5 tabular-nums text-foreground font-medium">
                  {opportunity.evidence.length}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-wide uppercase">Updated</dt>
                <dd className="mt-0.5 tabular-nums text-foreground">
                  {formatDate(opportunity.updatedAt)}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[11px] tracking-wide uppercase">Source</dt>
                <dd className="mt-0.5 text-foreground">{opportunity.source}</dd>
              </div>
            </dl>
          </div>
        </li>
      ))}
    </ul>
  );
}
