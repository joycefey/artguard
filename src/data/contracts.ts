export type Currency = "AUSD" | "AVAX" | "USDC";

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
  },
];
