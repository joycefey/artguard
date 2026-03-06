import { useState, useEffect } from "react";
import { Palette, Upload, CheckCircle2, Coins, AlertTriangle, Clock, Loader2, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { StatusBadge } from "@/components/StatusBadge";

// 🔥 引入真实的区块链引擎
import { ethers } from "ethers";
import { ESCROW_ADDRESS, ESCROW_ABI } from "@/lib/contracts";

export default function ArtistDashboard() {
  const [realContracts, setRealContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState("");

  // 🔥 核心雷达：扫描区块链上属于我的订单
  const fetchContracts = async () => {
    if (!window.ethereum) return;
    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddr = await signer.getAddress();
      setAccount(userAddr);

      const escrow = new ethers.Contract(ESCROW_ADDRESS, ESCROW_ABI, provider);
      const count = await escrow.orderCount();
      const fetched = [];

      for (let i = 1; i <= Number(count); i++) {
        const order = await escrow.orders(i);
        
        // 🚨 过滤：只有当订单的“画师地址(order[1])” 等于 我当前的钱包地址，才显示！
        if (order[1].toLowerCase() === userAddr.toLowerCase()) {
          const statusNum = Number(order[3]);
          let statusStr = "Waiting";
          if (statusNum === 1 || statusNum === 3) statusStr = "Resolved";
          if (statusNum === 2) statusStr = "Disputed";

          const amountNum = Number(ethers.formatEther(order[2]));

          fetched.push({
            id: i.toString(),
            projectName: `On-Chain Escrow #${i}`,
            amount: amountNum,
            currency: "AUSD",
            status: statusStr,
          });
        }
      }
      setRealContracts(fetched.reverse());
    } catch (error) {
      console.error("Error fetching contracts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // 动态计算统计数据
  const inProgressCount = realContracts.filter(c => c.status === "Waiting").length;
  const completedCount = realContracts.filter(c => c.status === "Resolved").length;
  const totalEarned = realContracts
    .filter(c => c.status === "Resolved")
    .reduce((sum, c) => sum + c.amount, 0);

  const disputedContracts = realContracts.filter(c => c.status === "Disputed");
  const hasDisputes = disputedContracts.length > 0;

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Navbar role="artist" />
      <main className="container max-w-4xl py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">Artist Workspace</h1>
              <p className="text-sm text-muted-foreground font-mono">
                {account ? `Wallet: ${account.slice(0,6)}...${account.slice(-4)}` : "Scanning Identity..."}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={fetchContracts} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Dispute Alert Banner */}
        {hasDisputes && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 animate-pulse">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-semibold text-destructive">
                ⚠ You have {disputedContracts.length} contract{disputedContracts.length > 1 ? "s" : ""} under dispute!
              </p>
              <p className="text-xs text-destructive/80">
                Please review and submit your defense evidence to the Jury Court.
              </p>
            </div>
          </div>
        )}

        {/* 🔥 删除了原来虚假的“粘贴链接接单”模块，改为文字提示 */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-8">
          <h3 className="font-display font-semibold text-sm text-primary mb-1">How it works</h3>
          <p className="text-xs text-muted-foreground">
            When a commissioner creates an escrow using your wallet address, the funds are automatically locked in the Avalanche smart contract and will appear below. You can start working with 100% peace of mind.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground"><Upload className="h-4 w-4" /><span className="text-xs">In Progress</span></div>
            <p className="font-mono text-2xl font-bold">{inProgressCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground"><CheckCircle2 className="h-4 w-4" /><span className="text-xs">Completed</span></div>
            <p className="font-mono text-2xl font-bold">{completedCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground"><Coins className="h-4 w-4" /><span className="text-xs">Total Earned</span></div>
            <p className="font-mono text-2xl font-bold">{totalEarned.toLocaleString()} AUSD</p>
          </div>
        </div>

        {/* Accepted Contracts */}
        <h3 className="font-display font-semibold text-sm text-muted-foreground mb-3">My Commissions</h3>
        <div className="space-y-2">
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground animate-pulse">Syncing with Avalanche...</div>
          ) : realContracts.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-border rounded-xl bg-secondary/20 text-muted-foreground">
              No commissions yet. Share your wallet address with clients!
            </div>
          ) : (
            realContracts.map((c) => {
              const isDisputed = c.status === "Disputed";

              return (
                <Link
                  key={c.id}
                  to={`/contract/${c.id}?role=artist`}
                  className={`group flex items-center justify-between rounded-lg border p-4 transition-colors ${
                    isDisputed
                      ? "border-destructive/40 bg-destructive/5 hover:border-destructive/60"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
                    <div className="flex items-center gap-2">
                      {isDisputed && <AlertTriangle className="h-4 w-4 text-destructive" />}
                      <span className="font-mono text-sm font-medium">#{c.id}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{c.projectName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {isDisputed && (
                      <span className="flex items-center gap-1 text-xs text-destructive font-medium">
                        <Clock className="h-3 w-3" /> Action Required
                      </span>
                    )}
                    <span className="font-mono text-sm font-semibold">
                      {c.amount.toLocaleString()} <span className="text-xs text-muted-foreground">{c.currency}</span>
                    </span>
                    <StatusBadge status={c.status} />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}