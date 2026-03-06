import { useState, useEffect } from "react";
import { User, Gavel, Shield, Award, TrendingUp, CheckCircle2, Lock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ethers } from "ethers";

// 🔥 这里填入了你给的唯一法官 C 账户地址
const JUROR_WHITELIST = [
  "0xfB9d218823Db78Ded9EAF4Ac9641EC38dD7122Eb"
];

export default function Profile() {
  const [account, setAccount] = useState("");

  useEffect(() => {
    const fetchAccount = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setAccount(await signer.getAddress());
      }
    };
    fetchAccount();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', fetchAccount);
    }
  }, []);

  // 🔥 权限校验：只允许白名单内的地址访问
  const isAuthorized = account && (
    JUROR_WHITELIST.map(a => a.toLowerCase()).includes(account.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Navbar role="juror" />
      <main className="container max-w-4xl py-8">
        
        {/* 🔴 如果不是你的 C 账户，直接拦截！ */}
        {!isAuthorized && account ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-destructive/30 bg-destructive/5 text-center px-4 mt-8">
             <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
               <Lock className="h-10 w-10 text-destructive" />
             </div>
             <h2 className="font-display text-2xl font-bold text-destructive mb-2">Access Denied</h2>
             <p className="text-muted-foreground max-w-md">
               Your wallet address is not on the Juror Whitelist. Juror Profiles are restricted to verified legal experts holding the SBT Badge.
             </p>
          </div>
        ) : (
          /* 🟢 白名单法官看到的真实档案界面 */
          <div className="animate-slide-up">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 border border-primary/30">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight">
                  {/* 🔥 显示真实的法官地址 */}
                  {account ? `${account.slice(0,6)}...${account.slice(-4)}` : "Loading..."}
                </h1>
                <p className="text-sm text-muted-foreground">Juror Profile</p>
              </div>
            </div>

            <h2 className="font-display text-xl font-bold flex items-center gap-2 mb-4">
              <Gavel className="h-5 w-5 text-primary" /> Juror Dashboard
            </h2>

            <div className="rounded-xl border border-border bg-card p-6 mb-8 shadow-sm">
              <div className="flex justify-between items-end mb-2">
                <span className="font-semibold">Juror Level</span>
                <span className="text-primary font-bold">Mid</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full mb-2 overflow-hidden">
                <div className="h-full bg-primary w-[60%] rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mb-6">
                <span>Score: 320</span>
                <span>Accuracy: 85%</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
                  <p className="font-semibold text-muted-foreground">Junior</p>
                  <p className="text-xs text-muted-foreground">0+ pts</p>
                  <p className="text-xs text-muted-foreground">≤$1000</p>
                </div>
                <div className="rounded-lg border border-primary/50 bg-primary/10 p-4 text-center shadow-[inset_0_0_20px_rgba(var(--primary),0.1)]">
                  <p className="font-semibold text-primary">Mid</p>
                  <p className="text-xs text-primary/80">200+ pts</p>
                  <p className="text-xs text-primary/80">≤$5000</p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
                  <p className="font-semibold text-destructive">Senior</p>
                  <p className="text-xs text-muted-foreground">500+ pts</p>
                  <p className="text-xs text-muted-foreground">∞</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 mb-8">
              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground"><TrendingUp className="h-4 w-4" /><span className="text-xs">Total Cases</span></div>
                <p className="font-mono text-2xl font-bold">20</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground"><CheckCircle2 className="h-4 w-4" /><span className="text-xs">Correct</span></div>
                <p className="font-mono text-2xl font-bold">17<span className="text-sm text-muted-foreground">/20</span></p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground"><Award className="h-4 w-4" /><span className="text-xs">Total Earned</span></div>
                <p className="font-mono text-2xl font-bold">15 <span className="text-sm text-muted-foreground">AVAX</span></p>
              </div>
            </div>

            <h3 className="font-display font-semibold text-lg mb-4">Soulbound Badges (SBTs)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-success/10">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h4 className="font-bold">Verified Human</h4>
                  <p className="text-xs text-muted-foreground">Identity verified via Proof-of-Personhood</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold">Genesis Juror</h4>
                  <p className="text-xs text-muted-foreground">Early adopter juror — Season 1</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}