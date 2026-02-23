import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { 
  Shield, Award, TrendingUp, Coins, User, Gavel, 
  Clock, CheckCircle2, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockJudgeProfile, getJudgeLevel, judgeLevels } from "@/data/contracts";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

export default function Profile() {
  const judge = mockJudgeProfile;
  const judgeLevel = getJudgeLevel(judge.score);
  const [approveTarget, setApproveTarget] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [processedApps, setProcessedApps] = useState<Set<string>>(new Set());

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Navbar role="juror" />
      <main className="container max-w-4xl py-8">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 border border-primary/30">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">0x7F...3B</h1>
            <p className="text-sm text-muted-foreground">Juror Profile</p>
          </div>
        </div>

        <div className="space-y-6">
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
                    {processedApps.has(app.id) ? (
                      <div className="flex-1 text-center text-sm text-muted-foreground py-2">Processed</div>
                    ) : (
                      <>
                        <Button className="gap-2 flex-1 bg-success text-success-foreground hover:bg-success/90" onClick={() => setApproveTarget(app.id)}>
                          <CheckCircle2 className="h-4 w-4" /> Approve & Mint SBT
                        </Button>
                        <Button variant="destructive" className="gap-2 flex-1" onClick={() => setRejectTarget(app.id)}>
                          <XCircle className="h-4 w-4" /> Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Approve Confirmation */}
      <AlertDialog open={!!approveTarget} onOpenChange={(v) => !v && setApproveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-display">
              <CheckCircle2 className="h-5 w-5 text-success" /> Approve & Mint SBT
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will mint a Soulbound Token for the applicant, granting them Juror access. This action is recorded on-chain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-success text-success-foreground hover:bg-success/90" onClick={() => { if (approveTarget) setProcessedApps(prev => new Set(prev).add(approveTarget)); setApproveTarget(null); }}>
              Confirm & Mint
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation */}
      <AlertDialog open={!!rejectTarget} onOpenChange={(v) => !v && setRejectTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-display">
              <XCircle className="h-5 w-5 text-destructive" /> Reject Application
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this applicant? They will not receive a Juror SBT.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { if (rejectTarget) setProcessedApps(prev => new Set(prev).add(rejectTarget)); setRejectTarget(null); }}>
              Confirm Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
