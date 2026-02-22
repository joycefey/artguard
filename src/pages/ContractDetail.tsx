import { useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Lock, Calendar, FileText, CheckCircle2, AlertTriangle, Wallet, Upload, ShieldAlert, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { StatusBadge } from "@/components/StatusBadge";
import { mockContracts } from "@/data/contracts";
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

function EvidenceSubmitModal({ open, onOpenChange, role }: { open: boolean; onOpenChange: (v: boolean) => void; role: "buyer" | "artist" }) {
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
          <DialogTitle className="font-display text-xl">
            {role === "buyer" ? "提交买家证据" : "提交卖家证据"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm">
              图片证据 <span className="text-muted-foreground">({images.length}/{maxImages}，至少1张)</span>
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
            <Label>文字补充说明 <span className="text-destructive">*</span></Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={role === "buyer" ? "详细描述你的投诉原因..." : "提供你的工作说明和证据..."}
              rows={4}
              required
            />
          </div>
          <Button className="w-full glow-primary" disabled={!canSubmit}>
            提交证据并创建仲裁
          </Button>
          {!canSubmit && (
            <p className="text-xs text-muted-foreground text-center">需要至少1张图片和文字说明</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ContractDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const role = (searchParams.get("role") as "buyer" | "artist") || "buyer";
  const contract = mockContracts.find((c) => c.id === id) ?? mockContracts[0];
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const isDisputed = contract.status === "Disputed";

  const stepIndex =
    contract.status === "Waiting" ? 0
    : contract.status === "In Progress" ? 1
    : contract.status === "Reviewing" ? 2
    : 3;

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Navbar />
      <main className="container max-w-5xl py-8">
        {/* Role switcher for demo */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">
            {role === "buyer" ? "合同详情 (买家视角)" : "合同详情 (画家视角)"}
          </h1>
          <div className="flex gap-1 rounded-lg bg-secondary p-1">
            <a
              href={`/contract/${contract.id}?role=buyer`}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${role === "buyer" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              买家视角
            </a>
            <a
              href={`/contract/${contract.id}?role=artist`}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${role === "artist" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              画家视角
            </a>
          </div>
        </div>

        <div className="mb-8 flex justify-center">
          <ProgressStepper currentStep={stepIndex} />
        </div>

        {isDisputed && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            <p className="text-sm font-medium text-destructive">此合同正在仲裁中，资金已冻结等待陪审团裁决。</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Contract Details - shared */}
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
                <span className="text-xs text-muted-foreground">{role === "buyer" ? "画家:" : "客户:"}</span>
                <span className="font-mono text-xs">{contract.counterparty}</span>
              </div>
            </div>
          </div>

          {/* Action Area - role-specific */}
          <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
            {role === "buyer" ? (
              /* BUYER VIEW */
              isDisputed ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <ShieldAlert className="h-10 w-10 text-destructive" />
                  <p className="text-sm text-muted-foreground text-center">争议已提交，等待陪审团裁决。</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-2">买家操作</h3>
                    <p className="text-sm text-muted-foreground">审核作品后可以释放资金或提出争议。</p>
                  </div>
                  <div className="space-y-3">
                    <Button
                      className="w-full gap-2 bg-success text-success-foreground hover:bg-success/90 glow-success"
                      size="lg"
                      onClick={() => setReleaseOpen(true)}
                    >
                      <CheckCircle2 className="h-5 w-5" /> 释放资金
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full gap-2 glow-destructive"
                      size="lg"
                      onClick={() => setDisputeOpen(true)}
                    >
                      <AlertTriangle className="h-5 w-5" /> 提出争议
                    </Button>
                  </div>
                </div>
              )
            ) : (
              /* ARTIST VIEW */
              !walletConnected ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <Wallet className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">连接钱包以接受此委托并开始工作。</p>
                  <Button className="gap-2 glow-primary" onClick={() => setWalletConnected(true)}>
                    <Wallet className="h-4 w-4" /> 连接钱包接受委托
                  </Button>
                </div>
              ) : isDisputed ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <ShieldAlert className="h-10 w-10 text-destructive" />
                  <p className="text-sm text-muted-foreground text-center">合同正在仲裁中。你可以提交证据。</p>
                  <Button className="gap-2" onClick={() => setEvidenceOpen(true)}>
                    <FileText className="h-4 w-4" /> 提交卖家证据
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-2">画家操作</h3>
                    <p className="text-sm text-muted-foreground">上传你的作品交付文件。</p>
                  </div>
                  <Button className="w-full gap-2" variant="secondary" size="lg">
                    <Upload className="h-5 w-5" /> 上传作品
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
              <CheckCircle2 className="h-5 w-5 text-success" /> 确认释放资金
            </AlertDialogTitle>
            <AlertDialogDescription>
              <strong>警告：此操作不可逆。</strong>资金将立即发送给卖家。请确认你已审核所有交付物。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction className="bg-success text-success-foreground hover:bg-success/90">确认释放</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dispute Confirmation - opens evidence modal */}
      <AlertDialog open={disputeOpen} onOpenChange={setDisputeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-display">
              <AlertTriangle className="h-5 w-5 text-destructive" /> 提出争议
            </AlertDialogTitle>
            <AlertDialogDescription>
              <strong>警告：资金将被冻结</strong>，案件将送交陪审团裁决。你需要提交证据支持你的主张。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { setDisputeOpen(false); setEvidenceOpen(true); }}
            >
              继续提交证据
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Evidence Submission */}
      <EvidenceSubmitModal open={evidenceOpen} onOpenChange={setEvidenceOpen} role={role} />
    </div>
  );
}
