import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Shield, Award, TrendingUp, Coins, CheckCircle2, XCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const badges = [
  { name: "Verified Human", description: "Identity verified via Proof-of-Personhood", icon: Shield },
  { name: "Genesis Judge", description: "Early adopter juror — Season 1", icon: Award },
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
  const [activeTab, setActiveTab] = useState<"stats" | "governance">("stats");

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Navbar />
      <main className="container max-w-4xl py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 border border-primary/30">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">0x7F...3B</h1>
            <p className="text-sm text-muted-foreground">Level 2 Judge · Member since Feb 2026</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg bg-secondary p-1">
          {(["stats", "governance"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "stats" ? "Stats & Badges" : "Governance"}
            </button>
          ))}
        </div>

        {activeTab === "stats" && (
          <div className="space-y-6 animate-slide-up">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs">Total Volume Secured</span>
                </div>
                <p className="font-mono text-2xl font-bold">$24,500</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span className="text-xs">Juror Reputation</span>
                </div>
                <p className="font-mono text-2xl font-bold">92<span className="text-sm text-muted-foreground">/100</span></p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Coins className="h-4 w-4" />
                  <span className="text-xs">Total Earned</span>
                </div>
                <p className="font-mono text-2xl font-bold">15 <span className="text-sm text-muted-foreground">AVAX</span></p>
              </div>
            </div>

            {/* SBT Badges */}
            <div>
              <h2 className="font-display text-lg font-semibold mb-4">Soulbound Badges (SBTs)</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {badges.map((badge) => (
                  <div key={badge.name} className="flex items-center gap-4 rounded-xl border border-primary/20 bg-card p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15">
                      <badge.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-sm">{badge.name}</h3>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "governance" && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <h2 className="font-display text-lg font-semibold mb-1">New Judge Applications</h2>
              <p className="text-sm text-muted-foreground mb-4">As a Level 2 Judge, you can approve or reject new juror applications.</p>
            </div>

            {judgeApplications.map((app) => (
              <div key={app.id} className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-muted-foreground">{app.id}</span>
                    <h3 className="font-display font-semibold">{app.applicant}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{app.experience}</p>
                <div className="flex gap-2 flex-wrap">
                  {app.portfolio.map((file) => (
                    <div
                      key={file}
                      className="flex h-20 w-20 items-center justify-center rounded-lg bg-secondary border border-border text-xs font-mono text-muted-foreground"
                    >
                      {file.split("_")[0]}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button className="gap-2 flex-1 bg-success text-success-foreground hover:bg-success/90">
                    <CheckCircle2 className="h-4 w-4" />
                    Approve & Mint SBT
                  </Button>
                  <Button variant="destructive" className="gap-2 flex-1">
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
