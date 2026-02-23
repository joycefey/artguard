import { useState, useEffect, useMemo, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Gavel, ArrowRight, Timer, User, FileImage, ArrowUpDown, Shield, ImageIcon, Eye, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockDisputes, type Dispute, getJudgeLevel, mockJudgeProfile, judgeLevels } from "@/data/contracts";

type SortMode = "amount" | "available";

function DisputeCard({ dispute, onSelect, available }: { dispute: Dispute; onSelect: () => void; available: boolean }) {
  const levelInfo = judgeLevels.find(l => l.level === dispute.requiredLevel)!;
  return (
    <button
      onClick={available ? onSelect : undefined}
      disabled={!available}
      className={`group w-full flex items-center justify-between rounded-lg border bg-card p-4 text-left transition-colors ${
        available 
          ? "border-border hover:border-primary/30 hover:bg-secondary/50 cursor-pointer" 
          : "border-border/50 opacity-50 cursor-not-allowed"
      }`}
    >
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="font-display text-sm font-semibold">{dispute.title}</span>
        <p className="text-xs text-muted-foreground line-clamp-1">{dispute.aiSummary}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono text-xs text-muted-foreground">#{dispute.id}</span>
          <span className={`text-xs font-medium ${levelInfo.color}`}>
            Requires {levelInfo.label} Juror
          </span>
          <span className="text-xs text-muted-foreground">
            • {dispute.votes.length}/{dispute.totalJurors} voted
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0 ml-4">
        <div className="text-right">
          <span className="block font-mono text-sm font-semibold">{dispute.amount} {dispute.currency}</span>
          <span className="block rounded-md bg-primary/15 px-2 py-0.5 font-mono text-xs font-semibold text-primary mt-1">
            Reward: {dispute.reward} {dispute.rewardCurrency}
          </span>
        </div>
        {available ? (
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        ) : (
          <Lock className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </button>
  );
}

function JudgeBench({ dispute, onBack }: { dispute: Dispute; onBack: () => void }) {
  const [voted, setVoted] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [timerDone, setTimerDone] = useState(false);
  // Track which evidence items have been clicked
  const [viewedBuyer, setViewedBuyer] = useState<Set<number>>(new Set());
  const [viewedSeller, setViewedSeller] = useState<Set<number>>(new Set());

  const totalBuyerItems = dispute.buyerImages.length + 1; // images + complaint text
  const totalSellerItems = dispute.sellerFiles.length + 1; // files + evidence text
  const allBuyerViewed = viewedBuyer.size >= totalBuyerItems;
  const allSellerViewed = viewedSeller.size >= totalSellerItems;
  const allViewed = allBuyerViewed && allSellerViewed;
  const canVote = timerDone && allViewed;

  useEffect(() => {
    setCountdown(10);
    setTimerDone(false);
    setViewedBuyer(new Set());
    setViewedSeller(new Set());
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [dispute.id]);

  const markBuyer = useCallback((idx: number) => {
    setViewedBuyer(prev => new Set(prev).add(idx));
  }, []);
  const markSeller = useCallback((idx: number) => {
    setViewedSeller(prev => new Set(prev).add(idx));
  }, []);

  if (voted) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 animate-slide-up">
        <CheckCircle2 className="h-16 w-16 text-success" />
        <h2 className="font-display text-2xl font-bold">Thank You for Your Vote</h2>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Your vote has been recorded. The verdict will be finalized once all jurors have voted. You will be notified of the result.
        </p>
        <Button onClick={onBack} className="gap-2 glow-primary">
          <ArrowRight className="h-4 w-4 rotate-180" /> Back to Court
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to cases
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Difficulty: {"★".repeat(dispute.difficulty)}{"☆".repeat(5 - dispute.difficulty)}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {dispute.amount} {dispute.currency} at stake
          </span>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold">{dispute.title}</h2>
        <p className="text-sm text-muted-foreground mt-1 italic">AI Summary: {dispute.aiSummary}</p>
      </div>

      {/* Voting progress */}
      <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3">
        <span className="text-xs text-muted-foreground">Jury Progress:</span>
        <div className="flex gap-1">
          {Array.from({ length: dispute.totalJurors }).map((_, i) => (
            <div
              key={i}
              className={`h-3 w-6 rounded-sm ${i < dispute.votes.length ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
        <span className="text-xs font-mono text-muted-foreground">{dispute.votes.length}/{dispute.totalJurors}</span>
        {dispute.votes.length >= dispute.totalJurors && (
          <span className="text-xs text-success font-medium ml-auto">Auto-settlement triggered</span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Commissioner's Complaint */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <h3 className="font-display font-semibold text-sm">Commissioner's Complaint</h3>
            <span className="ml-auto font-mono text-xs text-muted-foreground">{dispute.buyer}</span>
          </div>
          <button
            onClick={() => markBuyer(0)}
            className={`w-full text-left text-sm leading-relaxed rounded-lg p-3 border transition-colors ${
              viewedBuyer.has(0) ? "border-success/30 bg-success/5 text-muted-foreground" : "border-warning/30 bg-warning/5 hover:border-primary/30 cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-1 mb-1">
              {viewedBuyer.has(0) ? <CheckCircle2 className="h-3 w-3 text-success" /> : <Eye className="h-3 w-3 text-warning" />}
              <span className="text-xs font-medium">{viewedBuyer.has(0) ? "Reviewed" : "Click to review"}</span>
            </div>
            {dispute.buyerComplaint}
          </button>
          <div>
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><ImageIcon className="h-3 w-3" /> Image Evidence:</p>
            <div className="flex gap-2 flex-wrap">
              {dispute.buyerImages.map((f, i) => (
                <button
                  key={f}
                  onClick={() => markBuyer(i + 1)}
                  className={`rounded px-2 py-1 text-xs font-mono transition-colors ${
                    viewedBuyer.has(i + 1) ? "bg-success/15 text-success border border-success/20" : "bg-warning/15 text-warning border border-warning/20 hover:bg-warning/25 cursor-pointer"
                  }`}
                >
                  {viewedBuyer.has(i + 1) ? "✓ " : "⊙ "}{f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Artist's Evidence */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <FileImage className="h-4 w-4 text-primary" />
            <h3 className="font-display font-semibold text-sm">Artist's Defense</h3>
            <span className="ml-auto font-mono text-xs text-muted-foreground">{dispute.seller}</span>
          </div>
          <button
            onClick={() => markSeller(0)}
            className={`w-full text-left text-sm leading-relaxed rounded-lg p-3 border transition-colors ${
              viewedSeller.has(0) ? "border-success/30 bg-success/5 text-muted-foreground" : "border-warning/30 bg-warning/5 hover:border-primary/30 cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-1 mb-1">
              {viewedSeller.has(0) ? <CheckCircle2 className="h-3 w-3 text-success" /> : <Eye className="h-3 w-3 text-warning" />}
              <span className="text-xs font-medium">{viewedSeller.has(0) ? "Reviewed" : "Click to review"}</span>
            </div>
            {dispute.sellerEvidence}
          </button>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Submitted Files:</p>
            <div className="flex gap-2 flex-wrap">
              {dispute.sellerFiles.map((f, i) => (
                <button
                  key={f}
                  onClick={() => markSeller(i + 1)}
                  className={`rounded px-2 py-1 text-xs font-mono transition-colors ${
                    viewedSeller.has(i + 1) ? "bg-success/15 text-success border border-success/20" : "bg-warning/15 text-warning border border-warning/20 hover:bg-warning/25 cursor-pointer"
                  }`}
                >
                  {viewedSeller.has(i + 1) ? "✓ " : "⊙ "}{f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Voting */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold">Cast Your Vote</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Correct +{dispute.difficulty * 10}pts | Wrong -{dispute.difficulty * 5}pts</span>
            {!timerDone && (
              <div className="flex items-center gap-2 text-warning">
                <Timer className="h-4 w-4" />
                <span className="font-mono text-sm font-semibold">{countdown}s</span>
              </div>
            )}
          </div>
        </div>
        
        {!allViewed && timerDone && (
          <div className="rounded-lg bg-warning/10 border border-warning/20 p-3">
            <p className="text-xs text-warning font-medium flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              You must review all evidence before voting. Click each item above.
              ({viewedBuyer.size + viewedSeller.size}/{totalBuyerItems + totalSellerItems} reviewed)
            </p>
          </div>
        )}

        {!timerDone && (
          <p className="text-xs text-muted-foreground">
            Anti-spam: Please review both sides carefully. Voting unlocks after the review period.
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            size="lg"
            variant="secondary"
            className={`gap-2 transition-all ${canVote ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-primary" : "opacity-50 cursor-not-allowed"}`}
            disabled={!canVote}
            onClick={() => setVoted(true)}
          >
            Refund Commissioner
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className={`gap-2 transition-all ${canVote ? "bg-success text-success-foreground hover:bg-success/90 glow-success" : "opacity-50 cursor-not-allowed"}`}
            disabled={!canVote}
            onClick={() => setVoted(true)}
          >
            Pay Artist
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          5 jurors per case • Majority wins • Smart contract auto-settles after all votes
        </p>
      </div>
    </div>
  );
}

export default function Court() {
  const [selected, setSelected] = useState<Dispute | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("amount");
  const judgeLevel = getJudgeLevel(mockJudgeProfile.score);

  const levelOrder = { junior: 0, mid: 1, senior: 2 };

  const sortedDisputes = useMemo(() => {
    const copy = [...mockDisputes];
    if (sortMode === "amount") {
      copy.sort((a, b) => b.amount - a.amount);
    } else {
      copy.sort((a, b) => {
        const aAvail = levelOrder[a.requiredLevel] <= levelOrder[judgeLevel.level] ? 0 : 1;
        const bAvail = levelOrder[b.requiredLevel] <= levelOrder[judgeLevel.level] ? 0 : 1;
        if (aAvail !== bAvail) return aAvail - bAvail;
        return b.amount - a.amount;
      });
    }
    return copy;
  }, [sortMode, judgeLevel.level]);

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Navbar role="juror" />
      <main className="container max-w-4xl py-8">
        {!selected ? (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Gavel className="h-6 w-6 text-primary" />
                <h1 className="font-display text-3xl font-bold">Court</h1>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Open dispute cases. Your level: <span className={`font-semibold ${judgeLevel.color}`}>{judgeLevel.label}</span> (Score: {mockJudgeProfile.score})
                </p>
              </div>
            </div>

            {/* Sort buttons */}
            <div className="mb-4 flex gap-2">
              <Button
                variant={sortMode === "amount" ? "default" : "secondary"}
                size="sm"
                className="gap-2"
                onClick={() => setSortMode("amount")}
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort by Amount
              </Button>
              <Button
                variant={sortMode === "available" ? "default" : "secondary"}
                size="sm"
                className="gap-2"
                onClick={() => setSortMode("available")}
              >
                <Shield className="h-3.5 w-3.5" />
                Sort by Available
              </Button>
            </div>

            <div className="space-y-2">
              {sortedDisputes.map((d) => {
                const available = levelOrder[d.requiredLevel] <= levelOrder[judgeLevel.level];
                return (
                  <DisputeCard
                    key={d.id}
                    dispute={d}
                    onSelect={() => setSelected(d)}
                    available={available}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <JudgeBench dispute={selected} onBack={() => setSelected(null)} />
        )}
      </main>
    </div>
  );
}
