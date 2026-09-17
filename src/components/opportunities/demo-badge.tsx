import { Badge } from "@/components/ui/badge";

export function DemoBadge({ label = "Demo" }: { label?: string }) {
  return (
    <Badge variant="outline" className="border-border bg-secondary text-secondary-foreground">
      {label}
    </Badge>
  );
}
