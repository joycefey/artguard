import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Lock, Calendar, FileText, CheckCircle2, AlertTriangle, Wallet, Upload, ShieldAlert, ImagePlus, X, Film, ArrowLeft, User, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { StatusBadge } from "@/components/StatusBadge";
import { mockContracts, mockDisputes } from "@/data/contracts";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

const steps = ["Locked", "In Progress", "Review", "Resolved"];

function ProgressStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
              i <= currentStep ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}>{i + 1}</div>
            <span className={`text-xs ${i <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`mx-2 h-0.5 w-8 sm:w-16 ${i < currentStep ? "bg-primary" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function CommissionerEvidenceModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [images, setImages] = useState<string[]>([]);
  const [text, setText] = useState("");
  const maxImages = 6;

  const addImage = () => {
    if (images.length < maxImages) {
      setImages([...images, `evidence_${images.length + 1}.png`]);
    }
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const canSubmit = text.trim().length > 0 && images.length >= 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Submit Commissioner Evidence</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm">
              Image Evidence <span className="text-muted-foreground">({images.length}/{maxImages}, min 1)</span>
            </Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative flex h-24 items-center justify-center rounded-lg border border-border bg-secondary text-xs font-mono text-muted-foreground">
                  {img}
                  <button onClick={() => removeImage(i)} className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {images.length < maxImages && (
                <button
                  onClick={addImage}
                  className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <ImagePlus className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Written Statement <span className="text-destructive">*</span></Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe your complaint in detail..."
              rows={4}
              required
            />
          </div>
          <Button className="w-full glow-primary" disabled={!canSubmit}>
            Submit Evidence & Create Dispute
          </Button>
          {!canSubmit && (
            <p className="text-xs text-muted-foreground text-center">At least 1 image and written statement required</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ArtistEvidenceModal({ open, onOpenChange, onSubmitted }: { open: boolean; onOpenChange: (v: boolean) => void; onSubmitted: () => void }) {
  const [images, setImages] = useState<string[]>([]);
  const [hasVideo, setHasVideo] = useState(false);
  const [text, setText] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const maxImages = 6;

  const addImage = () => {
    if (images.length < maxImages) {
      setImages([...images, `defense_img_${images.length + 1}.png`]);
    }
  };
  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const canSubmit = text.trim().length > 0 && images.length >= 1;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Submit Artist Defense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm">
                Image Evidence <span className="text-muted-foreground">({images.length}/{maxImages}, min 1)</span>
              </Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative flex h-24 items-center justify-center rounded-lg border border-border bg-secondary text-xs font-mono text-muted-foreground">
                    {img}
                    <button onClick={() => removeImage(i)} className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {images.length < maxImages && (
                  <button onClick={addImage} className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                    <ImagePlus className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm">Video Explanation <span className="text-muted-foreground">(optional)</span></Label>
              <button
                onClick={() => setHasVideo(!hasVideo)}
                className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                  hasVideo ? "border-success/30 bg-success/10 text-success" : "border-dashed border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                <Film className="h-4 w-4" /> {hasVideo ? "✓ Video attached" : "Attach Video"}
              </button>
            </div>
            <div className="space-y-2">
              <Label>Written Defense <span className="text-destructive">*</span></Label>
              <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Provide your defense and explain your work..." rows={4} required />
            </div>
            <Button className="w-full glow-primary" disabled={!canSubmit} onClick={() => setConfirmOpen(true)}>
              Submit Evidence
            </Button>
            {!canSubmit && (
              <p className="text-xs text-muted-foreground text-center">At least 1 image and written defense required</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-display">
              <ShieldAlert className="h-5 w-5 text-warning" /> Confirm Evidence Submission
            </AlertDialogTitle>
            <AlertDialogDescription>
              After submitting your evidence, this contract will be sent to the Jury Court for arbitration. You will be notified of the verdict once all jurors have voted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { setConfirmOpen(false); onOpenChange(false); onSubmitted(); }}>
              Confirm & Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function ContractDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = (searchParams.get("role") as "buyer" | "artist") || "buyer";
  const navRole = role === "buyer" ? "commissioner" as const : "artist" as const;
  const contract = mockContracts.find((c) => c.id === id) ?? mockContracts[0];
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [artistEvidenceOpen, setArtistEvidenceOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const isDisputed = contract.status === "Disputed";

  const stepIndex =
    contract.status === "Waiting" ? 0
    : contract.status === "In Progress" ? 1
    : contract.status === "Reviewing" ? 2
    : 3;

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Navbar role={navRole} />
      <main className="container max-w-5xl py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="font-display text-2xl font-bold mb-4">
          Contract Detail
        </h1>

        <div className="mb-8 flex justify-center">
          <ProgressStepper currentStep={stepIndex} />
        </div>

        {isDisputed && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            <p className="text-sm font-medium text-destructive">This contract is under arbitration. Funds are frozen pending jury verdict.</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Contract Details */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">{contract.projectName}</h2>
              <StatusBadge status={contract.status} />
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4 cyber-border">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Locked Amount</p>
                <p className="font-mono text-xl font-bold">
                  {contract.amount.toLocaleString()} <span className="text-sm text-muted-foreground">{contract.currency}</span>
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
                <span className="text-xs text-muted-foreground">{role === "buyer" ? "Artist:" : "Commissioner:"}</span>
                <span className="font-mono text-xs">{contract.counterparty}</span>
              </div>
              {contract.referenceImages && contract.referenceImages.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-xs text-muted-foreground">References:</span>
                  <div className="flex gap-1 flex-wrap">
                    {contract.referenceImages.map(img => (
                      <span key={img} className="rounded bg-secondary px-2 py-0.5 text-xs font-mono text-muted-foreground">{img}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Area */}
          <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
            {role === "buyer" ? (
              isDisputed ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <ShieldAlert className="h-10 w-10 text-destructive" />
                  <p className="text-sm text-muted-foreground text-center">Dispute submitted. Awaiting jury verdict.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-2">Commissioner Actions</h3>
                    <p className="text-sm text-muted-foreground">Review deliverables, then release funds or raise a dispute.</p>
                  </div>
                  <div className="space-y-3">
                    <Button
                      className="w-full gap-2 bg-success text-success-foreground hover:bg-success/90 glow-success"
                      size="lg"
                      onClick={() => setReleaseOpen(true)}
                    >
                      <CheckCircle2 className="h-5 w-5" /> Release Funds Early
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full gap-2 glow-destructive"
                      size="lg"
                      onClick={() => setDisputeOpen(true)}
                    >
                      <AlertTriangle className="h-5 w-5" /> Freeze Funds & Dispute
                    </Button>
                  </div>
                </div>
              )
            ) : (
              isDisputed ? (
                (() => {
                  const dispute = mockDisputes.find(d => d.contractId === contract.id);
                  return (
                    <div className="space-y-5">
                      {/* Commissioner's complaint */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-destructive" />
                          <h3 className="font-display font-semibold text-sm">Commissioner's Complaint</h3>
                          <span className="ml-auto font-mono text-xs text-muted-foreground">{dispute?.buyer}</span>
                        </div>
                        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-muted-foreground">
                          {dispute?.buyerComplaint || "No complaint details available."}
                        </div>
                        {dispute && dispute.buyerImages.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><ImageIcon className="h-3 w-3" /> Evidence Images:</p>
                            <div className="flex gap-2 flex-wrap">
                              {dispute.buyerImages.map(f => (
                                <span key={f} className="rounded bg-destructive/10 border border-destructive/20 px-2 py-1 text-xs font-mono text-destructive">{f}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Artist evidence submission */}
                      <div className="border-t border-border pt-4">
                        <h3 className="font-display font-semibold text-sm mb-3">Submit Your Defense</h3>
                        <Button className="w-full gap-2 glow-primary" onClick={() => setArtistEvidenceOpen(true)}>
                          <FileText className="h-4 w-4" /> Upload Evidence & Submit Defense
                        </Button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-2">Artist Actions</h3>
                    <p className="text-sm text-muted-foreground">Upload your deliverables for review.</p>
                  </div>
                  <Button className="w-full gap-2" variant="secondary" size="lg">
                    <Upload className="h-5 w-5" /> Upload Deliverables
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      </main>

      {/* Release Confirmation */}
      <AlertDialog open={releaseOpen} onOpenChange={setReleaseOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-display">
              <CheckCircle2 className="h-5 w-5 text-success" /> Confirm Fund Release
            </AlertDialogTitle>
            <AlertDialogDescription>
              <strong>Warning: This action is irreversible.</strong> Funds will be sent to the Artist immediately. Please confirm you have reviewed all deliverables.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-success text-success-foreground hover:bg-success/90">Confirm Release</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dispute Confirmation */}
      <AlertDialog open={disputeOpen} onOpenChange={setDisputeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-display">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Raise Dispute
            </AlertDialogTitle>
            <AlertDialogDescription>
              <strong>Warning: Funds will be frozen</strong> and the case will be sent to a jury for resolution. You will need to submit evidence to support your claim.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { setDisputeOpen(false); setEvidenceOpen(true); }}
            >
              Continue to Submit Evidence
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Commissioner Evidence */}
      <CommissionerEvidenceModal open={evidenceOpen} onOpenChange={setEvidenceOpen} />
      
      {/* Artist Evidence */}
      <ArtistEvidenceModal open={artistEvidenceOpen} onOpenChange={setArtistEvidenceOpen} onSubmitted={() => navigate(-1)} />
    </div>
  );
}
