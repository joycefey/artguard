import { useState } from "react";
import { Plus, ShoppingBag, FileText, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContractRow } from "@/components/ContractRow";
import { CreateEscrowModal } from "@/components/CreateEscrowModal";
import { Navbar } from "@/components/Navbar";
import { mockContracts } from "@/data/contracts";

export default function CommissionerDashboard() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Navbar role="commissioner" />
      <main className="container max-w-4xl py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">Commissioner Dashboard</h1>
              <p className="text-sm text-muted-foreground">{mockContracts.length} contracts on Avalanche</p>
            </div>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gap-2 glow-primary">
            <Plus className="h-4 w-4" /> Create New Escrow
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground"><FileText className="h-4 w-4" /><span className="text-xs">Active Contracts</span></div>
            <p className="font-mono text-2xl font-bold">{mockContracts.filter(c => c.status !== "Disputed").length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground"><TrendingUp className="h-4 w-4" /><span className="text-xs">Total Locked</span></div>
            <p className="font-mono text-2xl font-bold">$1,555</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /><span className="text-xs">In Dispute</span></div>
            <p className="font-mono text-2xl font-bold text-destructive">{mockContracts.filter(c => c.status === "Disputed").length}</p>
          </div>
        </div>

        {/* Contracts List */}
        <div className="space-y-2">
          <h3 className="font-display font-semibold text-sm text-muted-foreground mb-3">My Contracts</h3>
          {mockContracts.map((c) => (
            <ContractRow key={c.id} contract={c} />
          ))}
        </div>
      </main>
      <CreateEscrowModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
