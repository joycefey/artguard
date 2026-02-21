import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContractRow } from "@/components/ContractRow";
import { CreateEscrowModal } from "@/components/CreateEscrowModal";
import { Navbar } from "@/components/Navbar";
import { mockContracts } from "@/data/contracts";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My Contracts</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mockContracts.length} active escrow contracts
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Escrow
          </Button>
        </div>

        <div className="space-y-2">
          {mockContracts.map((c) => (
            <ContractRow key={c.id} contract={c} />
          ))}
        </div>
      </main>
      <CreateEscrowModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default Index;
