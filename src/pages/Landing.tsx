import { useState, useEffect, useRef } from "react";
import { Shield, ShoppingBag, Palette, Gavel, Wallet, Lock, Scale, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { mockDisputes } from "@/data/contracts";

// 🔥 1. 引入真实的区块链连接引擎
import { ethers } from "ethers";

// 🔥 2. 告诉代码检查员 Window 里有钱包，防止红线报错
declare global { interface Window { ethereum: any; } }

const stats = [
  { label: "Total Escrowed", value: "$2.4M+", icon: Lock },
  { label: "Cases Resolved", value: "1,200+", icon: Scale },
  { label: "Active Artists", value: "850+", icon: Palette },
];

const roles = [
  {
    key: "commissioner",
    label: "I'm a Commissioner",
    icon: ShoppingBag,
    description: "Commission artwork with funds locked on-chain.",
    cta: "Enter as Commissioner",
  },
  {
    key: "artist",
    label: "I'm an Artist",
    icon: Palette,
    description: "Accept commissions and get paid — guaranteed.",
    cta: "Enter as Artist",
  },
  {
    key: "juror",
    label: "I'm a Juror",
    icon: Gavel,
    description: "Review disputes and earn rewards for fair arbitration.",
    cta: "Enter as Juror",
  },
] as const;

/* Animated showcase: cycles between court cases and platform tagline */
function CourtShowcase() {
  const [phase, setPhase] = useState<"cases" | "tagline">("cases");
  const [scrollY, setScrollY] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Animate scroll for cases, then switch to tagline
  useEffect(() => {
    let frame: number;
    let start: number;

    const cycle = () => {
      // Phase 1: scroll cases for ~4s
      setPhase("cases");
      setScrollY(0);
      start = Date.now();

      const animate = () => {
        const elapsed = Date.now() - start;
        if (elapsed < 4000) {
          setScrollY(elapsed * 0.04); // slow scroll
          frame = requestAnimationFrame(animate);
        } else {
          // Phase 2: show tagline for 3s
          setPhase("tagline");
          intervalRef.current = setTimeout(cycle, 3000);
        }
      };
      frame = requestAnimationFrame(animate);
    };

    cycle();
    return () => {
      cancelAnimationFrame(frame);
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, []);

  const cases = [...mockDisputes, ...mockDisputes]; // double for seamless scroll

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border bg-card/80">
      {/* Cases phase */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${phase === "cases" ? "opacity-100" : "opacity-0"}`}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Gavel className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-bold">Court</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Live dispute cases</p>
        </div>
        <div className="relative overflow-hidden" style={{ height: "calc(100% - 80px)" }}>
          <div
            className="px-6 space-y-3 absolute inset-x-0"
            style={{ transform: `translateY(-${scrollY}px)` }}
          >
            {cases.map((d, i) => (
              <div
                key={`${d.id}-${i}`}
                className="rounded-xl border border-border bg-secondary/40 p-4 space-y-2"
              >
                <h3 className="font-display font-bold text-sm leading-tight">{d.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{d.aiSummary}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-mono text-muted-foreground">#{d.id}</span>
                  <span className={`font-medium ${
                    d.requiredLevel === "senior" ? "text-primary" : 
                    d.requiredLevel === "mid" ? "text-warning" : "text-muted-foreground"
                  }`}>
                    Requires {d.requiredLevel.charAt(0).toUpperCase() + d.requiredLevel.slice(1)} Juror
                  </span>
                  <span className="text-muted-foreground">• {d.votes.length}/{d.totalJurors} voted</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tagline phase */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-opacity duration-700 ${phase === "tagline" ? "opacity-100" : "opacity-0"}`}
      >
        <Shield className="h-12 w-12 text-primary mb-4" />
        <h2 className="font-display text-3xl font-bold mb-3">
          Decentralized Art
          <br />
          <span className="text-primary">Commission Arbitration</span>
        </h2>
        <p className="text-sm text-muted-foreground mb-8 max-w-sm">
          Trustless escrow on Avalanche. No middlemen, no chargebacks.
        </p>
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
          {stats.map((s) => (
            <div key={s.label} className="space-y-1">
              <s.icon className="h-4 w-4 text-primary mx-auto" />
              <p className="font-mono text-lg font-bold">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [walletDialog, setWalletDialog] = useState<string | null>(null);
  const [jurorDialog, setJurorDialog] = useState(false);
  const [jurorVerifying, setJurorVerifying] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleRoleClick = (role: string) => {
    if (role === "juror") {
      setJurorDialog(true);
    } else {
      setWalletDialog(role);
    }
  };

  // 🔥 3. 真实的连接钱包逻辑 (买家/画师)
  const handleWalletConnect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask extension first! (请先安装 MetaMask 钱包插件)");
      return;
    }
    
    try {
      setConnecting(true);
      // 唤起小狐狸钱包请求连接
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); 
      
      // 连接成功后，关闭弹窗并跳转到对应页面
      setWalletDialog(null);
      if (walletDialog === "commissioner") {
        navigate("/commissioner");
      } else if (walletDialog === "artist") {
        navigate("/artist");
      }
    } catch (error) {
      console.error("Connection failed:", error);
      alert("Failed to connect wallet. (连接钱包失败或被拒绝)");
    } finally {
      setConnecting(false);
    }
  };

  // 🔥 4. 真实的法官验证逻辑 (MVP阶段也是连钱包)
  const handleJurorVerify = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask extension first! (请先安装 MetaMask 钱包插件)");
      return;
    }
    
    try {
      setJurorVerifying(true);
      // 唤起小狐狸钱包请求连接
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); 
      
      // 模拟验证 SBT 勋章的时间 (让体验更真实)
      setTimeout(() => {
        setJurorDialog(false);
        navigate("/court");
      }, 1000);
      
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Failed to connect wallet. (连接钱包失败或被拒绝)");
    } finally {
      setJurorVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Minimal navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-center">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold tracking-tight">
              Art<span className="text-primary">Guard</span>
            </span>
          </div>
        </div>
      </nav>

      {/* Split layout */}
      <main className="container py-8">
        <div className="grid gap-8 lg:grid-cols-2 min-h-[calc(100vh-8rem)]">
          {/* Left: Court showcase */}
          <div className="hidden lg:block">
            <CourtShowcase />
          </div>

          {/* Right: Role selection */}
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-center mb-2">
              Select Your Role
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-8">
              Connect your wallet and enter the platform
            </p>

            <div className="space-y-4 max-w-md mx-auto w-full">
              {roles.map((role) => (
                <button
                  key={role.key}
                  onClick={() => handleRoleClick(role.key)}
                  className="group w-full flex items-center gap-4 rounded-xl border border-border bg-card/60 p-5 text-left transition-all hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <role.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-bold">{role.label}</h3>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </button>
              ))}
            </div>

            {/* Mobile stats */}
            <div className="grid grid-cols-3 gap-3 mt-10 lg:hidden">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
                  <s.icon className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="font-mono text-lg font-bold">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Wallet Connect Dialog */}
      <Dialog open={!!walletDialog} onOpenChange={(v) => { if (!v) setWalletDialog(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" /> Connect Wallet
            </DialogTitle>
            <DialogDescription>
              Connect your Web3 wallet to enter as {walletDialog === "commissioner" ? "Commissioner" : "Artist"}.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleWalletConnect} disabled={connecting} className="w-full gap-2 glow-primary">
            {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
            {connecting ? "Connecting to MetaMask..." : "Connect MetaMask"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Juror Verification Dialog */}
      <Dialog open={jurorDialog} onOpenChange={setJurorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Gavel className="h-5 w-5 text-primary" /> Juror Verification
            </DialogTitle>
            <DialogDescription className="leading-relaxed">
              The Court is reserved for verified Jurors who hold a valid Juror Badge (SBT). 
              Please connect your wallet so we can verify your credentials before granting access to the arbitration hall.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={handleJurorVerify}
            disabled={jurorVerifying}
            className="w-full gap-2 glow-primary"
          >
            {jurorVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
            {jurorVerifying ? "Verifying On-Chain Identity..." : "Connect MetaMask & Verify"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}