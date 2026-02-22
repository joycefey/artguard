import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Gavel, ArrowRight, Timer, User, FileImage, ArrowUpDown, Shield, ImageIcon } from "lucide-react";
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
      <div className="flex flex-col gap-1">
        <span className="font-display text-sm font-semibold">{dispute.title}</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">Dispute #{dispute.id}</span>
          <span className={`text-xs font-medium ${levelInfo.color}`}>
            需要 {levelInfo.labelCN} 审判员
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <span className="block font-mono text-sm font-semibold">{dispute.amount} {dispute.currency}</span>
          <span className="block rounded-md bg-primary/15 px-2 py-0.5 font-mono text-xs font-semibold text-primary mt-1">
            奖励: {dispute.reward} {dispute.rewardCurrency}
          </span>
        </div>
        {available ? (
          <div className="flex items-center gap-1">
            <span className="text-xs text-success font-medium">可审</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ) : (
          <Shield className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </button>
  );
}

function JudgeBench({ dispute, onBack }: { dispute: Dispute; onBack: () => void }) {
  const [countdown, setCountdown] = useState(5);
  const [canVote, setCanVote] = useState(false);

  useEffect(() => {
    setCountdown(5);
    setCanVote(false);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanVote(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [dispute.id]);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← 返回争议列表
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">难度: {"★".repeat(dispute.difficulty)}{"☆".repeat(5 - dispute.difficulty)}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {dispute.amount} {dispute.currency} at stake
          </span>
        </div>
      </div>

      <h2 className="font-display text-xl font-bold">{dispute.title}</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Buyer's Complaint */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <h3 className="font-display font-semibold text-sm">买家投诉</h3>
            <span className="ml-auto font-mono text-xs text-muted-foreground">{dispute.buyer}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{dispute.buyerComplaint}</p>
          <div>
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><ImageIcon className="h-3 w-3" /> 图片证据:</p>
            <div className="flex gap-2 flex-wrap">
              {dispute.buyerImages.map((f) => (
                <span key={f} className="rounded bg-secondary px-2 py-1 text-xs font-mono text-muted-foreground">{f}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Seller's Evidence */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <FileImage className="h-4 w-4 text-primary" />
            <h3 className="font-display font-semibold text-sm">卖家证据</h3>
            <span className="ml-auto font-mono text-xs text-muted-foreground">{dispute.seller}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{dispute.sellerEvidence}</p>
          <div>
            <p className="text-xs text-muted-foreground mb-2">提交文件:</p>
            <div className="flex gap-2 flex-wrap">
              {dispute.sellerFiles.map((f) => (
                <span key={f} className="rounded bg-secondary px-2 py-1 text-xs font-mono text-muted-foreground">{f}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Voting */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold">投票裁决</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">判对 +{dispute.difficulty * 10}分 | 判错 -{dispute.difficulty * 5}分</span>
            {!canVote && (
              <div className="flex items-center gap-2 text-warning">
                <Timer className="h-4 w-4" />
                <span className="font-mono text-sm font-semibold">{countdown}s</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          反垃圾机制：请仔细审查双方证据。投票将在 5 秒审查期后启用。
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            size="lg"
            variant="secondary"
            className={`gap-2 transition-all ${canVote ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-primary" : "opacity-50 cursor-not-allowed"}`}
            disabled={!canVote}
          >
            退款给买家
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className={`gap-2 transition-all ${canVote ? "bg-success text-success-foreground hover:bg-success/90 glow-success" : "opacity-50 cursor-not-allowed"}`}
            disabled={!canVote}
          >
            付款给卖家
          </Button>
        </div>
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
      // Sort by available first, then by amount
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
      <Navbar />
      <main className="container max-w-4xl py-8">
        {!selected ? (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Gavel className="h-6 w-6 text-primary" />
                <h1 className="font-display text-3xl font-bold">公开法庭</h1>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  公开争议案件。你的等级: <span className={`font-semibold ${judgeLevel.color}`}>{judgeLevel.labelCN}</span> (积分: {mockJudgeProfile.score})
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
                按金额排序
              </Button>
              <Button
                variant={sortMode === "available" ? "default" : "secondary"}
                size="sm"
                className="gap-2"
                onClick={() => setSortMode("available")}
              >
                <Shield className="h-3.5 w-3.5" />
                按可审排序
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
