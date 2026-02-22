export type Currency = "AUSD" | "AVAX" | "USDC";

export type JudgeLevel = "junior" | "mid" | "senior";

export interface JudgeLevelInfo {
  level: JudgeLevel;
  label: string;
  labelCN: string;
  minScore: number;
  maxAmount: number | null; // null = unlimited
  color: string;
}

export const judgeLevels: JudgeLevelInfo[] = [
  { level: "junior", label: "Junior", labelCN: "初级", minScore: 0, maxAmount: 1000, color: "text-muted-foreground" },
  { level: "mid", label: "Mid", labelCN: "中级", minScore: 200, maxAmount: 5000, color: "text-warning" },
  { level: "senior", label: "Senior", labelCN: "高级", minScore: 500, maxAmount: null, color: "text-primary" },
];

export function getJudgeLevel(score: number): JudgeLevelInfo {
  if (score >= 500) return judgeLevels[2];
  if (score >= 200) return judgeLevels[1];
  return judgeLevels[0];
}

export interface EscrowContract {
  id: string;
  counterparty: string;
  amount: number;
  currency: Currency;
  status: "Waiting" | "In Progress" | "Reviewing" | "Disputed";
  projectName: string;
  description: string;
  deadline: string;
  createdAt: string;
}

export const mockContracts: EscrowContract[] = [
  {
    id: "ESC-0x4A1",
    counterparty: "0xAB...F2",
    amount: 250,
    currency: "AUSD",
    status: "Reviewing",
    projectName: "Album Cover Art",
    description: "Custom album cover illustration with 3D elements and typography.",
    deadline: "2026-03-15",
    createdAt: "2026-02-10",
  },
  {
    id: "ESC-0x7B3",
    counterparty: "0xCD...89",
    amount: 5.5,
    currency: "AVAX",
    status: "In Progress",
    projectName: "NFT Collection",
    description: "10-piece generative art collection for mint.",
    deadline: "2026-03-01",
    createdAt: "2026-02-18",
  },
  {
    id: "ESC-0x9E5",
    counterparty: "0xEF...11",
    amount: 1200,
    currency: "USDC",
    status: "Disputed",
    projectName: "Brand Identity Package",
    description: "Full brand identity including logo, colors, and guidelines.",
    deadline: "2026-02-28",
    createdAt: "2026-02-05",
  },
  {
    id: "ESC-0x2C8",
    counterparty: "0x34...A7",
    amount: 100,
    currency: "AUSD",
    status: "Waiting",
    projectName: "Motion Graphics Intro",
    description: "15-second animated intro for YouTube channel.",
    deadline: "2026-04-01",
    createdAt: "2026-02-20",
  },
];

export interface Dispute {
  id: string;
  contractId: string;
  title: string;
  reward: number;
  rewardCurrency: Currency;
  buyerComplaint: string;
  sellerEvidence: string;
  buyer: string;
  seller: string;
  amount: number;
  currency: Currency;
  status: "Open" | "Resolved";
  difficulty: number; // 1-5, affects judge score
  requiredLevel: JudgeLevel;
  buyerImages: string[];
  sellerFiles: string[];
}

export const mockDisputes: Dispute[] = [
  {
    id: "DSP-882",
    contractId: "ESC-0x9E5",
    title: "Brand Identity Package - Quality Dispute",
    reward: 2,
    rewardCurrency: "AVAX",
    buyerComplaint: "The deliverables do not match the agreed-upon scope. The logo lacks the minimalist style we discussed, color palette deviates from the mood board, and brand guidelines document is incomplete (missing typography section).",
    sellerEvidence: "All deliverables were submitted on time. I provided 3 logo concepts as agreed, final color palette was approved in chat on Feb 15th. PSD source files with all layers are included. Guidelines cover logo usage, color, and spacing.",
    buyer: "0xEF...11",
    seller: "0x9E...A3",
    amount: 1200,
    currency: "USDC",
    status: "Open",
    difficulty: 3,
    requiredLevel: "mid",
    buyerImages: ["screenshot_1.png", "moodboard.jpg", "chat_log.png"],
    sellerFiles: ["layers.psd", "brand_guide.pdf", "colors.png"],
  },
  {
    id: "DSP-891",
    contractId: "ESC-0xB12",
    title: "3D Character Model - Deadline Missed",
    reward: 1.5,
    rewardCurrency: "AVAX",
    buyerComplaint: "Artist missed the deadline by 2 weeks. The model was delivered unrigged and with incorrect topology for animation. This is not usable for our game project.",
    sellerEvidence: "Client changed requirements mid-project (added rigging which wasn't in original scope). I delivered the base model on time. Rigging was additional work that I communicated would take extra time.",
    buyer: "0x22...B8",
    seller: "0x7A...C1",
    amount: 800,
    currency: "AUSD",
    status: "Open",
    difficulty: 2,
    requiredLevel: "junior",
    buyerImages: ["contract_scope.png", "delivery_date.png"],
    sellerFiles: ["model_v1.obj", "timeline_chat.pdf"],
  },
  {
    id: "DSP-903",
    contractId: "ESC-0xD44",
    title: "Luxury Logo - Plagiarism Claim",
    reward: 5,
    rewardCurrency: "AVAX",
    buyerComplaint: "The delivered logo is a near-identical copy of an existing brand. Reverse image search confirms this. I demand a full refund.",
    sellerEvidence: "The design was created from scratch. Similarities are coincidental as both use common geometric shapes. I can provide full Illustrator work files showing my design process layer by layer.",
    buyer: "0x55...C9",
    seller: "0xAA...D2",
    amount: 4500,
    currency: "USDC",
    status: "Open",
    difficulty: 5,
    requiredLevel: "senior",
    buyerImages: ["original_brand.png", "my_delivery.png", "reverse_search.png", "comparison.png"],
    sellerFiles: ["process.ai", "sketches.pdf", "layers.psd"],
  },
];

// Mock judge profile
export interface JudgeProfile {
  address: string;
  score: number;
  accuracy: number;
  totalCases: number;
  correctCases: number;
  totalEarned: number;
}

export const mockJudgeProfile: JudgeProfile = {
  address: "0x7F...3B",
  score: 320,
  accuracy: 0.85,
  totalCases: 20,
  correctCases: 17,
  totalEarned: 15,
};
