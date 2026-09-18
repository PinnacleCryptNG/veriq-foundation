import { Badge } from "@/components/ui/badge";

export function DemoBadge({ label = "Demo data" }: { label?: string }) {
  return (
    <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary text-[10px] font-semibold">
      {label}
    </Badge>
  );
}
