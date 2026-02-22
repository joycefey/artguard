import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";
import { EscrowContract } from "@/data/contracts";
import { ArrowRight } from "lucide-react";

export function ContractRow({ contract }: { contract: EscrowContract }) {
  return (
    <Link
      to={`/contract/${contract.id}?role=buyer`}
      className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-secondary/50"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
        <span className="font-mono text-sm font-medium">{contract.id}</span>
        <span className="text-sm text-muted-foreground">{contract.projectName}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden text-xs text-muted-foreground sm:block font-mono">
          {contract.counterparty}
        </span>
        <span className="font-mono text-sm font-semibold">
          {contract.amount.toLocaleString()} <span className="text-xs text-muted-foreground">{contract.currency}</span>
        </span>
        <StatusBadge status={contract.status} />
        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  );
}
