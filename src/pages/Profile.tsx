import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { 
  Shield, Award, TrendingUp, Coins, User, Palette, Gavel, 
  ShoppingBag, FileText, Upload, Clock, CheckCircle2, XCircle, Link as LinkIcon, Search, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockContracts, mockJudgeProfile, getJudgeLevel, judgeLevels } from "@/data/contracts";

type Role = "commissioner" | "artist" | "juror";

const roleCards: { role: Role; label: string; icon: typeof User; description: string }[] = [
  { role: "commissioner", label: "Commissioner", icon: ShoppingBag, description: "Post commissions, manage contracts, release funds" },
  { role: "artist", label: "Artist", icon: Palette, description: "Accept commissions, upload deliverables, track income" },
  { role: "juror", label: "Juror", icon: Gavel, description: "Resolve disputes, earn AVAX rewards" },
];

const badges = [
  { name: "Verified Human", description: "Identity verified via Proof-of-Personhood", icon: Shield },
  { name: "Genesis Juror", description: "Early adopter juror — Season 1", icon: Award },
];

const judgeApplications = [
  {
    id: "APP-001",
    applicant: "0xA3...F7",
    portfolio: ["landscape_01.jpg", "portrait_02.jpg", "abstract_03.jpg"],
    experience: "5 years freelance illustration, 200+ NFT commissions completed.",
  },
  {
    id: "APP-002",
    applicant: "0xB9...12",
    portfolio: ["3d_model_01.jpg", "character_02.jpg"],
    experience: "3D artist specializing in game assets. Shipped 3 indie titles.",
  },
];

function ContractLinkParser() {
  const [link, setLink] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<typeof mockContracts[0] | null>(null);

  const handleParse = () => {
    if (!link.trim()) return;
    setParsing(true);
    setTimeout(() => {
      setParsed(mockContracts[0]);
      setParsing(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={link}
            onChange={(e) => { setLink(e.target.value); setParsed(null); }}
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
          <Button className="w-full gap-2 glow-primary" size="lg">
            <CheckCircle2 className="h-5 w-5" /> Accept Commission
          </Button>
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const judge = mockJudgeProfile;
  const judgeLevel = getJudgeLevel(judge.score);

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-background cyber-grid">
        <Navbar />
        <main className="container max-w-4xl py-8">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 border border-primary/30">
              <User className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">0x7F...3B</h1>
              <p className="text-sm text-muted-foreground">Select your role</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {roleCards.map((r) => (
              <button
                key={r.role}
                onClick={() => setSelectedRole(r.role)}
                className="group rounded-xl border border-border bg-card p-6 text-left transition-all hover:border-primary/40 hover:bg-secondary/50 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 group-hover:bg-primary/25 transition-colors">
                  <r.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold">{r.label}</h3>
                <p className="text-sm text-muted-foreground mt-2">{r.description}</p>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Navbar />
      <main className="container max-w-4xl py-8">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => setSelectedRole(null)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to role select
          </button>
          <div className="flex gap-1 rounded-lg bg-secondary p-1">
            {roleCards.map((r) => (
              <button
                key={r.role}
                onClick={() => setSelectedRole(r.role)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedRole === r.role ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Commissioner Panel */}
        {selectedRole === "commissioner" && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" /> Commissioner Dashboard
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground"><FileText className="h-4 w-4" /><span className="text-xs">Active Contracts</span></div>
                <p className="font-mono text-2xl font-bold">{mockContracts.filter(c => c.status !== "Disputed").length}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground"><TrendingUp className="h-4 w-4" /><span className="text-xs">Total Locked</span></div>
                <p className="font-mono text-2xl font-bold">$1,555</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /><span className="text-xs">In Dispute</span></div>
                <p className="font-mono text-2xl font-bold text-destructive">{mockContracts.filter(c => c.status === "Disputed").length}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-semibold text-sm text-muted-foreground">My Contracts</h3>
              {mockContracts.map(c => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                  <div>
                    <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                    <p className="text-sm font-medium">{c.projectName}</p>
                  </div>
                  <span className="font-mono text-sm">{c.amount} {c.currency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Artist Panel */}
        {selectedRole === "artist" && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" /> Artist Workspace
            </h2>

            {/* Contract Link Parser */}
            <div className="rounded-xl border border-primary/20 bg-card p-5 space-y-3">
              <h3 className="font-display font-semibold text-sm flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-primary" /> Accept New Commission
              </h3>
              <p className="text-xs text-muted-foreground">Paste the contract link sent by the Commissioner to view and accept the commission.</p>
              <ContractLinkParser />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
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
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Accepted commissions will appear here. Accept a contract via the link parser above to start working.</p>
            </div>
          </div>
        )}

        {/* Juror Panel */}
        {selectedRole === "juror" && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <Gavel className="h-5 w-5 text-primary" /> Juror Dashboard
            </h2>
            
            {/* Judge Level */}
            <div className="rounded-xl border border-primary/20 bg-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold">Juror Level</h3>
                <span className={`font-display font-bold text-lg ${judgeLevel.color}`}>
                  {judgeLevel.label}
                </span>
              </div>
              <div className="w-full rounded-full bg-secondary h-2">
                <div 
                  className="h-2 rounded-full bg-primary transition-all" 
                  style={{ width: `${Math.min((judge.score / 500) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Score: {judge.score}</span>
                <span>Accuracy: {(judge.accuracy * 100).toFixed(0)}%</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {judgeLevels.map(l => (
                  <div key={l.level} className={`rounded-lg p-2 border ${l.level === judgeLevel.level ? 'border-primary/40 bg-primary/10' : 'border-border'}`}>
                    <p className={`font-display font-bold text-sm ${l.color}`}>{l.label}</p>
                    <p className="text-xs text-muted-foreground">{l.minScore}+ pts</p>
                    <p className="text-xs text-muted-foreground">≤{l.maxAmount ? `$${l.maxAmount}` : '∞'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground"><TrendingUp className="h-4 w-4" /><span className="text-xs">Total Cases</span></div>
                <p className="font-mono text-2xl font-bold">{judge.totalCases}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground"><Award className="h-4 w-4" /><span className="text-xs">Correct</span></div>
                <p className="font-mono text-2xl font-bold">{judge.correctCases}<span className="text-sm text-muted-foreground">/{judge.totalCases}</span></p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground"><Coins className="h-4 w-4" /><span className="text-xs">Total Earned</span></div>
                <p className="font-mono text-2xl font-bold">{judge.totalEarned} <span className="text-sm text-muted-foreground">AVAX</span></p>
              </div>
            </div>

            {/* SBT Badges */}
            <div>
              <h3 className="font-display text-lg font-semibold mb-4">Soulbound Badges (SBTs)</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {badges.map((badge) => (
                  <div key={badge.name} className="flex items-center gap-4 rounded-xl border border-primary/20 bg-card p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15">
                      <badge.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-sm">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Governance */}
            <div>
              <h3 className="font-display text-lg font-semibold mb-1">New Juror Applications</h3>
              <p className="text-sm text-muted-foreground mb-4">As a Mid+ Juror, you can review new applicants.</p>
              {judgeLevel.level === "junior" ? (
                <div className="rounded-xl border border-border bg-card p-5 text-center">
                  <p className="text-sm text-muted-foreground">Mid level or above required to review applications</p>
                </div>
              ) : (
                judgeApplications.map((app) => (
                  <div key={app.id} className="rounded-xl border border-border bg-card p-5 space-y-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs text-muted-foreground">{app.id}</span>
                        <h4 className="font-display font-semibold">{app.applicant}</h4>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{app.experience}</p>
                    <div className="flex gap-2 flex-wrap">
                      {app.portfolio.map((file) => (
                        <div key={file} className="flex h-20 w-20 items-center justify-center rounded-lg bg-secondary border border-border text-xs font-mono text-muted-foreground">
                          {file.split("_")[0]}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <Button className="gap-2 flex-1 bg-success text-success-foreground hover:bg-success/90">
                        <CheckCircle2 className="h-4 w-4" /> Approve & Mint SBT
                      </Button>
                      <Button variant="destructive" className="gap-2 flex-1">
                        <XCircle className="h-4 w-4" /> Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
