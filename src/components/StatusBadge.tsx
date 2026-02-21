import { Badge } from "@/components/ui/badge";

type ContractStatus = "Waiting" | "In Progress" | "Reviewing" | "Disputed";

const statusStyles: Record<ContractStatus, string> = {
  Waiting: "bg-warning/15 text-warning border-warning/20",
  "In Progress": "bg-primary/15 text-primary border-primary/20",
  Reviewing: "bg-muted text-muted-foreground border-border",
  Disputed: "bg-destructive/15 text-destructive border-destructive/20",
};

export function StatusBadge({ status }: { status: ContractStatus }) {
  return (
    <Badge variant="outline" className={`${statusStyles[status]} font-medium text-xs`}>
      {status}
    </Badge>
  );
}
