import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Lock, Calendar, FileText, CheckCircle2, AlertTriangle, Wallet, Upload, ShieldAlert, ImagePlus, X, Film, ArrowLeft, User, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
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

import { ethers } from "ethers";
import { ESCROW_ADDRESS, ESCROW_ABI } from "@/lib/contracts";

declare global { interface Window { ethereum: any; } }

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

function CommissionerEvidenceModal({ open, onOpenChange, onSubmitDispute, isProcessing }: { open: boolean; onOpenChange: (v: boolean) => void; onSubmitDispute: (text: string) => void; isProcessing: boolean }) {
  const [images, setImages] = useState<string[]>([]);
  const [text, setText] = useState("");
  const maxImages = 6;

  const addImage = () => { if (images.length < maxImages) setImages([...images, `evidence_${images.length + 1}.png`]); };
  const removeImage = (idx: number) => setImages(images.filter((_, i) => i !== idx));

  const canSubmit = text.trim().length > 0 && images.length >= 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Submit Commissioner Claim</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-md bg-warning/10 p-3 text-xs text-warning border border-warning/20">
            Once submitted, the artist will have a window to respond. If they dispute, it goes to the Jury Court.
          </div>
          <div>
            <Label className="text-sm">Image Evidence <span className="text-muted-foreground">({images.length}/{maxImages}, min 1)</span></Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative flex h-24 items-center justify-center rounded-lg border border-border bg-secondary text-xs font-mono text-muted-foreground">
                  {img}
                  <button onClick={() => removeImage(i)} className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"><X className="h-3 w-3" /></button>
                </div>
              ))}
              {images.length < maxImages && (
                <button onClick={addImage} className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                  <ImagePlus className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Written Statement <span className="text-destructive">*</span></Label>
            <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Describe your complaint in detail..." rows={4} required />
          </div>
          <Button className="w-full glow-primary" disabled={!canSubmit || isProcessing} onClick={() => onSubmitDispute(text)}>
            {isProcessing ? "Processing Blockchain Tx..." : "Submit Claim to Contract"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ArtistEvidenceModal({ open, onOpenChange, onSubmitted }: { open: boolean; onOpenChange: (v: boolean) => void; onSubmitted: (text: string) => void }) {
  const [images, setImages] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const maxImages = 6;

  const addImage = () => { if (images.length < maxImages) setImages([...images, `defense_img_${images.length + 1}.png`]); };
  const removeImage = (idx: number) => setImages(images.filter((_, i) => i !== idx));

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
              <Label className="text-sm">Image Evidence <span className="text-muted-foreground">({images.length}/{maxImages}, min 1)</span></Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative flex h-24 items-center justify-center rounded-lg border border-border bg-secondary text-xs font-mono text-muted-foreground">
                    {img}
                    <button onClick={() => removeImage(i)} className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"><X className="h-3 w-3" /></button>
                  </div>
                ))}
                {images.length < maxImages && (
                  <button onClick={addImage} className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"><ImagePlus className="h-6 w-6" /></button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Written Defense <span className="text-destructive">*</span></Label>
              <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Provide your defense..." rows={4} required />
            </div>
            <Button className="w-full glow-primary" disabled={!canSubmit} onClick={() => setConfirmOpen(true)}>
              Send Case to Jury Court
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-display"><ShieldAlert className="h-5 w-5 text-warning" /> Confirm Defense Submission</AlertDialogTitle>
            <AlertDialogDescription>
              This will officially escalate the case to the Decentralized Jury Court. Are you ready?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { setConfirmOpen(false); onOpenChange(false); onSubmitted(text); }}>
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
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [txMessage, setTxMessage] = useState("");
  const [realStatus, setRealStatus] = useState<number>(0); 
  const [chainData, setChainData] = useState<{amount: number, counterparty: string} | null>(null);

  // 🔥 模拟 IPFS：从本地存储读取买家的投诉文字和画师的抗辩文字
  const savedBuyerComplaint = localStorage.getItem(`dispute_buyer_${id}`);
  const savedArtistDefense = localStorage.getItem(`dispute_artist_${id}`);

  useEffect(() => {
    const fetchRealStatus = async () => {
      if (!window.ethereum) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const escrow = new ethers.Contract(ESCROW_ADDRESS, ESCROW_ABI, provider);
        const orderId = id?.replace(/[^0-9]/g, '') || "1"; 
        
        const order = await escrow.orders(orderId);
        setRealStatus(Number(order[3]));
        setChainData({
          amount: Number(ethers.formatEther(order[2])),
          counterparty: role === "buyer" ? order[1] : order[0]
        });
      } catch (e) {
        console.log("读取链上状态失败", e);
      }
    };
    fetchRealStatus();
  }, [id, role]);

  const isDisputed = realStatus === 2 || contract.status === "Disputed";
  const isCompleted = realStatus === 1 || realStatus === 3 || (contract.status as string) === "Resolved";

  const stepIndex = isCompleted ? 3 : isDisputed ? 2 : contract.status === "Waiting" ? 0 : 1;

  const handleReleaseFunds = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    try {
      setIsProcessing(true);
      setTxMessage("Please sign the transaction in your wallet...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const escrow = new ethers.Contract(ESCROW_ADDRESS, ESCROW_ABI, signer);
      
      const orderId = id?.replace(/[^0-9]/g, '') || "1";
      const tx = await escrow.releaseFunds(orderId);
      
      setTxMessage("Transaction pending on Avalanche...");
      await tx.wait(); 
      
      setRealStatus(1); 
      setReleaseOpen(false); 
      setTxMessage("");
    } catch (e: any) {
      console.error(e);
      alert("Transaction failed: " + (e.reason || e.message));
      setIsProcessing(false);
      setTxMessage("");
    }
  };

  // 🔥 买家发起仲裁，并将投诉内容存入本地（模拟 IPFS）
  const handleRaiseDispute = async (complaintText: string) => {
    if (!window.ethereum) return;
    try {
      setIsProcessing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const escrow = new ethers.Contract(ESCROW_ADDRESS, ESCROW_ABI, signer);
      
      const orderId = id?.replace(/[^0-9]/g, '') || "1";
      const tx = await escrow.raiseDispute(orderId);
      await tx.wait(); 
      
      // 模拟将证据上传至 IPFS
      localStorage.setItem(`dispute_buyer_${id}`, complaintText);
      
      setRealStatus(2); 
      setEvidenceOpen(false); 
      alert("Dispute raised successfully! The artist has been notified.");
    } catch (e: any) {
      alert("Transaction failed: " + (e.reason || e.message));
    } finally {
      setIsProcessing(false);
    }
  };

  // 🔥 画师提交抗辩证据（这里不调用合约，只更新本地模拟的IPFS，代表案件正式进入法庭准备期）
  const handleArtistSubmitDefense = (defenseText: string) => {
    localStorage.setItem(`dispute_artist_${id}`, defenseText);
    setArtistEvidenceOpen(false);
    alert("Defense submitted to IPFS successfully! Case is now forwarded to the Jury Court.");
    // 强制刷新一下让页面显示更新后的状态
    window.location.reload(); 
  };

  // 🔥 画师同意退款 (模拟相互取消功能)
  const handleArtistAgreeRefund = () => {
    if(window.confirm("Are you sure you want to refund the commissioner? The smart contract will return the locked AUSD to them.")) {
        alert("Simulating Mutual Cancellation... Funds returned to Commissioner.");
        // 在真实合约中这里会调用 escrow.refundBuyer()
        navigate('/artist');
    }
  }

  const displayAmount = chainData ? chainData.amount : contract.amount;
  const displayCounterparty = chainData ? chainData.counterparty : contract.counterparty;

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Navbar role={navRole} />
      <main className="container max-w-5xl py-8">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="font-display text-2xl font-bold mb-4">Contract Detail</h1>

        <div className="mb-8 flex justify-center">
          <ProgressStepper currentStep={stepIndex} />
        </div>

        {txMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-warning/30 bg-warning/10 p-4 animate-pulse">
            <ShieldAlert className="h-5 w-5 text-warning" />
            <p className="text-sm font-medium text-warning">{txMessage}</p>
          </div>
        )}

        {isDisputed && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            <p className="text-sm font-medium text-destructive">
              {role === "buyer" 
                ? "Dispute active. Funds frozen pending artist response or jury verdict." 
                : "The commissioner has raised a dispute! Your funds are frozen. Please respond immediately."}
            </p>
          </div>
        )}
        
        {isCompleted && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <p className="text-sm font-medium text-success">This contract has been successfully completed and funds are settled.</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* 左侧详情 */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">On-Chain Escrow #{id?.replace(/[^0-9]/g, '')}</h2>
              <div className="px-3 py-1 rounded-full text-xs font-bold border border-current" style={{
                  color: isCompleted ? '#4caf50' : isDisputed ? '#ff4444' : '#ff9800'
              }}>
                 {isCompleted ? "Resolved" : isDisputed ? "Disputed" : "In Progress"}
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4 cyber-border">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Locked Amount</p>
                <p className="font-mono text-xl font-bold">
                  {displayAmount} <span className="text-sm text-muted-foreground">AUSD</span>
                </p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground">Artwork commission secured by ArtGuard Smart Contract on Avalanche.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{role === "buyer" ? "Artist:" : "Commissioner:"}</span>
                <span className="font-mono text-xs break-all">{displayCounterparty}</span>
              </div>
            </div>
          </div>

          {/* 右侧操作区 */}
          <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
            {role === "buyer" ? (
              // 🔴 委托方视角
              isDisputed || isCompleted ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  {isDisputed ? <ShieldAlert className="h-10 w-10 text-destructive" /> : <CheckCircle2 className="h-10 w-10 text-success" />}
                  <p className="text-sm text-muted-foreground text-center">
                    {isDisputed ? "Dispute submitted. Awaiting Artist's response or Jury verdict." : "Transaction completed."}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-2">Commissioner Actions</h3>
                    <p className="text-sm text-muted-foreground">Once you receive the artwork off-chain, release funds here. Or raise a dispute if issues arise.</p>
                  </div>
                  <div className="space-y-3">
                    <Button className="w-full gap-2 bg-success text-success-foreground hover:bg-success/90 glow-success" size="lg" onClick={() => setReleaseOpen(true)} disabled={isProcessing}>
                      <CheckCircle2 className="h-5 w-5" /> Release Funds to Artist
                    </Button>
                    <Button variant="destructive" className="w-full gap-2 glow-destructive" size="lg" onClick={() => setDisputeOpen(true)} disabled={isProcessing}>
                      <AlertTriangle className="h-5 w-5" /> Freeze Funds & Dispute
                    </Button>
                  </div>
                </div>
              )
            ) : (
              // 🔵 画师视角
              isCompleted ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <CheckCircle2 className="h-10 w-10 text-success" />
                  <p className="text-sm text-muted-foreground text-center">Funds have been released to your wallet!</p>
                </div>
              ) : isDisputed ? (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-destructive" />
                      <h3 className="font-display font-semibold text-sm">Commissioner's Claim</h3>
                    </div>
                    {/* 🔥 展示买家的真实投诉内容 */}
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-muted-foreground">
                      {savedBuyerComplaint || "The commissioner has frozen the funds, but claim details are still syncing from IPFS."}
                    </div>
                  </div>
                  
                  {/* 如果画师已经提交过抗辩，显示状态；否则显示操作按钮 */}
                  {savedArtistDefense ? (
                    <div className="border-t border-border pt-4 text-center">
                       <CheckCircle2 className="h-6 w-6 text-primary mx-auto mb-2" />
                       <p className="text-sm font-medium">Defense Submitted</p>
                       <p className="text-xs text-muted-foreground">The case is now pending review by the Decentralized Jury Court.</p>
                    </div>
                  ) : (
                    <div className="border-t border-border pt-4 space-y-3">
                      <h3 className="font-display font-semibold text-sm">Your Response Required</h3>
                      <p className="text-xs text-muted-foreground">You can either agree to cancel and refund, or submit your defense to the Jury Court.</p>
                      <Button variant="outline" className="w-full text-warning border-warning/50 hover:bg-warning/10" onClick={handleArtistAgreeRefund}>
                        Agree to Cancel & Refund
                      </Button>
                      <Button className="w-full gap-2 glow-primary" onClick={() => setArtistEvidenceOpen(true)}>
                        <FileText className="h-4 w-4" /> Submit Defense & Escalate
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6 flex flex-col items-center justify-center h-full text-center py-6">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-2">
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-2">Funds are Secured</h3>
                    <p className="text-sm text-muted-foreground px-4">
                      The commissioner has locked the AUSD in the smart contract. You can safely communicate with them off-chain and begin your work.
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </main>

      {/* 弹窗组件保持不变 */}
      <AlertDialog open={releaseOpen} onOpenChange={setReleaseOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-display"><CheckCircle2 className="h-5 w-5 text-success" /> Confirm Fund Release</AlertDialogTitle>
            <AlertDialogDescription><strong>Warning: This action is irreversible.</strong> Funds will be sent to the Artist immediately via Smart Contract.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-success text-success-foreground hover:bg-success/90" onClick={handleReleaseFunds}>{isProcessing ? "Processing..." : "Confirm Release"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={disputeOpen} onOpenChange={setDisputeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-display"><AlertTriangle className="h-5 w-5 text-destructive" /> Raise Dispute</AlertDialogTitle>
            <AlertDialogDescription><strong>Warning: Funds will be frozen on-chain</strong>. You will need to submit evidence to support your claim.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { setDisputeOpen(false); setEvidenceOpen(true); }}>Continue to Submit Evidence</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CommissionerEvidenceModal open={evidenceOpen} onOpenChange={setEvidenceOpen} onSubmitDispute={handleRaiseDispute} isProcessing={isProcessing} />
      <ArtistEvidenceModal open={artistEvidenceOpen} onOpenChange={setArtistEvidenceOpen} onSubmitted={handleArtistSubmitDefense} />
    </div>
  );
}