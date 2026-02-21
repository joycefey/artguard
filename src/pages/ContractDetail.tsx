import { useParams } from "react-router-dom";
import { useState } from "react";
import { Lock, Calendar, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { StatusBadge } from "@/components/StatusBadge";
import { mockContracts } from "@/data/contracts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const steps = ["Locked", "In Progress", "Review", "Resolved"];

function ProgressStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                i <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-xs ${i <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`mx-2 h-0.5 w-8 sm:w-16 ${
                i < currentStep ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ContractDetail() {
  const { id } = useParams();
  const contract = mockContracts.find((c) => c.id === id) ?? mockContracts[0];
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);

  const stepIndex =
    contract.status === "Waiting" ? 0
    : contract.status === "In Progress" ? 1
    : contract.status === "Reviewing" ? 2
    : 3;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-4xl py-8">
        <div className="mb-8 flex justify-center">
          <ProgressStepper currentStep={stepIndex} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Contract Details */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{contract.projectName}</h2>
              <StatusBadge status={contract.status} />
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Locked Amount</p>
                <p className="font-mono text-xl font-bold">
                  {contract.amount.toLocaleString()} <span className="text-sm text-muted-foreground">USDC</span>
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground">{contract.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Deadline: {contract.deadline}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Counterparty:</span>
                <span className="font-mono text-xs">{contract.counterparty}</span>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Actions</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Review the deliverables and take action on this contract.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full gap-2 bg-success text-success-foreground hover:bg-success/90 glow-success"
                size="lg"
                onClick={() => setReleaseOpen(true)}
              >
                <CheckCircle2 className="h-5 w-5" />
                Release Funds
              </Button>
              <Button
                variant="destructive"
                className="w-full gap-2 glow-destructive"
                size="lg"
                onClick={() => setDisputeOpen(true)}
              >
                <AlertTriangle className="h-5 w-5" />
                Raise Dispute
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Release Confirmation */}
      <AlertDialog open={releaseOpen} onOpenChange={setReleaseOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Confirm Release
            </AlertDialogTitle>
            <AlertDialogDescription>
              <strong>Warning: This action is irreversible.</strong> Funds will be sent to the seller immediately. Make sure you have reviewed all deliverables before confirming.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-success text-success-foreground hover:bg-success/90">
              Confirm Release
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dispute Confirmation */}
      <AlertDialog open={disputeOpen} onOpenChange={setDisputeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Raise Dispute
            </AlertDialogTitle>
            <AlertDialogDescription>
              <strong>Warning: Funds will be frozen</strong> and the case will be sent to the Jury for resolution. This process may take several days. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Confirm Dispute
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
