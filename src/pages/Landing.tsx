import { useState } from "react";
import { Shield, ShoppingBag, Palette, Gavel, Wallet, Lock, Scale, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

const stats = [
  { label: "Total Escrowed", value: "$2.4M+", icon: Lock },
  { label: "Cases Resolved", value: "1,200+", icon: Scale },
  { label: "Active Artists", value: "850+", icon: Palette },
];

const roles = [
  {
    key: "commissioner",
    label: "Commissioner",
    icon: ShoppingBag,
    description: "Create escrow contracts, lock funds on-chain, and commission artwork with full protection.",
    cta: "Enter as Commissioner",
  },
  {
    key: "artist",
    label: "Artist",
    icon: Palette,
    description: "Accept commissions, verify locked funds, deliver work, and get paid — guaranteed by smart contracts.",
    cta: "Enter as Artist",
  },
  {
    key: "juror",
    label: "Juror",
    icon: Gavel,
    description: "Review disputes, cast binding votes, and earn AVAX rewards for fair arbitration.",
    cta: "Enter as Juror",
  },
] as const;

export default function Landing() {
  const navigate = useNavigate();
  const [walletDialog, setWalletDialog] = useState<string | null>(null);
  const [jurorDialog, setJurorDialog] = useState(false);
  const [jurorAddress, setJurorAddress] = useState("");
  const [jurorVerifying, setJurorVerifying] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleRoleClick = (role: string) => {
    if (role === "juror") {
      setJurorDialog(true);
    } else {
      setWalletDialog(role);
    }
  };

  const handleWalletConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setWalletDialog(null);
      if (walletDialog === "commissioner") {
        navigate("/commissioner");
      } else if (walletDialog === "artist") {
        navigate("/artist");
      }
    }, 1500);
  };

  const handleJurorVerify = () => {
    if (!jurorAddress.trim()) return;
    setJurorVerifying(true);
    setTimeout(() => {
      setJurorVerifying(false);
      setJurorDialog(false);
      setJurorAddress("");
      navigate("/court");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold tracking-tight">
              Art<span className="text-primary">Guard</span>
            </span>
          </div>
        </div>
      </nav>

      <main className="container max-w-5xl py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Trustless Escrow for <span className="text-primary">Creative Commissions</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Lock funds on Avalanche, deliver artwork with confidence, and resolve disputes through decentralized arbitration. No middlemen, no chargebacks.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5 text-center">
              <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="font-mono text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Role Cards */}
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold text-center mb-2">Choose Your Role</h2>
          <p className="text-sm text-muted-foreground text-center mb-8">Connect your wallet and enter the platform</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {roles.map((role) => (
            <button
              key={role.key}
              onClick={() => handleRoleClick(role.key)}
              className="group relative rounded-xl border border-border bg-card p-8 text-left transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <role.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{role.label}</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{role.description}</p>
              <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                {role.cta} <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Wallet Connect Dialog (Commissioner / Artist) */}
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
            {connecting ? "Connecting..." : "Connect MetaMask"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Juror Badge Verification Dialog */}
      <Dialog open={jurorDialog} onOpenChange={setJurorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Gavel className="h-5 w-5 text-primary" /> Juror Verification
            </DialogTitle>
            <DialogDescription className="leading-relaxed">
              The Court is reserved for verified Jurors who hold a valid Juror Badge (SBT). 
              Please enter your wallet address so we can verify your credentials before granting access to the arbitration hall.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={jurorAddress}
              onChange={(e) => setJurorAddress(e.target.value)}
              placeholder="0x..."
              className="font-mono"
            />
            <Button
              onClick={handleJurorVerify}
              disabled={!jurorAddress.trim() || jurorVerifying}
              className="w-full gap-2 glow-primary"
            >
              {jurorVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
              {jurorVerifying ? "Verifying Badge..." : "Verify & Enter Court"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
