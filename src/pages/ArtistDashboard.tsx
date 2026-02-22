import { useState } from "react";
import { Palette, Upload, CheckCircle2, Coins, Link as LinkIcon, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { StatusBadge } from "@/components/StatusBadge";
import { mockContracts } from "@/data/contracts";

function ContractLinkParser() {
  const [link, setLink] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<typeof mockContracts[0] | null>(null);
  const [accepted, setAccepted] = useState(false);

  const handleParse = () => {
    if (!link.trim()) return;
    setParsing(true);
    setTimeout(() => {
      setParsed(mockContracts[0]);
      setParsing(false);
    }, 1500);
  };

  const handleAccept = () => {
    setAccepted(true);
    setTimeout(() => {
      setParsed(null);
      setLink("");
      setAccepted(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={link}
            onChange={(e) => { setLink(e.target.value); setParsed(null); setAccepted(false); }}
            placeholder="Paste contract link here..."
            className="pl-9"
          />
        </div>
        <Button onClick={handleParse} disabled={!link.trim() || parsing} className="gap-2">
          {parsing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Parse
        </Button>
      </div>

      {parsed && (
        <div className="rounded-xl border border-primary/20 bg-card p-5 space-y-4 animate-slide-up">
          <h3 className="font-display text-lg font-semibold">{parsed.projectName}</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground">Locked Amount</p>
              <p className="font-mono text-lg font-bold">{parsed.amount} <span className="text-sm text-muted-foreground">{parsed.currency}</span></p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground">Currency</p>
              <p className="font-mono text-lg font-bold">{parsed.currency}</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground">Deadline</p>
              <p className="font-mono text-lg font-bold">{parsed.deadline}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{parsed.description}</p>
          {parsed.referenceImages && parsed.referenceImages.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Reference Images:</p>
              <div className="flex gap-2">
                {parsed.referenceImages.map((img) => (
                  <span key={img} className="rounded bg-secondary px-2 py-1 text-xs font-mono text-muted-foreground">{img}</span>
                ))}
              </div>
            </div>
          )}
          <Button
            className="w-full gap-2 glow-primary"
            size="lg"
            onClick={handleAccept}
            disabled={accepted}
          >
            {accepted ? (
              <><CheckCircle2 className="h-5 w-5" /> Commission Accepted!</>
            ) : (
              <><CheckCircle2 className="h-5 w-5" /> Accept Commission</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ArtistDashboard() {
  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Navbar role="artist" />
      <main className="container max-w-4xl py-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
            <Palette className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Artist Workspace</h1>
            <p className="text-sm text-muted-foreground">Accept commissions and manage your work</p>
          </div>
        </div>

        {/* Link Parser */}
        <div className="rounded-xl border border-primary/20 bg-card p-5 space-y-3 mb-8">
          <h3 className="font-display font-semibold text-sm flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-primary" /> Accept New Commission
          </h3>
          <p className="text-xs text-muted-foreground">Paste the contract link sent by the Commissioner to view and accept the commission.</p>
          <ContractLinkParser />
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground"><Upload className="h-4 w-4" /><span className="text-xs">In Progress</span></div>
            <p className="font-mono text-2xl font-bold">2</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground"><CheckCircle2 className="h-4 w-4" /><span className="text-xs">Completed</span></div>
            <p className="font-mono text-2xl font-bold">8</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground"><Coins className="h-4 w-4" /><span className="text-xs">Total Earned</span></div>
            <p className="font-mono text-2xl font-bold">$4,200</p>
          </div>
        </div>

        {/* Accepted Contracts */}
        <h3 className="font-display font-semibold text-sm text-muted-foreground mb-3">Accepted Commissions</h3>
        <div className="space-y-2">
          {mockContracts.slice(0, 2).map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
                <span className="font-mono text-sm font-medium">{c.id}</span>
                <span className="text-sm text-muted-foreground">{c.projectName}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-semibold">
                  {c.amount.toLocaleString()} <span className="text-xs text-muted-foreground">{c.currency}</span>
                </span>
                <StatusBadge status={c.status} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
