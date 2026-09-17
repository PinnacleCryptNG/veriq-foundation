import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/opportunities/status-badge";
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
          <TableHead className="text-right">Materials on file</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {opportunities.map((opportunity) => (
          <TableRow key={opportunity.id} className="hover:bg-muted/30">
            <TableCell>
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-foreground">
                  {opportunity.companyName}
                </span>
                <span className="max-w-xs text-xs leading-4 whitespace-normal text-muted-foreground">
                  {opportunity.claimedSummary}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {instrumentLabels[opportunity.instrument]}
            </TableCell>
            <TableCell>
              <StatusBadge status={opportunity.status} />
            </TableCell>
            <TableCell className="text-right tabular-nums text-muted-foreground">
              {opportunity.materialsOnFile}
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
        <li
          key={opportunity.id}
          className="rounded-lg border border-border bg-card p-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-foreground">
                {opportunity.companyName}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {instrumentLabels[opportunity.instrument]}
              </p>
            </div>
            <StatusBadge status={opportunity.status} />
          </div>
          <p className="mt-2 text-sm leading-5 text-muted-foreground">
            {opportunity.claimedSummary}
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>
              <dt className="text-[11px] tracking-wide uppercase">
                Materials on file
              </dt>
              <dd className="mt-0.5 tabular-nums text-foreground">
                {opportunity.materialsOnFile}
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
        </li>
      ))}
    </ul>
  );
}
