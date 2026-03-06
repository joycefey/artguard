import { useState, useEffect } from "react";
import { Plus, ShoppingBag, FileText, TrendingUp, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContractRow } from "@/components/ContractRow";
import { CreateEscrowModal } from "@/components/CreateEscrowModal";
import { Navbar } from "@/components/Navbar";

// 🔥 1. 引入真实的区块链引擎和智能合约钥匙
import { ethers } from "ethers";
import { ESCROW_ADDRESS, ESCROW_ABI } from "@/lib/contracts";

export default function CommissionerDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  
  // 🔥 2. 新增真实数据状态
  const [realContracts, setRealContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState("");

  // 🔥 3. 核心雷达：扫描区块链上的真实订单
  const fetchContracts = async () => {
    if (!window.ethereum) return;
    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddr = await signer.getAddress();
      setAccount(userAddr); // 存下当前连上的钱包地址

      const escrow = new ethers.Contract(ESCROW_ADDRESS, ESCROW_ABI, provider);

      // 获取链上总订单数
      const count = await escrow.orderCount();
      const fetched = [];

      // 从 1 号订单开始一个个查
      for (let i = 1; i <= Number(count); i++) {
        const order = await escrow.orders(i);
        
        // 过滤：只有当订单的买家地址 === 我当前连的钱包地址，才显示出来！
        if (order[0].toLowerCase() === userAddr.toLowerCase()) {
          const statusNum = Number(order[3]);
          let statusStr = "Waiting";
          if (statusNum === 1 || statusNum === 3) statusStr = "Resolved";
          if (statusNum === 2) statusStr = "Disputed";

          const amountNum = Number(ethers.formatEther(order[2]));

          // 把链上生硬的数据，包装成漂亮 UI 需要的格式
          fetched.push({
            id: i.toString(),
            projectName: `On-Chain Escrow #${i}`, // 动态名字
            amount: amountNum,
            currency: "AUSD",
            status: statusStr,
            counterparty: order[1], // 画师地址
          });
        }
      }
      // 倒序排列，把最新的订单放在最上面
      setRealContracts(fetched.reverse());
    } catch (error) {
      console.error("Error fetching contracts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 页面一打开，就自动开启雷达扫描
  useEffect(() => {
    fetchContracts();
  }, []);

  // 🔥 4. 动态计算顶部的数据面板
  const activeContractsCount = realContracts.filter(c => c.status !== "Resolved").length;
  const disputedCount = realContracts.filter(c => c.status === "Disputed").length;
  const totalLockedValue = realContracts
    .filter(c => c.status !== "Resolved")
    .reduce((sum, c) => sum + c.amount, 0);

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
              {/* 显示真实的钱包地址 */}
              <p className="text-sm text-muted-foreground font-mono">
                {account ? `Wallet: ${account.slice(0,6)}...${account.slice(-4)}` : "Scanning Identity..."}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {/* 手动刷新雷达按钮 */}
            <Button variant="outline" onClick={fetchContracts} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button onClick={() => setModalOpen(true)} className="gap-2 glow-primary">
              <Plus className="h-4 w-4" /> Create New Escrow
            </Button>
          </div>
        </div>

        {/* 动态计算的真实 Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground"><FileText className="h-4 w-4" /><span className="text-xs">Active Contracts</span></div>
            <p className="font-mono text-2xl font-bold">{activeContractsCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground"><TrendingUp className="h-4 w-4" /><span className="text-xs">Total Locked</span></div>
            <p className="font-mono text-2xl font-bold">{totalLockedValue.toLocaleString()} AUSD</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /><span className="text-xs">In Dispute</span></div>
            <p className="font-mono text-2xl font-bold text-destructive">{disputedCount}</p>
          </div>
        </div>

        {/* 真实的 Contracts 列表 */}
        <div className="space-y-2">
          <h3 className="font-display font-semibold text-sm text-muted-foreground mb-3">My On-Chain Contracts</h3>
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground animate-pulse">Scanning Avalanche Blockchain...</div>
          ) : realContracts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-xl bg-secondary/20">
              No active contracts found on-chain. Create one!
            </div>
          ) : (
            realContracts.map((c) => (
              <ContractRow key={c.id} contract={c} />
            ))
          )}
        </div>
      </main>
      
      {/* 这里的弹窗目前还是壳子，下一步我们改造它 */}
      <CreateEscrowModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}