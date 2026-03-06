import { useState, useEffect } from "react";
import { Gavel, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, Loader2, ImageIcon, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { ethers } from "ethers";
import { ESCROW_ADDRESS, ESCROW_ABI } from "@/lib/contracts";

// 🔥 1. 第一道防线：法官 SBT 白名单（只允许 C 账户进入）
const JUROR_WHITELIST = [
  "0xfB9d218823Db78Ded9EAF4Ac9641EC38dD7122Eb" // 你的专属法官 C 账户
];

export default function Court() {
  const [disputedCases, setDisputedCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState("");

  const [isVoting, setIsVoting] = useState(false);
  const [txMessage, setTxMessage] = useState("");
  const [voteConfirmOpen, setVoteConfirmOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [supportBuyer, setSupportBuyer] = useState<boolean>(true);

  const fetchDisputedCases = async () => {
    if (!window.ethereum) return;
    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAccount(userAddress);

      const escrow = new ethers.Contract(ESCROW_ADDRESS, ESCROW_ABI, provider);
      const count = await escrow.orderCount();
      const fetched = [];

      for (let i = 1; i <= Number(count); i++) {
        const order = await escrow.orders(i);
        const statusNum = Number(order[3]);
        
        if (statusNum === 2) {
          const artistDefense = localStorage.getItem(`dispute_artist_${i}`);
          
          if (artistDefense) {
            const amountNum = Number(ethers.formatEther(order[2]));
            const buyerComplaint = localStorage.getItem(`dispute_buyer_${i}`) || "No complaint provided.";
            
            fetched.push({
              id: i.toString(),
              title: `On-Chain Escrow Dispute #${i}`,
              buyer: order[0],
              artist: order[1],
              amount: amountNum,
              buyerEvidence: buyerComplaint,
              artistEvidence: artistDefense
            });
          }
        }
      }
      setDisputedCases(fetched.reverse());
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputedCases();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', fetchDisputedCases);
    }
  }, []);

  const handlePrepareVote = (orderId: string, toBuyer: boolean) => {
    setSelectedOrder(orderId);
    setSupportBuyer(toBuyer);
    setVoteConfirmOpen(true);
  };

  const executeVote = async () => {
    if (!window.ethereum || !selectedOrder) return;
    try {
      setVoteConfirmOpen(false);
      setIsVoting(true);
      setTxMessage("Please sign the verdict in your MetaMask...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const escrow = new ethers.Contract(ESCROW_ADDRESS, ESCROW_ABI, signer);

      const tx = await escrow.castVote(selectedOrder, supportBuyer);
      
      setTxMessage("Verdict transaction pending on Avalanche...");
      await tx.wait(); 

      alert("Verdict cast successfully! The funds have been redistributed.");
      fetchDisputedCases(); 
    } catch (error: any) {
      console.error(error);
      alert("Voting failed: " + (error.reason || error.message));
    } finally {
      setIsVoting(false);
      setTxMessage("");
      setSelectedOrder(null);
    }
  };

  // 校验当前账号是否在白名单内
  const isAuthorized = account && (
    JUROR_WHITELIST.map(a => a.toLowerCase()).includes(account.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Navbar role="juror" />
      <main className="container max-w-4xl py-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
            <Gavel className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Decentralized Court</h1>
            <p className="text-sm text-muted-foreground">
              {account ? `Juror Wallet: ${account.slice(0,6)}...${account.slice(-4)}` : "Verify Identity..."}
            </p>
          </div>
        </div>

        {/* 🔴 第一道防线：如果不是 C 账户，直接拦截！ */}
        {!isAuthorized && account ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-destructive/30 bg-destructive/5 text-center px-4 mt-8">
             <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
               <Lock className="h-10 w-10 text-destructive" />
             </div>
             <h2 className="font-display text-2xl font-bold text-destructive mb-2">Access Denied</h2>
             <p className="text-muted-foreground max-w-md">
               Your wallet address is not on the Juror Whitelist. The Decentralized Court is restricted to verified art and legal experts holding the Juror SBT.
             </p>
          </div>
        ) : (
          /* 🟢 白名单法官（C账户）看到的真实法庭界面 */
          <>
            {txMessage && (
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-warning/30 bg-warning/10 p-4 animate-pulse">
                <ShieldAlert className="h-5 w-5 text-warning" />
                <p className="text-sm font-medium text-warning">{txMessage}</p>
              </div>
            )}

            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold border-b border-border pb-2 mb-4">
                Active Disputes Awaiting Verdict
              </h2>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                  <p>Scanning Avalanche for pending cases...</p>
                </div>
              ) : disputedCases.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-xl bg-secondary/30">
                  <CheckCircle2 className="h-10 w-10 text-success mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No active disputes ready for trial. Cases pending artist defense are hidden.</p>
                </div>
              ) : (
                disputedCases.map((c) => {
                  // 🔥 第二道防线：哪怕你是 C 账户法官，如果这个案子恰好是你买的画，依然锁死你！
                  const isPartyInvolved = account && (
                    account.toLowerCase() === c.buyer.toLowerCase() || 
                    account.toLowerCase() === c.artist.toLowerCase()
                  );

                  return (
                    <div key={c.id} className="rounded-xl border border-destructive/30 bg-card p-6 shadow-lg shadow-destructive/5 relative overflow-hidden">
                      
                      {/* 利益冲突遮罩 */}
                      {isPartyInvolved && (
                        <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-[1px] flex flex-col items-center justify-center">
                          <Lock className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="font-bold text-lg">Conflict of Interest</p>
                          <p className="text-sm text-muted-foreground">You are a party in this dispute. You cannot vote.</p>
                        </div>
                      )}

                      <div className={`transition-opacity ${isPartyInvolved ? 'opacity-30' : 'opacity-100'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-display text-lg font-bold text-destructive flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5" />
                              {c.title}
                            </h3>
                            <p className="text-xs font-mono text-muted-foreground mt-1">Order ID: {c.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Disputed Amount</p>
                            <p className="font-mono text-xl font-bold">{c.amount} AUSD</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 text-xs font-mono bg-secondary/30 p-3 rounded-lg border border-border">
                          <div>
                            <span className="text-muted-foreground block mb-1">Commissioner (Buyer):</span>
                            <span className="break-all">{c.buyer}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block mb-1">Artist (Seller):</span>
                            <span className="break-all">{c.artist}</span>
                          </div>
                        </div>

                        <div className="mb-6 space-y-3">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Evidence Files (IPFS)</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg border border-border bg-secondary/20 p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20 text-success text-xs font-bold">C</span>
                                <span className="text-xs font-semibold">Commissioner's Claim</span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-3 break-words">"{c.buyerEvidence}"</p>
                            </div>
                            <div className="rounded-lg border border-border bg-secondary/20 p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">A</span>
                                <span className="text-xs font-semibold">Artist's Defense</span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-3 break-words">"{c.artistEvidence}"</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Button 
                            variant="outline" 
                            className="w-full border-success/50 hover:bg-success/10 hover:text-success gap-2"
                            onClick={() => handlePrepareVote(c.id, true)}
                            disabled={isVoting || isPartyInvolved}
                          >
                            <ArrowLeft className="h-4 w-4" /> Refund Commissioner
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full border-primary/50 hover:bg-primary/10 hover:text-primary gap-2"
                            onClick={() => handlePrepareVote(c.id, false)}
                            disabled={isVoting || isPartyInvolved}
                          >
                            Pay Artist <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </main>

      <AlertDialog open={voteConfirmOpen} onOpenChange={setVoteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-display">
              <Gavel className="h-5 w-5 text-primary" /> Confirm Your Verdict
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              You are casting a binding on-chain vote to resolve Order #{selectedOrder}. 
              <br/><br/>
              Your decision: <strong className={supportBuyer ? "text-success" : "text-primary"}>{supportBuyer ? "Refund the Commissioner (Buyer)" : "Release funds to the Artist"}</strong>.
              <br/><br/>
              This action is final and will immediately transfer the locked funds.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isVoting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeVote} 
              className="glow-primary"
            >
              Cast Vote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}